import styles from "./TailCard.module.scss"
import Link from "next/link"

interface TailCardProps {
  icon?: string
  href?: string
  onClick?: () => void
}

const TailCard: React.FC<TailCardProps> = ({ icon, href, onClick }) => {
  const tailCardsClasses = ["tail-card", styles.item, href ? styles["item--link"] : ""].join(" ")
  if (href) {
    return (
      <Link href={href}>
        <a
          className={tailCardsClasses}
          onClick={() => {
            if (onClick) onClick()
          }}
        >
          {icon && <span className={styles.item__plus} />}
        </a>
      </Link>
    )
  } else {
    return (
      <div
        className={tailCardsClasses}
        onClick={() => {
          if (onClick) onClick()
        }}
      >
        {icon && <span className={styles.item__plus} />}
      </div>
    )
  }
}

export default TailCard
