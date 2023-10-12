import styles from "./HintSlider.module.scss"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import SwiperCore, { Pagination, Navigation } from "swiper"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectonboardingRedux } from "redux/slices/onboarding"
import dynamic from "next/dynamic"

SwiperCore.use([Navigation, Pagination])

import { StoreHelpers } from "react-joyride"
import { useEffect, useRef, useState } from "react"

const JoyRideComponent = dynamic(() => import("react-joyride"), { ssr: false })

interface Props {
  addClass?: string
}

const TOUR_STEPS_CLIENT_CREATE = [
  {
    target: ".tour-field-name",
    content: "",
    disableBeacon: true,
    title: "Detailed definition",
    txt: [
      "Give your project a simple and clear name, so that your future PM can immediately understand what needs to be done.",
      "For example: If you need a website or an application for your company, then write this way: Development of an online store for a company manufacturing furniture in the USA.",
    ],
  },
  {
    target: ".tour-field-deskr",
    content: "",
    disableBeacon: true,
    title: "Describe your project",
    txt: [
      "Give as much detail about your project as possible and indicate what would be a good result, the evaluation of the project will depend on this.",
    ],
  },
  {
    target: ".tour-field-cover",
    content: "",
    disableBeacon: true,
    title: "Choose the appropriate cover for your project",
    txt: ["The cover allows the PM to visualize the essence of the project and helps navigate the dashboard"],
  },
  {
    target: ".tour-field-direction",
    content: "",
    disableBeacon: true,
    title: "Choose the direction of work",
    txt: ["Choose the right direction for your project so we can find PMs for you who specialize in that area"],
  },
  {
    target: ".tour-field-category",
    content: "",
    disableBeacon: true,
    title: "Choose a job category ",
    txt: [
      "Choose the direction and category that best suits you request. For example: if you are looking for a game project, you should choose 'Game development' in the 'Programming and technology' category.",
    ],
  },
  {
    target: ".tour-field-files",
    content: "",
    disableBeacon: true,
    title: "Attach files for your project ",
    txt: [
      "Here you can attach files that will help PMs better understand your wishes and correctly understand the end result. ",
      "For example, when creating a corporate website, you can attach a brand book and terms of reference.",
    ],
  },
  {
    target: ".tour-field-publish",
    content: "",
    disableBeacon: true,
    title: "Publish or save your project as a draft",
    txt: [
      "After you fill in all the required fields, you can add the project to drafts or publish it.",
      "After publication, information about the project will be posted on the platform and you can start its implementation.",
    ],
  },
]

const HintSlider: React.FC<Props> = ({ addClass }) => {
  const list = TOUR_STEPS_CLIENT_CREATE.map((hint, index) => {
    // const listItems = hint.list?.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)
    const txtList = hint.txt?.map((item, itemIndex) => (
      <p key={itemIndex} className={`${styles["hint-slider__txt"]}`} dangerouslySetInnerHTML={{ __html: item }} />
    ))
    return (
      <SwiperSlide key={index} className={`${styles["hint-slider__slide"]}`}>
        <h4 className={`${styles["hint-slider__title"]}`}>{hint.title}</h4>
        {/* {listItems?.length > 0 && <ul className={`${styles["hint-slider__list"]}`}>{listItems}</ul>} */}
        {hint.txt && txtList}
      </SwiperSlide>
    )
  })

  const dispatch = useAppDispatch()

  //ONBOARDING START STATE
  const { mountCreateProjectOnboarding } = useAppSelector(selectonboardingRedux)
  const { startCreateProjectOnboarding } = useAppSelector(selectonboardingRedux)
  const { clientCreateProject } = useAppSelector(selectonboardingRedux)

  const [currentStep, setCurrentStep] = useState(null)
  const [allowForward, setAllowForward] = useState(false)

  //ONBOARDING CONTROLLS
  const helpers = useRef<StoreHelpers>()

  const setHelpers = (storeHelpers: StoreHelpers) => {
    helpers.current = storeHelpers
  }

  const tourCallback = ({ index }) => {
    setCurrentStep(index)
  }

  const handleNext = () => {
    const { next } = helpers.current!
    next()
  }
  const handlePrev = () => {
    const { prev } = helpers.current!
    prev()
  }

  const NoTooltip = ({ tooltipProps }) => (
    <div style={{ display: "none" }} className={`${styles["tour-tooltip"]}`} {...tooltipProps}></div>
  )

  //FORM CHANGES
  useEffect(() => {
    if (
      (currentStep === 0 && clientCreateProject.projectName) ||
      (currentStep === 1 && clientCreateProject.projecеtDescription) ||
      (currentStep === 2 && clientCreateProject.projecеtCover) ||
      currentStep === 3 ||
      (currentStep === 4 && clientCreateProject.projecеtCategories) ||
      currentStep === 5
    ) {
      setAllowForward(true)
    } else {
      setAllowForward(false)
    }
  }, [clientCreateProject, currentStep])

  return (
    <>
      {mountCreateProjectOnboarding && (
        <>
          <JoyRideComponent
            steps={TOUR_STEPS_CLIENT_CREATE}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            spotlightPadding={20}
            run={startCreateProjectOnboarding}
            disableOverlayClose={true}
            scrollOffset={200}
            floaterProps={{ hideArrow: true }}
            spotlightClicks={true}
            tooltipComponent={NoTooltip}
            getHelpers={setHelpers}
            callback={tourCallback}
          />
        </>
      )}
      <div
        className={`${styles["hint-slider"]} ${allowForward ? "" : styles["is-blocked"]} ${addClass ? addClass : ""}`}
      >
        <Swiper
          autoHeight={true}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{
            type: "fraction",
            el: ".swiper-pagination",
          }}
          navigation={{
            prevEl: `.hint-slider__prev`,
            nextEl: `.hint-slider__next`,
          }}
          onSlideNextTransitionStart={(e) => {
            mountCreateProjectOnboarding && handleNext()
          }}
          onSlidePrevTransitionStart={(e) => {
            mountCreateProjectOnboarding && handlePrev()
          }}
          allowSlideNext={allowForward}
        >
          {list}
          <div className={`${styles["hint-slider__controlls"]}`}>
            <div className={` swiper-pagination`}></div>
            <div className={`${styles["hint-slider__nav"]}`}>
              <div className={` ${styles["hint-slider__btn"]} hint-slider__prev`}>
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.25 12.25L1 6.625L7.25 0.999999"
                    stroke="#6420FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={` ${styles["hint-slider__btn"]} hint-slider__next`}>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.125 1.375L7.375 7L1.125 12.625"
                    stroke="#6420FF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Swiper>
      </div>
    </>
  )
}

export default HintSlider
