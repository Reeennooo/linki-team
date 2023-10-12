import { useAppDispatch } from "hooks/index"
import { api } from "redux/api"
import { logout } from "redux/slices/auth"
// import Intercom from "packages/intercom"

export function useLogout(): () => void {
  const dispatch = useAppDispatch()

  return () => {
    dispatch(logout())
    dispatch(api.util.resetApiState())
    // Intercom.shutdown()
    // Intercom.boot()
  }
}
