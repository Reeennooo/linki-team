import styles from "./TariffsSection.module.scss"
import TariffCard from "components/TariffCard/TariffCard"
import { useAuth } from "hooks/useAuth"
import { USER_TYPE_CUSTOMER, USER_TYPE_PM } from "utils/constants"
import { useLazyGetPortalQuery, useLazyGetSubscribeQuery } from "redux/api/user"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

const TariffsSection = () => {
  const {
    user: { type: userType, premium_subscribe: premiumSubscribe },
  } = useAuth()

  const tariffListVar = [
    {
      id: 1,
      type: "Basic",
      title: "Free",
      subtitle: "Free plan for all users",
      active: !premiumSubscribe,
      btnTxt: "Current plan",
      advantages: [
        "Ready-to-use contracts",
        "Basic Project Management Tool",
        "Ability to create Open Artels",
        "Reply to listed projects (up to 3-5 per day)",
        "Project/Job listing (up to 3 per month)",
      ],
    },
    {
      id: 2,
      type: "Pro",
      // price: "$35",
      // period: "year",
      active: premiumSubscribe,
      profit: {
        num: 58,
        txt: "vs our monthly plan $47",
      },
      plan: [
        { id: 1, txt: "Monthly", price: "$7", period: "month" },
        { id: 2, txt: "Yearly", price: "$35", period: "year", active: true },
      ],
      btnTxt: "Get Pro",
      isFree: false,
      advantages: [
        "All the features of Free Account",
        "Contact with all available freelancers and buyers on the platform",
        "Ability to create Closed Artels",
        "Customizable contracts",
        "Customizable Project Management Tool",
        "Branded profile",
        "Priority within dispute regulation",
        "Level filter within the project",
        "Knowledge Base for PM",
        "The opportunity to see other PM offers on the posted project",
      ],
    },
  ]

  const [getSubscribe, { data: subscrLink, isFetching: fatchingSubscr }] = useLazyGetSubscribeQuery()
  const [getPortal, { data: portalLink, isFetching: fatchingPortal }] = useLazyGetPortalQuery()

  const onClickCard = (id) => {
    if (id === 1) {
      try {
        getPortal()
          .unwrap()
          .then((res) => {
            if (res) {
              window.location.replace(res)
            }
          })
      } catch (err) {
        console.log("ERR")
      }
    } else if (id === 2) {
      try {
        getSubscribe()
          .unwrap()
          .then((res) => {
            if (res) {
              window.location.replace(res)
            }
          })
      } catch (err) {
        console.log("ERR")
      }
    }
  }

  const tariffList = tariffListVar.map((tariff) => {
    return <TariffCard onClick={onClickCard} id={tariff.id} key={tariff.id} {...tariff} />
  })

  return (
    <div className={styles.tariffs}>
      {/* <h2 className={styles.tariffs__title}>Choose your right plan</h2>
      <p className={styles.tariffs__subtitle}>
        {userType === USER_TYPE_PM
          ? "Upgrade to Pro & Get more Advantages"
          : "Upgrade to Premium & Get more Advantages"}
      </p> */}

      <div className={styles.tariffs__list}>{tariffList}</div>
    </div>
  )
}

export default TariffsSection
