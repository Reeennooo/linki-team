import styles from "./AreaCard.module.scss"
import IconExperts from "public/assets/svg/user.svg"
import IconTeams from "public/assets/svg/Users.svg"
import Link from "next/link"

interface Props {
  text: string
  teams: number
  experts: number
  addClass?: string
}

const AreaCard: React.FC<Props> = ({ text, teams, experts, addClass }) => {
  return (
    <Link href="/signup">
      <div className={`${styles["area"]} ${addClass ? addClass : ""}`}>
        <span className={styles["area__txt"]}>{text}</span>
        <div className={styles["area__data"]}>
          <div className={styles["area__teams"]}>
            <IconTeams />
            <span>{teams} teams</span>
          </div>
          <div className={styles["area__experts"]}>
            <IconExperts />
            <span>{experts} experts</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AreaCard
