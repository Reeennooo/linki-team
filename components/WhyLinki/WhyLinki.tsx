import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import styles from "./WhyLinki.module.scss"
import IconStar from "public/assets/svg/star.svg"
import IconCheck from "public/assets/svg/check-bold.svg"
import { createTitle } from "utils/createTitle"
import { useEffect, useRef } from "react"
import gsap from "gsap"

let bannerSteps = [
  {
    id: 1,
    title: "One Solution",
    text: "Briefly describe your \nidea or project",
  },
  {
    id: 2,
    title: "One Team",
    text: "Discuss details, terms and \ncost with the team leader",
  },
  {
    id: 3,
    title: "One Point Of Contact",
    text: "Get your project or idea done \nwith high quality and on time",
  },
]

let reasons = [
  {
    id: 1,
    title: "High entry barrier\n for talent",
    text: "Linki only features teams who have real-\nworld experience in their respective \nfields. You can always request more information about each team.",
  },
  {
    id: 2,
    title: "Predictable \nspending",
    text: "Plan your spending and optimize\n your expenses, pay only for the \nresult and don't waste money on \nsearching, hiring and firing.",
  },
  {
    id: 3,
    title: "Safety and \nSecurity",
    text: "We help you manage your remote business. Submit offers, sign contracts, track billable hours, create invoices, and receive payments all in one place safely, securely, and 24/7.",
  },
]

interface Props {
  sectionData?: {
    banner: {
      title: string
      subtitle: string
      beforeTitle: string
      facts: {
        id: number
        title: string
        text: string
      }[]
    }
    section: {
      title: string
      facts: {
        title: string
        text: string
      }[]
      tags: string
    }
  }
}

const WhyLinki: React.FC<Props> = ({ sectionData }) => {
  const bannerRef = useRef(null)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  // - - - Для вставки нового текста
  let newBannerText, newSectionText
  if (sectionData) ({ banner: newBannerText = null, section: newSectionText = null } = sectionData)

  function changeBannerFacts(newData) {
    if (!newData) return
    bannerSteps = bannerSteps.map((el, index) => {
      return newData[index]
    })
  }

  function changeSectionFacts(newData) {
    if (!newData) return
    reasons = reasons.map((el, index) => {
      return newData[index]
    })
  }

  if (newBannerText) {
    changeBannerFacts(newBannerText?.facts)
    changeSectionFacts(newSectionText?.facts)
  }
  // - - -

  let sectionTitle
  if (newSectionText?.title) {
    sectionTitle = createTitle(newSectionText.title, styles)
  } else {
    sectionTitle = createTitle("Why businesses need Linki", styles)
  }

  useEffect(() => {
    const banner = bannerRef.current
    const section = sectionRef.current
    const content = contentRef.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)

    gsap.fromTo(
      banner,
      {
        y: 100,
      },
      {
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 20%",
        },
      }
    )

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
          trigger: content,
          start: "center bottom",
        },
      }
    )
  })

  return (
    <section
      className={`${styles["why-linki"]} ${newBannerText ? styles["why-linki_new"] : ""}`}
      ref={sectionRef}
      id="for-client"
    >
      <div className={styles["why-linki__banner-wp"]}>
        <div className="container container--large">
          <div className={`${styles["why-linki__banner"]} `} ref={bannerRef}>
            <img src="/img/whylinki/banner.png" className={styles["why-linki__banner_bg"]} />

            <div className={styles["why-linki__banner-top"]}>
              <div className={styles["why-linki__banner-title"]}>
                {/* Вставка нового текста */}
                {newBannerText?.title ? (
                  <h2 dangerouslySetInnerHTML={{ __html: newBannerText.title }} />
                ) : (
                  <h2>
                    Find the
                    <br /> best team
                  </h2>
                )}
                {/* Вставка нового текста */}
                <span>{newBannerText?.beforeTitle ? newBannerText.beforeTitle : "For Client"}</span>
              </div>

              {/* Вставка нового текста */}
              {newBannerText?.subtitle ? (
                <p
                  className={styles["why-linki__banner-subtitle"]}
                  dangerouslySetInnerHTML={{ __html: newBannerText.subtitle }}
                />
              ) : (
                <p className={styles["why-linki__banner-subtitle"]}>
                  Cooperate with a network of independent team leaders to achieve
                  <br /> rapid progress or bring massive transformation
                </p>
              )}

              <DefaultBtn txt="Find a team" href="/signup" addClass={styles["why-linki__btn"]} />
            </div>

            <div className={styles["why-linki__banner-bottom"]}>
              {bannerSteps.map((step, index, arr) => (
                <div
                  key={step.id}
                  className={`
                  ${index + 1 !== arr.length ? styles["why-linki__step_line"] : ""} 
                  ${styles["why-linki__step"]}`}
                >
                  <div>
                    <div className={styles["why-linki__step-title"]}>
                      <IconStar />
                      {step.title}
                    </div>
                    <p className={styles["why-linki__step-sub"]}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles["why-need"]} ref={contentRef}>
        <div className="container container--large">
          <h2
            className={`${styles["why-need__title"]} ${newSectionText?.title ? styles["why-need__title_lg"] : ""}`}
            dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }}
          />
          <div className={styles["why-need__reasons"]}>
            {reasons.map((reason) => (
              <div className={styles["why-need__reason"]} key={reason.id}>
                <div className={styles["why-need__check"]}>
                  <IconCheck />
                </div>
                <p className={styles["why-need__reason-title"]}>{reason.title}</p>
                <p className={styles["why-need__reason-text"]}>{reason.text}</p>
              </div>
            ))}
          </div>

          {/* Вставка нового текста */}
          {newSectionText?.tags ? (
            <p className={styles["why-need__tags"]} dangerouslySetInnerHTML={{ __html: `${newSectionText?.tags}` }} />
          ) : (
            <p className={styles["why-need__tags"]}>
              <span>#</span>Flexibility <span>#</span>Competency deficit solution <span>#</span>Hypothesis testing{" "}
              <span>#</span>Transparency <span>#</span>Trusted professionals <span>#</span>Speed ​​in decision making{" "}
              <span>#</span>Cost reduction
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default WhyLinki
