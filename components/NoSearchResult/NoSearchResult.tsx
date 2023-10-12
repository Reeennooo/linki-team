import styles from "./NoSearchResult.module.scss"
import React from "react"

interface INoSearchResultProps {
  title?: string
  subtitle?: string
  img?: string
}

const NoSearchResult: React.FC<INoSearchResultProps> = ({
  title = "No search results",
  subtitle = "Check the spelling of the search query",
  img = "/assets/no-search-results.png",
}) => {
  return (
    <div className={`no-result ${styles["no-result"]}`}>
      <h2 className={styles["no-result__title"]}>{title}</h2>
      <p className={styles["no-result__subtitle"]}>{subtitle}</p>
      <img className={`no-result__img ${styles["no-result__img"]}`} src={img} alt={"no results"} />
    </div>
  )
}

export default NoSearchResult
