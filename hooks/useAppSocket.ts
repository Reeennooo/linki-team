import { useEffect } from "react"
import { socket } from "packages/socket"
import { useAuth } from "hooks/useAuth"

const useAppSocket = () => {
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      socket.auth = { token: null }
      socket.off().disconnect()
    }

    if (!socket.connected && token) {
      socket.auth = { token }
      socket.connect()
    }

    // console.log("socket: ", socket)

    return () => {
      socket.off().disconnect()
    }
  }, [token])
}

export default useAppSocket
