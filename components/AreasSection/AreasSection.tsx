import styles from "./AreasSection.module.scss"
import Link from "next/link"
import IconArrRight from "public/assets/svg/arr-right-big.svg"
import AreaCard from "components/AreaCard/AreaCard"
import { createTitle } from "utils/createTitle"
import { useEffect, useRef } from "react"
import gsap from "gsap"

const sectionTitle = createTitle("You can solve anything", styles)

const areasList = [
  {
    id: 9324923,
    text: "Programming \n& Tech",
    teams: 12,
    experts: 86,
  },
  {
    id: 6342225,
    text: "Music \n& Audio",
    teams: 26,
    experts: 123,
  },
  {
    id: 634225,
    text: "Graphics \n& Design",
    teams: 19,
    experts: 56,
  },
  {
    id: 63434653,
    text: "Video \n& Animation",
    teams: 24,
    experts: 69,
  },
  {
    id: 234256,
    text: "Digital \n Marketing",
    teams: 27,
    experts: 90,
  },
  {
    id: 6655555,
    text: "Digital \n Marketing",
    teams: 56,
    experts: 145,
  },
  {
    id: 43563462,
    text: "Writing \n& Translation",
    teams: 47,
    experts: 260,
  },
  {
    id: 77777777,
    text: "Blockchain",
    teams: 28,
    experts: 145,
  },
]

function renderAreas(el, index, arr) {
  if (index === 0) {
    return (
      <div key={el.id + arr[index + 1]?.id}>
        <AreaCard addClass={styles["areas__card"]} text={el.text} teams={el.teams} experts={el.experts} />
        <AreaCard
          addClass={styles["areas__card"]}
          text={arr[index + 1].text}
          teams={arr[index + 1].teams}
          experts={arr[index + 1].experts}
        />
      </div>
    )
  } else if (Number.isInteger(index / 2)) {
    return (
      <div key={el.id + arr[index + 1]?.id}>
        <AreaCard addClass={styles["areas__card"]} text={el.text} teams={el.teams} experts={el.experts} />

        {index + 1 >= arr.length ? (
          ""
        ) : (
          <AreaCard
            addClass={styles["areas__card"]}
            text={arr[index + 1]?.text}
            teams={arr[index + 1]?.teams}
            experts={arr[index + 1]?.experts}
          />
        )}
      </div>
    )
  }
}

const AreasSection: React.FC = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)
    const cards = gsap.utils.toArray(`.${styles["areas__card"]}`)

    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
        },
      }
    )
    gsap.fromTo(
      cards,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.2,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
        },
      }
    )
  })

  return (
    <section className={styles["areas"]} ref={sectionRef}>
      <div className="container container--large">
        <div className={styles["areas__title"]}>
          <h2 dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }} />
          <Link href="/signup">
            <a className={styles["areas__showall"]}>
              <span>Show all areas</span>
              <IconArrRight />
            </a>
          </Link>
        </div>
      </div>
      <div className={`container container--large ${styles["container"]}`}>
        <div className={styles["areas__wrapper"]}>{areasList.map((el, index, arr) => renderAreas(el, index, arr))}</div>
      </div>
    </section>
  )
}

export default AreasSection
