import { useEffect } from "react"
import { useAuth } from "hooks/useAuth"
import { useLazyCheckTokenQuery } from "redux/api/auth"
import { getCookie } from "cookies-next"
import { USER_TOKEN_COOKIE } from "utils/constants"
import { useRouter } from "next/router"
import { useLogout } from "hooks/useLogout"

const PageTriggers = (): any => {
  const { token } = useAuth()
  const [checkToken] = useLazyCheckTokenQuery()
  const tokenFromCookie = getCookie(USER_TOKEN_COOKIE)
  const router = useRouter()
  const logout = useLogout()

  useEffect(() => {
    if (tokenFromCookie && !token) {
      const fn = async () => await checkToken().unwrap()

      fn().catch(() => {
        logout()
        if (router.pathname === "/404") return
        router.push("/signin")
      })
    }
  }, [token, tokenFromCookie, checkToken])

  return null
}

export default PageTriggers
