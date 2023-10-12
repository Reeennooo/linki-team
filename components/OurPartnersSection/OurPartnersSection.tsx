import styles from "./OurPartnersSection.module.scss"
import { createTitle } from "utils/createTitle"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import IconGoogle from "public/assets/svg/partners/google.svg"
import IconEpam from "public/assets/svg/partners/epam.svg"
import IconMicrosoft from "public/assets/svg/partners/microsoft.svg"
import IconGitHub from "public/assets/svg/partners/github.svg"
import IconSumsub from "public/assets/svg/partners/sumsub.svg"
import IconOracle from "public/assets/svg/partners/oracle.svg"

interface Props {
  sectionData?: {
    title?: string
  }
}

const OurPartnersSection: React.FC<Props> = ({ sectionData }) => {
  const sectionRef = useRef(null)

  let sectionTitle

  if (sectionData) {
    sectionTitle = createTitle(sectionData.title, styles)
  } else {
    sectionTitle = createTitle("Our teams work with", styles)
  }

  useEffect(() => {
    const section = sectionRef.current
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
          start: "top 80%",
        },
      }
    )
  })
  return (
    <section className={styles["ourpartners"]} ref={sectionRef}>
      <div className="container container--large">
        <h2 className={styles["ourpartners__title"]} dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }} />
        <div className={styles["ourpartners__move-line"]}>
          <div className={styles["ourpartners__move-el"]}>
            <div className={styles["ourpartners__move-img"]}>
              <IconGoogle />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconEpam />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconMicrosoft />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconGitHub />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconSumsub />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconOracle />
            </div>
          </div>
          <div className={styles["ourpartners__move-el"]}>
            <div className={styles["ourpartners__move-img"]}>
              <IconGoogle />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconEpam />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconMicrosoft />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconGitHub />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconSumsub />
            </div>
            <div className={styles["ourpartners__move-img"]}>
              <IconOracle />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurPartnersSection
