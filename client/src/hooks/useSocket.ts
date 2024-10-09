// import io from "socket.io-client"
// import { useCallback, useEffect, useState } from "react"
// import { useAppSelector } from "../app/hooks"



// const useSocket = () => {
//     const { user } = useAppSelector(state => state.user)
//     const [socket, setSocket] = useState<any>(null)
//     const connnectHandler = useCallback(() => {
//         if (user) {
//           const socket = io(
//             // import.meta.env.VITE_LOCAL_URL, 
//             `${import.meta.env.VITE_BASE_URL}/public`, 
//             {
//             query: {
//               userId: user.id,
//             },
//           })
    
//           setSocket(socket)
    
//           socket.on("getOnlineUsers", users => {
//             console.log("Online Users", users)
//           })
    
//           return () => socket.close()
//         } else {
//           if (socket) {
//             socket.close()
//           }
//         }
//       }, [user])
    
//       useEffect(() => {
//         connnectHandler()
//       }, [connnectHandler])
// }

// export default useSocket