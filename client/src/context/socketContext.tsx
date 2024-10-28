import type { ReactNode } from "react"
import type { Socket } from "socket.io-client"
import type { OnlineUser } from "../types/user"
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react"

import { io } from "socket.io-client"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setOnlineUsersAction } from "../features/user/userSlice"


// Определение типов для контекста сокета
interface ISocketContext {
  socket: Socket | null
}

// Создаем контекст с типизацией
const SocketContext = createContext<ISocketContext | undefined>(undefined)

// Хук для использования контекста
export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider",
    )
  }
  return context
}

// Определяем типы для провайдера
interface SocketContextProviderProps {
  children: ReactNode
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAppSelector(state => state.user)
  const previousOnlineUsersRef = useRef<OnlineUser[]>([]);
  const dispatch = useAppDispatch()

  // Функция для сравнения двух списков пользователей
  const hasUsersChanged = (newUsers: OnlineUser[], prevUsers: OnlineUser[]) => {
    if (newUsers.length !== prevUsers.length) return true;

    const newUserIds = newUsers.map((user) => user.id).sort();
    const prevUserIds = prevUsers.map((user) => user.id).sort();

    return newUserIds.some((id, index) => id !== prevUserIds[index]);
  };
  

  // Функция для подключения пользователя
  const connectionUser = useCallback(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_BASE_URL, {
        query: {
          userId: user.id,
        },
      })
   

      setSocket(newSocket)

      newSocket.on("getOnlineUsers", (users: OnlineUser[]) => {
        const prevUsers = previousOnlineUsersRef.current;

        // Проверяем, изменился ли список пользователей
        if (hasUsersChanged(users, prevUsers)) {
          dispatch(setOnlineUsersAction(users));
          previousOnlineUsersRef.current = users; // Обновляем реф
        }
      })

      // Возвращаем функцию для корректного закрытия соединения при размонтировании
      return () => {
        newSocket.close()
      }
    } else if (socket) {
      socket.close()
      setSocket(null)
    }
  }, [user]) // убираем socket из зависимостей

  // Используем useEffect для установления или закрытия соединения
  useEffect(() => {
    const cleanup = connectionUser()

    return cleanup // выполняем очистку, если подключение было открыто
  }, [connectionUser])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
