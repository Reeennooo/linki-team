import styles from "./ResetPasswordConfirm.module.scss"

interface Props {
  onClick(): void
}

const ResetPasswordConfirm: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <div className={`${styles["reset-confirm"]} `}>
        <div className={`${styles["reset-confirm__img"]}`}>
          <img src="/img/AuthLayout/2xsuccess-min.png" alt="avatar1" width={205} />
        </div>
        <h2 className={`${styles["reset-confirm__title"]}`}>Confirm Your Email</h2>
        <p className={`${styles["reset-confirm__txt"]}`}>
          {`We have sent an email to your email address. Follow the instructions in the email to update your password, or select "Login" if you don't want me to have your password at this time`}
        </p>
        <div className={`${styles["reset-confirm__btn"]}`}>
          <button className={`btn`} onClick={onClick}>
            Click here to resend
          </button>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordConfirm
