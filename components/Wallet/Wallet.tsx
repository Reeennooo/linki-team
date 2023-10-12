import styles from "./Wallet.module.scss"
import ArrRight from "public/assets/svg/arr-right.svg"
import Dollar from "public/assets/svg/dollar.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import React, { useEffect } from "react"
import { useLazyGetUserStatisticQuery } from "redux/api/user"

interface Props {
  props?: any
  addClass?: string
}

const Wallet: React.FC<Props> = ({ addClass, ...props }) => {
  const [getStatistics, { data: statistic }] = useLazyGetUserStatisticQuery()

  useEffect(() => {
    getStatistics(undefined, true)
  }, [getStatistics])

  return (
    <>
      <div className={`${styles["wallet"]} ${addClass ? addClass : ""}`} {...props}>
        <div className={`${styles["wallet__title"]}`}>
          <p>Wallet</p>
          <div className={`${styles["wallet__title-arrow"]}`}>
            <ArrRight className="svg-arr-right" width={5} />
          </div>
        </div>
        <div className={`${styles["wallet__data"]}`}>
          <div className={` ${styles["wallet__data-item"]}`}>
            <div className={`${styles.price}`}>
              <span>{<Dollar className="svg-arr-dollar" width={11} />}</span>
              <span>{statistic?.wallet.estimated || 0}</span>
            </div>
            <div className={`${styles["price-deskr"]}`}>Estimated</div>
          </div>
          <div className={`${styles["wallet__data-reserve"]}  ${styles["wallet__data-item"]}`}>
            <div className={`${styles.price}`}>
              <span>{<Dollar className="svg-arr-dollar" width={11} />}</span>
              <span>{statistic?.wallet.reserve || 0}</span>
            </div>
            <div className={`${styles["price-deskr"]}`}>Reserve</div>
          </div>
        </div>
        <div className={`${styles["wallet__btns"]}`}>
          <DefaultBtn txt="Withdraw" mod={"transparent-grey"} icon={"upl"} minWidth={false} />
        </div>
      </div>
    </>
  )
}

export default Wallet
