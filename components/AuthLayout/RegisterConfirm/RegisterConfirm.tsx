import styles from "./RegisterConfirm.module.scss"
import { useRouter } from "next/router"
import { useLogout } from "hooks/useLogout"
import { useEffect, useState } from "react"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  email: string
  onClick(): void
}

const RegisterConfirm: React.FC<Props> = ({ email, onClick }) => {
  const router = useRouter()
  const logout = useLogout()

  const defaultResendTime = 120
  const [timerActive, setTimerActive] = useState(false)
  const [seconds, setSeconds] = useState(defaultResendTime)

  useEffect(() => {
    let interval = null
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
      if (seconds <= 0) {
        clearInterval(interval)
        setTimerActive(!timerActive)
      }
    } else if (!timerActive && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timerActive, seconds])

  const handleResend = () => {
    setSeconds(defaultResendTime)
    setTimerActive(!timerActive)
  }

  return (
    <>
      <div className={`${styles["register-confirm"]} `}>
        <div className={`${styles["register-confirm__img"]}`}>
          <img src="/img/AuthLayout/2xsuccess-min.png" alt="avatar1" width={205} />
        </div>
        <h2 className={`${styles["register-confirm__title"]}`}>Confirm Your Email</h2>
        <p className={`${styles["register-confirm__txt"]}`}>
          Please take a moment to verify your email address. We&apos;ve sent an email with a verification link to{" "}
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <a href="#">{email}</a>. If you haven't received the email, check your spam folder.
        </p>
        <div className={`${styles["register-confirm__btn"]}`}>
          <button
            className={`btn`}
            onClick={() => {
              onClick()
              handleResend()
            }}
            disabled={timerActive ? true : undefined}
          >
            Click here to resend
          </button>
          <button
            className={`btn btn--white`}
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            Go to home page
          </button>
          {timerActive && (
            <p className={styles["register-confirm__resend-txt"]}>
              You can resend the email in: {Math.floor(seconds / 60)}:
              {seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default RegisterConfirm
