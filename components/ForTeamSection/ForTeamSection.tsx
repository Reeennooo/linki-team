import styles from "./ForTeamSection.module.scss"
import { useRef, useEffect, useState } from "react"
import IconStar from "public/assets/mainpage/star-gradient.svg"
import YellowStar from "public/assets/svg/star.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { createTitle } from "utils/createTitle"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)
import UseWindowSize from "hooks/useWindowSIze"
import ForTeamSectionFact from "components/ForTeamSectionFact/ForTeamSectionFact"

// let adventages = [
//   {
//     id: 25177412,
//     title: "<span>Free</span><br /> Leads",
//     subtitle:
//       "Get unlimited opportunities to increase your customer base. Interesting orders and convenient service in one place  on one platform for your team.",
//     list: [
//       "Respond only to those projects that suit you and \nare of interest to you",
//       "Fulfill the conditions of the project and do the work on time and with high quality",
//       "Get paid for yourself \nand your team in any convenient way",
//     ],
//     btnText: "Get Leads",
//   },
//   {
//     id: 25155412,
//     title: "<span>Flexible</span><br /> Management",
//     subtitle: "Communicate openly and \npromptly with the whole project \nteam to get your project\n done quickly",
//     list: [
//       "View and manage all \norders in one place",
//       "Assign team members \nto projects",
//       "Track all of your team’s \nprogress and activities",
//       "Easily access all \ncompleted projects",
//     ],
//     btnText: "Start Now",
//   },
//   {
//     id: 25101412,
//     title: "<span>Expert</span><br /> Pool",
//     subtitle:
//       "Create a shared pool of freelancers\n  you trust and connect with them\n  quickly to cooperate on new or\n  ongoing projects",
//     list: [
//       "Add members to your\n team account",
//       "Collaborate on \nprojects",
//       "Communicate on each \nproject separately",
//     ],
//     btnText: "Find Experts",
//   },
// ]

// const facts = [
//   {
//     id: 1,
//     title: "Simplified \nPayment Process",
//     text: "Linki handles the daunting task of paying team members for you. Our system \nlets you find information about each project and identify team members who \n need to be paid. Simply specify who and how much to pay, and Linki will \n manage the rest.",
//   },
//   {
//     id: 2,
//     title: "Effective \nCommunication Clients",
//     text: "Keeping track of your contacts is easy with our hassle-free CRM. Each person's \ncontact page automatically displays all invoices, files and other documents \nyou've shared with them.",
//   },
//   {
//     id: 3,
//     title: "Seamless Sales \nExperience",
//     text: "Linki employs all of the useful tools to promote your team, including advanced analytics \nand expertise in locating information. The platform offers cold and warm customers, \nenabling you to grow your list of clients and earn more money.",
//   },
//   {
//     id: 4,
//     title: "Easy Project\n Management",
//     text: "Using a single dashboard, you can track the progress, objecttextchats, and relevant documentation for every project.",
//   },
// ]

interface Props {
  sectionData?: {
    beforeTitle: string
    title: string
    newCards: {
      id: number
      title: string
      subtitle: string
      list: string[]
      btnText: string
    }[]
    newFacts: {
      id: number
      title: string
      text: string
    }[]
  }
}

