import { io, Socket } from "socket.io-client"
import { WEBSOCKET_URL } from "utils/constants"

export const socket: Socket = io(WEBSOCKET_URL, {
  transports: ["websocket"],
  reconnectionDelay: 5000,
  reconnectionAttempts: 10,
  autoConnect: false,
})
