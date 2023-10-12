import styles from "./TariffCard.module.scss"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import { useEffect, useState } from "react"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import List from "components/ui/List/List"

interface TariffCardProps {
  id: number
  type?: string
  active?: boolean
  title?: string
  subtitle?: string
  price?: string
  period?: string
  profit?: {
    num?: number
    txt?: string
  }
  plan?: {
    id: number
    txt: string
    active?: boolean
    price: string
  }[]
  btnTxt?: string
  freePeriod?: string
  isFree?: boolean
  advantages?: string[]
  onClick?: (id: number) => void
}

const TariffCard: React.FC<TariffCardProps> = ({
  type = "Basic",
  active,
  title,
  subtitle,
  price,
  period,
  profit,
  plan,
  btnTxt = "Activate",
  freePeriod = "14 days",
  isFree,
  advantages,
  onClick,
  id,
}) => {
  const tariffClasses = ["card", styles.card, active ? styles["card--is-active"] : ""].join(" ")

  const [planList, setPlanList] = useState([])
  const [activePlan, setActivePlan] = useState(null)

  useEffect(() => {
    if (!plan?.length) return
    setPlanList(plan)
    const activePlanItem = plan.filter((item) => item.active)
    setActivePlan(activePlanItem ? activePlanItem[0].id : plan[0].id)
  }, [])

  return (
    <div className={tariffClasses}>
      <div className={styles.card__header}>
        <p className={styles.card__type}>
          {type === "Pro" ? (
            <>
              <img src={"/assets/icons/crown-orange.svg"} alt={"pro"} />
              Pro
            </>
          ) : (
            type
          )}
        </p>

        {(title || price || plan) && (
          <h3 className={styles.card__title}>
            {title && title}
            {price && price}
            {plan && planList[activePlan - 1]?.price}
            {plan && <span>/{planList[activePlan - 1]?.period}</span>}
          </h3>
        )}

        {(subtitle || (profit?.num && profit?.txt)) && (
          <p className={styles.card__subtitle}>
            {subtitle && subtitle}
            {profit?.num && profit?.txt && (
              <>
                <span>Save {profit.num}%</span> {profit.txt}
              </>
            )}
          </p>
        )}

        {plan?.length > 0 && (
          <TabsLinear
            addClass={styles.card__tabs}
            list={planList}
            activeId={activePlan}
            onClick={(id) => {
              setActivePlan(id)
            }}
            mod={"toggle"}
          />
        )}
      </div>
      <DefaultBtn
        txt={active ? "Current plan" : isFree ? `Try ${freePeriod} free` : btnTxt}
        disabled={active ? true : undefined}
        minWidth={false}
        addClass={styles.card__btn}
        onClick={() => onClick(id)}
      />
      {advantages?.length > 0 && (
        <List
          list={advantages}
          hideOptions={{ hideTxt: "Hide", viewTxt: "View all Advantages", count: 2, active: false }}
          mod={"checked"}
        />
      )}
    </div>
  )
}

export default TariffCard
