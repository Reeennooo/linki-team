import styles from "./UseCases.module.scss"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { createTitle } from "utils/createTitle"
import { title } from "process"
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

interface Props {
  addClass?: string
  sectionData?: {
    title?: any
    text?: string
    beforeTitle?: string
  }
}

const UseCases: React.FC<Props> = ({ addClass, sectionData }) => {
  const videoPlayer = useRef(null)
  const subtitleRef = useRef(null)
  const sectionRef = useRef(null)

  let beforeTitle, title, text
  if (sectionData) ({ beforeTitle, title, text } = sectionData)

  const sectionTitle = "Easy ways to build with Linki"
  let newSectionTitle

  if (title) {
    newSectionTitle = createTitle(title, styles)
  } else {
    newSectionTitle = createTitle(sectionTitle, styles)
  }

  useEffect(() => {
    const subtitle = subtitleRef.current
    const section = sectionRef.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)

    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
        },
      }
    )

    gsap.fromTo(
      subtitle,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top center",
        },
      }
    )
  })

  return (
    <section className={styles["usecases"]} ref={sectionRef} id="use-cases">
      <div className="container container--large">
        <div className={styles["wrapper"]}>
          <p className={styles["usecases__section-name"]}>{beforeTitle ? beforeTitle : "Use Casses"}</p>
          <h2
            className={`${styles["usecases__title"]} ${title ? styles["usecases__title2"] : ""}`}
            dangerouslySetInnerHTML={{ __html: `${newSectionTitle}` }}
          ></h2>
          {text ? (
            <p
              className={styles["usecases__subtitle"]}
              ref={subtitleRef}
              dangerouslySetInnerHTML={{ __html: `${text}` }}
            />
          ) : (
            <p className={styles["usecases__subtitle"]} ref={subtitleRef}>
              Linki plug into your organization <span>easy ways</span> to empower <br />
              agile <span>innovation</span> - augmenting current teams or tackling
              <br />
              greenfield opportunities.
            </p>
          )}

          <div className={styles["usecases__video"]}>
            <ReactPlayer
              ref={videoPlayer}
              url={"/assets/videos/mainpage/easy-ways-linki.mp4"}
              playing={true}
              width={"100%"}
              height={"100%"}
              loop={true}
              controls={false}
              playsinline={true}
              muted={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default UseCases