const ForTeamSection: React.FC<Props> = ({ sectionData }) => {
  const [windowWidth, windowHeight] = UseWindowSize()
  const forTeamSection = useRef(null)

  const [adventages, setAdvantages] = useState([
    {
      id: 25177412,
      title: "<span>Free</span><br /> Leads",
      subtitle:
        "Get unlimited opportunities to increase your customer base. Interesting orders and convenient service in one place  on one platform for your team.",
      list: [
        "Respond only to those projects that suit you and \nare of interest to you",
        "Fulfill the conditions of the project and do the work on time and with high quality",
        "Get paid for yourself \nand your team in any convenient way",
      ],
      btnText: "Get Leads",
    },
    {
      id: 25155412,
      title: "<span>Flexible</span><br /> Management",
      subtitle: "Communicate openly and \npromptly with the whole project \nteam to get your project\n done quickly",
      list: [
        "View and manage all \norders in one place",
        "Assign team members \nto projects",
        "Track all of your team’s \nprogress and activities",
        "Easily access all \ncompleted projects",
      ],
      btnText: "Start Now",
    },
    {
      id: 25101412,
      title: "<span>Expert</span><br /> Pool",
      subtitle:
        "Create a shared pool of freelancers\n  you trust and connect with them\n  quickly to cooperate on new or\n  ongoing projects",
      list: [
        "Add members to your\n team account",
        "Collaborate on \nprojects",
        "Communicate on each \nproject separately",
      ],
      btnText: "Find Experts",
    },
  ])

  const [facts, setFacts] = useState([
    {
      id: 1,
      title: "Simplified \nPayment Process",
      text: "Linki handles the daunting task of paying team members for you. Our system \nlets you find information about each project and identify team members who \n need to be paid. Simply specify who and how much to pay, and Linki will \n manage the rest.",
    },
    {
      id: 2,
      title: "Effective \nCommunication Clients",
      text: "Keeping track of your contacts is easy with our hassle-free CRM. Each person's \ncontact page automatically displays all invoices, files and other documents \nyou've shared with them.",
    },
    {
      id: 3,
      title: "Seamless Sales \nExperience",
      text: "Linki employs all of the useful tools to promote your team, including advanced analytics \nand expertise in locating information. The platform offers cold and warm customers, \nenabling you to grow your list of clients and earn more money.",
    },
    {
      id: 4,
      title: "Easy Project\n Management",
      text: "Using a single dashboard, you can track the progress, objecttextchats, and relevant documentation for every project.",
    },
  ])

  // - - - Добавление нового текста

  function changeArr(newData, func) {
    if (!newData) return
    func(newData)
  }
  let beforeTitle, newCards, newFacts
  if (sectionData) ({ beforeTitle, newCards, newFacts } = sectionData)

  // let sectionTitle = createTitle("Easy way to find customers for free", styles)
  let sectionTitle
  if (sectionData?.title) {
    sectionTitle = createTitle(sectionData?.title, styles)
  } else sectionTitle = createTitle("Easy way to find customers for free", styles)

  useEffect(() => {
    if (sectionData) {
      changeArr(newCards, setAdvantages)
      changeArr(newFacts, setFacts)
    }
  }, [])

  // - - -

  useEffect(() => {
    const blocks = gsap.utils.toArray(`.${styles["forteam__fact"]}`)
    const section = forTeamSection.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)
    const cards = gsap.utils.toArray(`.${styles["forteam__card"]}`)

    let horizontalAnimation

    if (windowWidth > 767) {
      horizontalAnimation = gsap.to(blocks, {
        xPercent: -100 * (blocks.length - 1),
        ease: "none",
        scrollTrigger: {
          id: "horizontal-trigger",
          trigger: section,
          pin: true,
          scrub: 0.5,
          start: "bottom bottom",
          end: "+=3928",
        },
        clearProps: "all  ",
      })
    } else {
      ScrollTrigger.getById("horizontal-trigger")?.kill()
      horizontalAnimation?.kill()
      horizontalAnimation = null
    }

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
          start: "top 70%",
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
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "center bottom",
        },
      }
    )
  }, [windowWidth])

  return (
    <section
      className={`${styles["forteam"]} ${sectionData ? styles["forteam_newtxt"] : ""}`}
      ref={forTeamSection}
      id="for-team"
    >
      <div className="container container--large">
        <div className={styles["forteam__title"]}>
          <span>{beforeTitle ? beforeTitle : "For Team & Agency"}</span>
          <h2 dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }} />
        </div>
      </div>
      <div className={`container container--large ${styles["container"]}`}>
        <div className={styles["forteam__adventages"]}>
          <div className={styles["forteam__wrapper"]}>
            {adventages.map((card) => (
              <div className={styles["forteam__card"]} key={card.id}>
                <div>
                  <p className={styles["forteam__card-title"]} dangerouslySetInnerHTML={{ __html: `${card.title}` }} />
                  <p className={styles["forteam__card-subtitle"]}>{card.subtitle}</p>
                  <ul className={styles["forteam__card-list"]}>
                    {card.list.map((el, index) => (
                      <li className={styles["forteam__card-list-el"]} key={index}>
                        <IconStar />
                        {el}
                      </li>
                    ))}
                  </ul>
                </div>
                <DefaultBtn txt={card.btnText} href={"/signup"} addClass={styles["forteam__card-btn"]} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`container container--large ${styles["container"]}`}>
        <div className={styles["forteam__facts-wp"]}>
          {windowWidth > 767
            ? facts.map((fact) => (
                <div className={styles["forteam__fact"]} key={fact.id}>
                  <p className={styles["forteam__fact-title"]}>{fact.title}</p>
                  <p className={styles["forteam__fact-text"]}>{fact.text}</p>
                </div>
              ))
            : facts.map((fact) => (
                <ForTeamSectionFact
                  key={fact.id}
                  title={fact.title}
                  text={fact.text}
                  openBlock={fact.id === 1 ? true : false}
                />
              ))}
        </div>
      </div>
    </section>
  )
}

export default ForTeamSection
