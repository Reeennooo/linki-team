import styles from "./ProfileInfo.module.scss"
import IconPencil from "public/assets/svg/NotePencil.svg"
import IconArrDown from "public/assets/svg/arr-down.svg"
import { useState, useEffect, useRef, useMemo } from "react"
import ProgressBar from "components/ProgressBar/ProgressBar"
import { useAuth } from "hooks/useAuth"
import ProfilePremium from "components/ProfilePremium/ProfilePremium"
import ArrRight from "public/icons/arr-right-icon.svg"
import { useRouter } from "next/router"
import { USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import Link from "next/link"
import { calculatePercentagesFunction, generateImproveListFunction } from "utils/profileFillingCalculation"

interface Props {
  props?: any
  addClass?: string
  profileSetting?: boolean
}

const ProfileInfo: React.FC<Props> = ({ addClass, profileSetting, ...props }) => {
  const { user } = useAuth()

  const router = useRouter()

  const premiumStatus = user.type === USER_TYPE_PM ? true : false

  const calculatePercentages: number = useMemo(() => {
    return calculatePercentagesFunction(user)
  }, [user])

  const generateImproveList = useMemo(() => {
    const improveList = generateImproveListFunction(user)
    return (
      <>
        {improveList.length > 0 &&
          improveList.map((item) => {
            const handleClick = () => {
              if (router.pathname === `/settings/profile`) {
                router.replace({
                  query: { area: item.area },
                })
              } else {
                router.push({
                  pathname: `/settings/profile`,
                  query: { area: item.area },
                })
              }
              return false
            }
            if (item.name) {
              return (
                <div key={item.id} className={`${styles["profile-info__improve-item"]}`}>
                  <div onClick={handleClick}>{item.name}</div>
                  <div className={`${styles["profile-info__improve-percent"]}`}>
                    <button onClick={handleClick}></button>
                  </div>
                </div>
              )
            }
          })}
      </>
    )
  }, [user])

  const [listOpen, setListOpen] = useState(profileSetting ?? false)
  const [listWrappHeight, setListWrappHeight] = useState("50px")
  const listWrpRef = useRef(null)

  function getHeight() {
    return listWrpRef.current.clientHeight
  }
  useEffect(() => {
    if (listOpen && calculatePercentages < 100) {
      setListWrappHeight(getHeight())
    } else {
      setListWrappHeight("50px")
    }
  }, [listOpen])

  const listOpenHandler = () => {
    setListOpen(!listOpen)
  }
  return (
    <>
      <div
        className={`${styles["profile-info"]} ${addClass ? addClass : ""}
         ${profileSetting ? styles["profile-info--settings"] : ""}`}
        {...props}
      >
        {!profileSetting && (
          <div className={`${styles["profile-info__top"]}`}>
            <h4 className={`${styles["profile-info__title"]}`}>Profile information</h4>
            <h4 className={`${styles["profile-info__title-mob"]}`}>Profile</h4>
            <Link href={"/settings/profile"}>
              <a className={`${styles["profile-info__btn-desk"]}`}>
                <IconPencil />
              </a>
            </Link>
            <Link href={"/settings/profile"}>
              <a className={`${styles["profile-info__btn-mob"]}`}>
                <ArrRight className="svg-arr-right" width={5} />
              </a>
            </Link>
          </div>
        )}
        {premiumStatus && user.premium_subscribe && !profileSetting && <ProfilePremium mod={"desk"} />}
        <div
          className={`${styles["profile-info__content"]} ${
            profileSetting ? styles["profile-info__content--settings"] : ""
          }`}
        >
          <ProgressBar
            title={
              calculatePercentages < 100
                ? "Complete your profile"
                : "<span>Congratulation!</span><br /><br /> Your profile is complete"
            }
            progress={calculatePercentages}
            mod={"lg"}
          />
          {!profileSetting && (
            <div className={styles["profile-info__mob-note"]}>
              {calculatePercentages < 100 ? "Complete profile" : "Profile complete"}
            </div>
          )}
          <div className={`${styles["profile-info__improve"]}`}>
            {calculatePercentages < 100 && (
              <p className={`${styles["profile-info__improve-title"]}`}>Improve your profile by completing: </p>
            )}
            {calculatePercentages < 100 && (
              <div className={`${styles["profile-info__improve-list-wrp"]}`} style={{ height: listWrappHeight }}>
                <div ref={listWrpRef}>{generateImproveList}</div>
              </div>
            )}
            <div
              className={`${styles["profile-info__view-toggler"]} ${listOpen ? styles["is-active"] : ""}`}
              onClick={listOpenHandler}
            >
              {!profileSetting &&
                calculatePercentages < 100 &&
                generateImproveList?.props?.children.filter((el) => el).length > 3 && (
                  <>
                    {listOpen ? "Hide" : "View all"}
                    <IconArrDown />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileInfo
