import styles from "./DetailedPopupShareLink.module.scss"

interface Props {
  addClass?: string
}

const DetailedPopupShareLink: React.FC<Props> = ({ addClass }) => {
  return (
    <>
      <div className={`${styles["share-link-banner"]} ${addClass ? addClass : ""}`}>
        <div className={`${styles["share-link-banner__info"]}`}>
          <h4 className={`${styles["share-link-banner__title"]}`}>Referral program</h4>
          <p className={`${styles["share-link-banner__txt"]}`}>
            Invite an expert to our platform, take part<br></br> in our referral program and get bonus for us.
          </p>
        </div>
        <div className={`${styles["share-link-banner__img"]}`}>
          <img src="/assets/share-link-banner-min.png" alt="" />
        </div>
      </div>
    </>
  )
}

export default DetailedPopupShareLink
