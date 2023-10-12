import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useAppDispatch } from "hooks"
import { updateCurrentTeam } from "redux/slices/currentTeam"
import styles from "./TeamsGreeting.module.scss"
import { useEffect } from "react"
import { getCookie, removeCookies } from "cookies-next"
import { setDatalayer } from "utils/setDatalayer"
import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import { useAuth } from "hooks/useAuth"

interface Props {
  addClass?: string
}

const TeamsGreeting: React.FC<Props> = ({ addClass }) => {
  const { user } = useAuth()

  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      const authSoc = getCookie("auth_soc")
      if (!user?.id || !authSoc) return
      // @ts-ignore
      const parseAuth = JSON.parse(authSoc)
      setDatalayer({
        event: "autoEvent",
        eventCategory: "login",
        eventAction: parseAuth.type,
        eventLabel: parseAuth.provider,
        login: {
          email: user.email,
          role:
            user.type === USER_TYPE_CUSTOMER
              ? "Client"
              : user.type === USER_TYPE_PM
              ? "Project manager"
              : user.type === USER_TYPE_EXPERT
              ? "Expert"
              : "",
        },
      })
      removeCookies("auth_soc", { sameSite: "lax" })
    }, 0)
  }, [user.email, user?.id, user.type])

  const greet = () => {
    dispatch(updateCurrentTeam({ field: "greeting", data: true }))
  }
  return (
    <div className={`${styles["greeting"]} ${addClass ? addClass : ""}`}>
      <div className={`${styles["greeting__img"]}`}>
        <img src="/img/teams/team-illust-min.png" alt="" />
      </div>
      <h2 className={`${styles["greeting__title"]}`}>Create your dream team</h2>
      <p className={`${styles["greeting__subtitle"]}`}>
        In this section you can gather a new team or invite an existing one, add the necessary experts and fill out a
        team profile
      </p>
      <DefaultBtn txt={"Create a team"} onClick={greet} addClass={`${styles["greeting__btn"]}`} />
    </div>
  )
}

export default TeamsGreeting
