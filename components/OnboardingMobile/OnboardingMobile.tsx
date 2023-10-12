import { useEffect, useRef, useState } from "react"
import styles from "./OnboardingMobile.module.scss"
import dynamic from "next/dynamic"
import { useAuth } from "hooks/useAuth"
import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import useUnmount from "hooks/useUnmount"
import { usePassOnboardingMobMutation } from "redux/api/user"
import { EffectCreative } from "swiper"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-creative"
import { stepsCustomer, stepsExpert, stepsPm } from "./OnboardingMobileSteps"
import IconClose from "public/assets/svg/close.svg"
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

interface Props {
  addClass?: string
  teamToEditId?: number
}

const OnboardingMobile: React.FC<Props> = ({ addClass }) => {
  const [passRequest] = usePassOnboardingMobMutation()

  const { user } = useAuth()

  const playerRef = useRef(null)
  const [playingIndex, setPlayingIndex] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [pausedIndex, setPausedIndex] = useState(0)
  const [currentSteps, setCurrentSteps] = useState([])
  const [passed, setPassed] = useState(false)
  const [sended, setSended] = useState(false)

  const [swiperState, setSwiperStae] = useState(null)

  const slideToFunction = (currStep) => {
    if (swiperState) {
      return swiperState.slideTo(currStep)
    }
  }

  const onEnded = () => {
    if (activeStep === currentSteps.length - 1 && currentSteps.length > 0) {
      setPassed(true)
      return false
    }
    setPlayingIndex(null)

    if (swiperState) {
      return swiperState.slideTo(activeStep + 1)
    }
  }

  useEffect(() => {
    if (user.type === USER_TYPE_CUSTOMER) setCurrentSteps(stepsCustomer)
    if (user.type === USER_TYPE_PM) setCurrentSteps(stepsPm)
    if (user.type === USER_TYPE_EXPERT) setCurrentSteps(stepsExpert)
  }, [user.type])

  const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty("--jsvh", `${window.innerHeight}px`)
  }

  useEffect(() => {
    document.documentElement.classList.add("no-scroll")
    appHeight()
  }, [])

  useEffect(() => {
    window.addEventListener("resize", appHeight)
    return () => {
      window.removeEventListener("resize", appHeight)
    }
  })

  const sendFunction = () => {
    try {
      passRequest()
        .unwrap()
        .then((res) => {
          if (res.success) {
            setSended(true)
          } else {
            setActiveStep(0)
          }
        })
    } catch (e) {
      setActiveStep(0)
    }
  }

  if (sended) {
    document.documentElement.classList.remove("no-scroll")
    return null
  }

  const slideChangeFn = (e) => {
    if (e.activeIndex >= currentSteps.length - 1) {
      setPassed(true)
      return false
    }
    setPlayingIndex(null)
    setActiveStep(e.activeIndex)
  }

  return (
    <div className={`${styles["onboarding-mob"]} ${currentSteps.length > 1 && styles["is-active"]}`}>
      <div className="container">
        <div className={!passed ? styles["onboarding-mob__close"] : styles["onboarding-mob__close-passed"]}>
          <div className={styles["onboarding-mob__close-btn"]} onClick={() => setPassed(true)}>
            <IconClose />
          </div>
        </div>
        {passed ? (
          <div className={`${styles["passed"]}`}>
            <img src="/assets/logo-small.svg" alt="" />
            <h2 className={`${styles["passed__title"]}`}>
              Congratulations!
              <br /> You got training.
            </h2>
            <p className={`${styles["passed__txt"]}`}>
              We wish you pleasant work and<br></br> successful projects on the linki service.
            </p>
            <div className={`${styles["passed__img"]}`}>
              <img src="/assets/passed-min.png" alt="" />
            </div>
            <DefaultBtn txt="Get Started" onClick={sendFunction} addClass={styles["passed__btn"]} />
            <div className={`${styles["passed__under-btn"]}`}></div>
          </div>
        ) : (
          <>
            <Swiper
              onSwiper={(s) => {
                setSwiperStae(s)
              }}
              modules={[EffectCreative]}
              effect={"creative"}
              lazy={{ loadPrevNext: true }}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: [-200, 0, -600],
                  opacity: 0,
                },
                next: {
                  translate: ["100%", 0, 0],
                },
              }}
              observer={true}
              onSlideChange={slideChangeFn}
            >
              {currentSteps.map((step) => {
                return (
                  <SwiperSlide key={step.id}>
                    <div
                      className={styles["video-wrp"]}
                      onClick={() => {
                        setPlayingIndex(playingIndex === step.id ? null : step.id)
                      }}
                    >
                      <ReactPlayer
                        ref={playerRef}
                        url={step.video}
                        playing={playingIndex === step.id}
                        muted={false}
                        width={"100%"}
                        height={"100%"}
                        onEnded={onEnded}
                        controls={false}
                        playsinline={true}
                      />
                      <div className={`${styles["play-icon"]} ${playingIndex === step.id && styles["is-hidden"]}`}>
                        <span className={`${styles["play-icon__circle"]}`}>
                          <svg
                            width="37"
                            height="42"
                            viewBox="0 0 37 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M35 17.5359C37.6667 19.0755 37.6667 22.9245 35 24.4641L6.5 40.9186C3.83334 42.4582 0.500006 40.5337 0.500006 37.4545L0.500007 4.54551C0.500007 1.46631 3.83334 -0.458187 6.50001 1.08141L35 17.5359Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <>
              <div className={`${styles["steps"]}`}>
                {currentSteps.map((step, i) => {
                  if (i === currentSteps?.length - 1) return null
                  return (
                    <div
                      onClick={() => slideToFunction(step.id)}
                      key={step.id}
                      className={`${step.id === activeStep && styles["is-active"]} ${styles["steps__item"]}`}
                    >
                      {step.id + 1}
                    </div>
                  )
                })}
              </div>
              <div className={styles["info"]}>
                <div className={styles["info__title"]}>
                  {currentSteps.filter((step) => step.id === activeStep)[0] &&
                    currentSteps.filter((step) => step.id === activeStep)[0].title}
                </div>
                <div className={styles["info__txt"]}>
                  {currentSteps.filter((step) => step.id === activeStep)[0] &&
                    currentSteps.filter((step) => step.id === activeStep)[0].txt}
                </div>
              </div>
            </>
          </>
        )}
      </div>
    </div>
  )
}

export default OnboardingMobile
