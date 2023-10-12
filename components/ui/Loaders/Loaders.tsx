import styles from "./Loaders.module.scss"

const LoaderUserInfo: React.FC = () => {
  return <div className={styles["loader-user-info"]} />
}

const LoaderEllipsis: React.FC = () => {
  return (
    <div className={styles["lds-ellipsis"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
const LinkiLoader: React.FC = () => {
  return (
    <div className={`${styles["linkiloader"]} preloader`}>
      <div className={styles["linkiloader-circles"]}></div>
      <svg
        className={styles["linkiloader-star"]}
        width="26"
        height="24"
        viewBox="0 0 26 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.4426 3.51905C18.9887 1.17302 16.0523 0 12.6282 0C9.20405 0 6.22893 1.17302 3.68472 3.51905C1.22824 5.86261 0 8.66947 0 11.9372C0 15.2048 1.22824 18.0511 3.68472 20.481C6.22893 22.8245 9.21179 24 12.6307 24C16.0497 24 18.9887 22.827 21.4452 20.481C23.9894 18.0511 25.2615 15.2024 25.2615 11.9372C25.2615 8.67194 23.9894 5.86508 21.4452 3.51905H21.4426ZM11.6683 16.2152C11.6683 16.7894 11.4438 17.2897 10.9974 17.7185C10.5665 18.13 10.0478 18.337 9.4466 18.337C8.84538 18.337 8.32158 18.13 7.8726 17.7185C7.44168 17.2921 7.22493 16.7894 7.22493 16.2152V7.76014C7.22493 7.18595 7.44168 6.69309 7.8726 6.27908C8.319 5.86754 8.84538 5.66054 9.4466 5.66054C10.0478 5.66054 10.5639 5.86754 10.9974 6.27908C11.4438 6.69063 11.6683 7.18595 11.6683 7.76014V16.2152ZM18.0314 16.2152C18.0314 16.7894 17.8069 17.2897 17.3605 17.7185C16.9296 18.13 16.4109 18.337 15.8097 18.337C15.2085 18.337 14.6847 18.13 14.2357 17.7185C13.8048 17.2921 13.588 16.7894 13.588 16.2152V13.0387C13.5932 12.4744 13.8074 11.9864 14.2331 11.5798C14.6795 11.1683 15.2059 10.9613 15.8071 10.9613C16.4083 10.9613 16.9244 11.1683 17.3579 11.5798C17.7991 11.9864 18.0211 12.4744 18.0262 13.0387V16.2152H18.0314ZM17.3605 9.26337C16.9296 9.67492 16.4109 9.88192 15.8097 9.88192C15.2085 9.88192 14.6847 9.67492 14.2357 9.26337C13.8048 8.83705 13.588 8.33433 13.588 7.76014C13.588 7.18595 13.8048 6.69309 14.2357 6.27908C14.6821 5.86754 15.2085 5.66054 15.8097 5.66054C16.4109 5.66054 16.927 5.86754 17.3605 6.27908C17.8069 6.69063 18.0314 7.18595 18.0314 7.76014C18.0314 8.33433 17.8069 8.83458 17.3605 9.26337Z"
          fill="url(#paint0_linear_906_17698)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_906_17698"
            x1="12.6307"
            y1="0"
            x2="12.6307"
            y2="23.9975"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6420FF" />
            <stop offset="1" stopColor="#A700FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export { LoaderUserInfo, LoaderEllipsis, LinkiLoader }
