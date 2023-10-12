import PortfolioInfoLink from "components/PortfolioInfoLink/PortfolioInfoLink"
import { useEffect } from "react"
import ReactTooltip from "react-tooltip"
import styles from "./DetailedPopupPortfolio.module.scss"

interface Props {
  portfolio: {
    description?: string
    id: number
    image_url?: string
    site_name?: string
    title?: string
    url: string
  }[]
  addClass?: string
  companyTitle?: string
}

const DetailedPopupPortfolio: React.FC<Props> = ({ portfolio, companyTitle, addClass }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])
  return (
    <>
      <div className={`${styles.portfolio} ${addClass ? addClass : ""}`}>
        {companyTitle ? (
          <h3 className={`${styles["portfolio__title"]}`}>
            Company: <span>{companyTitle}</span>
          </h3>
        ) : (
          <h3 className={`${styles["portfolio__title"]}`}>Portfolio</h3>
        )}

        {portfolio.length &&
          portfolio.map((portItem) => {
            return (
              <PortfolioInfoLink
                key={portItem.id}
                img={portItem.image_url ? portItem.image_url : "generate"}
                url={portItem.url}
                site={portItem.title}
                text={portItem.description}
                id={portItem.id}
                isLink={true}
              />
            )
          })}
      </div>
    </>
  )
}

export default DetailedPopupPortfolio
