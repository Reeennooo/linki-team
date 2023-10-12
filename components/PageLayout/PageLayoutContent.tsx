import { ReactNode } from "react"
import { useAppSelector } from "hooks"
import { selectUIState } from "redux/slices/uiSlice"
import { useAuth } from "hooks/useAuth"
import ProfilePremium from "components/ProfilePremium/ProfilePremium"
import { USER_TYPE_EXPERT } from "utils/constants"
import { selectonboardingRedux } from "redux/slices/onboarding"

interface Props {
  child: ReactNode
  aside?: ReactNode
  page?: "create" | "dashboard" | "tariffs"
  mod?: "content-flex" | "aside-mob-top" | "aside-tablet-top" | "no-top-padding"
  addClass?: string
}

const PageLayoutContent: React.FC<Props> = ({ child, aside, page, mod, addClass }) => {
  const { taskCreateSuccess } = useAppSelector(selectUIState)
  const orderReverse = (page === "create" || page === "tariffs") && !taskCreateSuccess

  const { user, isAuthenticated } = useAuth()
  const premiumStatus = user.type === USER_TYPE_EXPERT

  //ONBOARDING CODE
  const { startCreateProjectOnboarding } = useAppSelector(selectonboardingRedux)

  if (!isAuthenticated) return null

  return (
    <div className={`page-layout__content-wrp ${mod ?? ""} ${addClass ?? ""}`}>
      <div className={`page-layout__content ${orderReverse ? "order-reverse" : ""}`}>{child}</div>
      {aside ? (
        <>
          {page && page === "dashboard" && <p className={"page-layout__aside-title-mob"}>Profile Information</p>}
          {premiumStatus && page === "dashboard" && <ProfilePremium mod={"mob"} />}
          <div
            className={`page-layout__content-aside ${
              startCreateProjectOnboarding && page === "create" ? "page-layout__content-aside--onboarding" : ""
            } ${orderReverse ? "order-reverse" : ""} ${
              mod === "aside-mob-top" ? "page-layout__content-aside--mob-top" : ""
            }`}
          >
            {aside}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default PageLayoutContent
