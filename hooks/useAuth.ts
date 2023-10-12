import { useAppSelector } from "./index"
import { AuthState, selectAuth } from "redux/slices/auth"
import { useMemo } from "react"

export const useAuth = (): AuthState => {
  const stateAuth = useAppSelector(selectAuth)

  return useMemo(() => stateAuth, [stateAuth])
}
