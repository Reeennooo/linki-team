import styles from "./LinkiSolves.module.scss"
import gsap from "gsap"
import { useEffect, useRef } from "react"

interface Props {
  addClass?: string
}

const LinkiSolves: React.FC<Props> = ({ addClass }) => {
  const titleRef = useRef(null)
  const illustRef = useRef()
  const step1Ref = useRef()
  const step2Ref = useRef()
  const step3Ref = useRef()
  const step31Ref = useRef()
  const step4Ref = useRef()
  const step41Ref = useRef()
  const step5Ref = useRef()
  const step6Ref = useRef()
  const step7Ref = useRef()
  const step8Ref = useRef()
  const step9Ref = useRef()
  const step10Ref = useRef()
  const step11Ref = useRef()
  const step12Ref = useRef()
  const step13Ref = useRef()
  const step14Ref = useRef()
  const step141Ref = useRef()

  useEffect(() => {
    const title = titleRef.current
    const illust = illustRef.current
    const step1 = step1Ref.current
    const step2 = step2Ref.current
    const step3 = step3Ref.current
    const step31 = step31Ref.current
    const step4 = step4Ref.current
    const step41 = step41Ref.current
    const step5 = step5Ref.current
    const step6 = step6Ref.current
    const step7 = step7Ref.current
    const step8 = step8Ref.current
    const step9 = step9Ref.current
    const step10 = step10Ref.current
    const step11 = step11Ref.current
    const step12 = step12Ref.current
    const step13 = step13Ref.current
    const step14 = step14Ref.current
    const step141 = step141Ref.current

    const matchMedia = gsap.matchMedia()

    matchMedia.add(
      {
        isMobile: "(max-width: 575px)",
        isMobileBig: "(min-width: 576px) and (max-width: 991px)",
        isTablet: "(min-width: 992px) and (max-width: 1350px)",
        isDesktop: "(min-width: 1351px)",
      },
      (context) => {
        const { isMobile, isMobileBig, isTablet, isDesktop } = context.conditions
        const timeLine = gsap
          .timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
              trigger: illust,
            },
          })
          .to(illust, { opacity: 1, duration: 0 })
          .fromTo(step1, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" })
          .fromTo(step2, { x: 0, opacity: 0 }, { x: 51, opacity: 1, duration: 0.3 })
          .fromTo([step3, step31], { scale: 0, y: 40 }, { scale: 1, y: 0, duration: 0.4 })
          .fromTo([step4, step41], { scale: 0, y: 40 }, { scale: 1, y: 0, duration: 0.4 })
          .fromTo(
            step5,
            isMobile ? { y: -40, opacity: 0, rotate: 90 } : { x: -40, opacity: 0 },
            isMobile ? { y: 0, opacity: 1, rotate: 90, duration: 0.3 } : { x: 0, opacity: 1, duration: 0.3 }
          )
          .fromTo(step6, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" })
          .fromTo(
            step7,
            isTablet || isDesktop ? { x: -70, scale: 0 } : { y: -70, scale: 0, rotate: 90 },
            isTablet || isDesktop
              ? { scale: 1, x: 0, duration: 0.5, ease: "back.out(1.7)" }
              : { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
          )
          .fromTo(
            [step8, step9],
            isTablet || isDesktop ? { y: -470, scale: 0.2, opacity: 0 } : { x: 200, scale: 0.2, opacity: 0 },
            isTablet || isDesktop
              ? { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1)", stagger: 0.1 }
              : { scale: 1, opacity: 1, x: 0, duration: 0.4, ease: "back.out(1)", stagger: 0.1 }
          )
          .to(
            step10,
            isDesktop
              ? { y: 100, duration: 0.6 }
              : isTablet
              ? { y: 70, duration: 0.6 }
              : isMobileBig
              ? { x: -69, duration: 0.6 }
              : { x: -122, duration: 0.6 }
          )
          .to(
            step10,
            isDesktop
              ? { x: 48, duration: 0.6 }
              : isTablet
              ? { x: 36, duration: 0.6 }
              : isMobileBig
              ? { y: 10, duration: 0.6 }
              : { y: 21, duration: 0.6 }
          )
          .to(
            step10,
            isDesktop
              ? { y: 182, duration: 0.6 }
              : isTablet
              ? { y: 135, duration: 0.6 }
              : isMobileBig
              ? { y: 10, duration: 0.6 }
              : { y: 21, duration: 0 }
          )
          .fromTo(
            step11,
            isTablet || isDesktop ? { x: -70, scale: 0 } : { y: -70, scale: 0, rotate: 90 },
            isTablet || isDesktop
              ? { scale: 1, x: 0, duration: 0.5, ease: "back.out(1.7)" }
              : { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
          )
          .fromTo(step12, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" })
          .fromTo(
            step13,
            isMobile ? { y: -40, opacity: 0, rotate: 90 } : { x: -40, opacity: 0 },
            isMobile ? { y: 0, opacity: 1, rotate: 90, duration: 0.3 } : { x: 0, opacity: 1, duration: 0.3 }
          )
          .fromTo([step14, step141], { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)", stagger: 0.1 })
      }
    )

    gsap.fromTo(
      title,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.1,
        scrollTrigger: {
          trigger: title,
        },
      }
    )
  }, [])
  return (
    <section id="howworks" className={`${styles["linki-solves"]} ${addClass ? addClass : ""}`}>
      <div className="container">
        <h2 className={`section-title ${styles["linki-solves__title"]}`} ref={titleRef}>
          How <span>linki</span> solves the problem
        </h2>
        <div className={`${styles["linki-solves-card"]} ${styles["mobile"]}`}>
          <p className={`${styles["linki-solves-card__title"]}`}>
            <span>Top talent</span> in product building
          </p>
          <p className={`${styles["linki-solves-card__txt"]}`}>
            Creating a high-quality product requires excellent logic, thorough product knowledge and an understanding of
            how to connect the various phases of product development into one final working project. We set the bar
            high, every member of our platform is verified by us, so we unsure that we have people with the necessary
            expertise for every stage of your project creation.
          </p>
        </div>
        <div className={`${styles["linki-solves-illustration"]}`} ref={illustRef} style={{ opacity: 0 }}>
          <div className={`${styles["linki-solves-illustration__client-arrow"]}`} ref={step2Ref}>
            <img src="/img/linki-solves-illustration/arrow.svg" alt="" />
          </div>
          <div className={`${styles["linki-solves-illustration__client"]}`} ref={step1Ref}>
            <span>Client</span>
          </div>
          <div className={`${styles["linki-solves-illustration__classification"]}`}>
            <div className={`${styles["linki-solves-illustration__classification-arrow"]}`} ref={step5Ref}>
              <img src="/img/linki-solves-illustration/arrow.svg" alt="" />
            </div>
            <div className={`${styles["linki-solves-illustration__classification-task"]}`} ref={step3Ref}>
              <img src="/img/linki-solves-illustration/task.svg" alt="" />
            </div>
            <span className={`${styles["linki-solves-illustration__classification-text"]}`} ref={step31Ref}>
              Project Classification
            </span>
            <div className={`${styles["linki-solves-illustration__classification-chat-right"]}`} ref={step4Ref}>
              <img src="/img/linki-solves-illustration/chat-right.svg" alt="" />
            </div>
            <div className={`${styles["linki-solves-illustration__classification-chat-left"]}`} ref={step41Ref}>
              <img src="/img/linki-solves-illustration/chat-left.svg" alt="" />
            </div>
          </div>
          <div className={`${styles["linki-solves-illustration__pm-circle"]}`} ref={step6Ref}>
            <span>Project Manager</span>
            <div className={`${styles["linki-solves-illustration__pm-circle-arrow"]}`} ref={step7Ref}>
              <img src="/img/linki-solves-illustration/arr-1-2.svg" alt="" />
            </div>
          </div>
          <div className={`${styles["linki-solves-illustration__center"]}`} ref={step8Ref}>
            <img
              className={`${styles["linki-solves-illustration__center-desktop"]}`}
              src="/img/linki-solves-illustration/center.svg"
              alt=""
            />
            <img
              className={`${styles["linki-solves-illustration__center-mobile"]}`}
              src="/img/linki-solves-illustration/center-mobile.svg"
              alt=""
            />
            <div className={`${styles["linki-solves-illustration__center-arrow"]}`} ref={step11Ref}>
              <img src="/img/linki-solves-illustration/arr-2-1.svg" alt="" />
            </div>
          </div>
          <div className={`${styles["linki-solves-illustration__entry"]}`} ref={step9Ref}>
            <div className={`${styles["linki-solves-illustration__entry-point"]}`}>
              <img src="/img/linki-solves-illustration/entrypoint.svg" alt="" />
            </div>
            <div className={`${styles["linki-solves-illustration__entry-person"]}`} ref={step10Ref}>
              <img src="/img/linki-solves-illustration/trevel-person.svg" alt="" />
            </div>
          </div>

          <div className={`${styles["linki-solves-illustration__execution"]}`} ref={step12Ref}>
            <div className={`${styles["linki-solves-illustration__execution-arrow"]}`} ref={step13Ref}>
              <img src="/img/linki-solves-illustration/arrow.svg" alt="" />
            </div>
            <img src="/img/linki-solves-illustration/execution.svg" alt="" />
          </div>
          <div className={`${styles["linki-solves-illustration__completed-circle"]}`} ref={step14Ref}>
            <span>Project completed</span>
            <div className={`${styles["linki-solves-illustration__completed-circle-flag"]}`}>
              <img src="/img/linki-solves-illustration/flag.svg" alt="" />
            </div>
          </div>
          <div className={`${styles["linki-solves-illustration__completed-txt"]}`} ref={step141Ref}>
            100% project payment
          </div>
        </div>
        <div className={`${styles["linki-solves-grid"]}`}>
          <div className={`${styles["linki-solves-card"]} ${styles["desktop"]}`}>
            <p className={`${styles["linki-solves-card__title"]}`}>
              <span>Top talent</span> in <br></br> product building
            </p>
            <p className={`${styles["linki-solves-card__txt"]}`}>
              Creating a high-quality product requires excellent logic, thorough product knowledge and an understanding
              of how to connect the various phases of product development into one final working project. We set the bar
              high, every member of our platform is verified by us, so we unsure that we have people with the necessary
              expertise for every stage of your project creation.
            </p>
          </div>
          <div className={`${styles["linki-solves-card"]}`}>
            <p className={`${styles["linki-solves-card__title"]}`}>
              <span>Top verified</span> talents
            </p>
            <p className={`${styles["linki-solves-card__txt"]}`}>
              Our PMs will help you identify your need and structure it in order to solve your problem in the fastest
              way possible.
            </p>
          </div>
          <div className={`${styles["linki-solves-card"]}`}>
            <p className={`${styles["linki-solves-card__title"]}`}>
              <span>Rigorous</span> & transparent <span>process</span>
            </p>
            <p className={`${styles["linki-solves-card__txt"]}`}>
              We have designed our process to make sure that we comprehend your idea. Our in-house project portal allows
              clients to collaborate with us for a successful launch every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LinkiSolves
