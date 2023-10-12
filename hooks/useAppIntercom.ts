import { useCallback, useEffect } from "react"
import Intercom, { IntercomUserData, loadIntercom } from "packages/intercom"
import { getUnixTimestamp } from "utils/formatters"
import { Router, useRouter } from "next/router"
import { getUserTypeStr } from "utils/getUserTypeStr"
import { IS_DEV } from "utils/constants"
import { useAuth } from "hooks/useAuth"

export const useAppIntercom = () => {
  const { pathname } = useRouter()

  const { user } = useAuth()
  const onDone = useCallback(() => {
    Intercom.update({ last_request_at: getUnixTimestamp(new Date()) })
  }, [])

  useEffect(() => {
    Router.events.on("routeChangeComplete", onDone)
    Router.events.on("routeChangeError", onDone)

    return () => {
      Router.events.off("routeChangeComplete", onDone)
      Router.events.off("routeChangeError", onDone)
    }
  }, [])

  useEffect(() => {
    if (pathname !== "/promo-team-launch" && pathname !== "/promo-team" && pathname !== "/promo-team-project") {
      try {
        loadIntercom(async () => {
          const userData: IntercomUserData = {}
          try {
            if (user.email) {
              userData.name = user.name ?? ""
              userData.surname = user.surname ?? ""
              userData.role = getUserTypeStr(user.type)
              const response = await fetch(`/api/sign?str=${user.email}`)
              const result = await response.json()
              if (result.hash) {
                userData.email = user.email
                userData.created_at = getUnixTimestamp(user.created_at)
                userData.user_hash = result.hash
              }
            }
          } catch (err) {
            if (IS_DEV) {
              console.log(">>> Intercom[/api/sign]: ", err)
            }
          } finally {
            Intercom.boot(userData)
          }
        })
      } catch (err) {
        if (IS_DEV) {
          console.log(">>> Intercom: ", err)
        }
      }
    }
  }, [user.created_at, user.email, user.name, user.surname, user.type])
}
