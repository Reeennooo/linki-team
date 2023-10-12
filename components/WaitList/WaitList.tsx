import React, { useEffect, useState } from "react"
import AuthSlider from "components/AuthLayout/AuthSlider/AuthSlider"
import styles from "./WaitList.module.scss"
import WaitListForm from "components/WaitList/WaitListForm/WaitListForm"
import WaitListThx from "components/WaitList/WaitListThx"
import WaitListModerating from "components/WaitList/WaitListModerating"
import { useAuth } from "hooks/useAuth"

const WaitList: React.FC = () => {
  const {
    user: { is_confirmed: userConfirmed },
  } = useAuth()

  const [userConfirmedType, setUserConfirmedType] = useState<number>(0)

  useEffect(() => {
    if (userConfirmed !== 0 && userConfirmed !== 1 && userConfirmed !== 2) return
    setUserConfirmedType(userConfirmed)
  }, [userConfirmed])

  return (
    <div className={styles.wrap}>
      <div className={styles.slider}>
        <AuthSlider isLogo />
      </div>
      <div className={styles.main}>
        {userConfirmedType === 0 ? (
          <WaitListForm setUserConfirmedType={setUserConfirmedType} />
        ) : userConfirmedType === 1 ? (
          <WaitListModerating />
        ) : (
          <WaitListThx />
        )}
      </div>
    </div>
  )
}

export default WaitList
