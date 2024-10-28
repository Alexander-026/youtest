import { io, type Socket } from "socket.io-client"

const socket: Socket = io(import.meta.env.VITE_BASE_URL, {
  autoConnect: false,
})

export default socket
