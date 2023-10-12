import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./ForExpertSection.module.scss"
import IconCheck from "public/assets/svg/check-bold.svg"
import ZeroSVG from "public/assets/mainpage/0.svg"
import { createTitle } from "utils/createTitle"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

const sectionTitle = createTitle("Find a great & fun job", styles)

interface Props {
  sectionData?: {
    subtitle: string
    btntxt: string
    facts: string[]
  }
}

const ForExpertSection: React.FC<Props> = ({ sectionData }) => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  const [forExpertFacts, setExpertFacts] = useState([
    "You'll be about 10% or 23%\n happier once you sign up",
    "Now you can choose whether to communicate\n with customers or simply work on a team",
    "This is truly a new way of\n working and earning",
  ])

  // - - - Новый текст
  let btntxt, subtitle, facts
  if (sectionData) ({ btntxt, subtitle, facts } = sectionData)
  useEffect(() => {
    if (facts) setExpertFacts(facts)
  }, [sectionData])
  // - - -

  useEffect(() => {
    ScrollTrigger.config({ autoRefreshEvents: "DOMContentLoaded,load,resize" })
    const section = sectionRef.current
    const image = imageRef.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)

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
          start: "20% bottom",
        },
      }
    )

    gsap.fromTo(
      image,
      {
        scale: 0.7,
      },
      {
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "center bottom",
        },
      }
    )
  }, [])

  return (
    <section
      className={`${styles["forexpert"]} ${sectionData ? styles["forexpert_newtxt"] : ""}`}
      ref={sectionRef}
      id={"for-expert"}
    >
      <div className="container container--large">
        <div className={styles["forexpert__wp"]}>
          <div className={styles["forexpert__img"]} ref={imageRef}>
            <img src="/assets/mainpage/background.png" className={styles["forexpert__img--background"]} />
            <div className={styles["forexpert__img--zero"]}>
              <img src="/assets/mainpage/zero.png" alt="0% comissions" />
              <div className={styles["forexpert__percent"]}>%</div>
              <span>
                F¥€K
                <br />
                Comissons
              </span>
            </div>
          </div>
          <div className={styles["forexpert__text"]}>
            <div className={styles["forexpert__title"]}>
              <span>For Expert</span>
              <h2 dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }} />
            </div>

            {/* - - - Добавление нового текста */}
            {subtitle ? (
              <p className={styles["forexpert__subtitle"]} dangerouslySetInnerHTML={{ __html: `${subtitle}` }} />
            ) : (
              <p className={styles["forexpert__subtitle"]}>
                Join the best teams, participate in exciting <br />
                projects, grow, earn more, and never pay a <br />
                large commission again.
              </p>
            )}

            <DefaultBtn txt={btntxt ? btntxt : "Get started now"} addClass={styles["forexpert__btn"]} href="/signup" />
          </div>
        </div>

        <div className={styles["forexpert__advantages"]}>
          {forExpertFacts.map((el, i) => {
            return (
              <div className={styles["forexpert__advantages-el"]} key={i}>
                <div className={styles["forexpert__check"]}>
                  <IconCheck />
                </div>
                <p>{el}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ForExpertSection
