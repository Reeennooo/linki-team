import AboutLinkiCard from "components/AboutLinkiCard/AboutLinkiCard"
import styles from "./AboutLinki.module.scss"
import gsap from "gsap"
import { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

interface Props {
  addClass?: string
}

const AboutLinki: React.FC<Props> = ({ addClass }) => {
  const cardsList = [
    {
      id: 1,
      label: "PROFESSIONALLY",
      img: "/img/about-linki/1.png",
      title: "Personal manager",
      txt: "Project manager fully or partially selects specialists for the project team",
    },
    {
      id: 2,
      img: "/img/about-linki/2.png",
      title: "Project teams",
      txt: "Freelancers team up and carry out full-cycle projects",
    },
    {
      id: 3,
      img: "/img/about-linki/3.png",
      title: "Low commissions",
      txt: "Lowest commissions on the market, see comparison table for details",
    },
    {
      id: 4,
      img: "/img/about-linki/4.png",
      title: "Safe deal",
      txt: "Guarantee is not only about protecting your budget, but also about getting results through quality control",
    },
    {
      id: 5,
      img: "/img/about-linki/5.png",
      title: "Referral program",
      txt: "Freelancers can receive 10% of referral payments for attracted contractors",
    },
    {
      id: 6,
      img: "/img/about-linki/6.png",
      title: "Expert rating",
      txt: "Honest rating will allow you to choose specialists who meet the requirements of your project",
    },
  ]

  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  const aboutCardsListRef = useRef(null)

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const aboutCardsList = aboutCardsListRef.current
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
    gsap.fromTo(
      subtitle,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.2,
        scrollTrigger: {
          trigger: title,
        },
      }
    )
    const imgList = []
    aboutCardsList.childNodes.forEach((el) => {
      const img = el.querySelector("img")
      imgList.push(img)
    })
    gsap.fromTo(
      imgList,
      { x: 600, opacity: 0, scale: 0 },
      {
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: aboutCardsList,
          start: "center bottom-=12%",
        },
      }
    )
  }, [])

  return (
    <section id="about" className={`${styles["about-linki"]} ${addClass ? addClass : ""}`}>
      <div className="container">
        <h2 className="section-title" ref={titleRef}>
          <span>linki</span> creates ad hoc teams for you to<br></br> launch your project from idea to realization
        </h2>
        <h3 className="section-subtitle" ref={subtitleRef}>
          linki will help you save time and nerves by matching the right freelancers for your project into one team
          based on the complexity of the project you need and managing it until your idea is turned into a reality
        </h3>
        <div className={`${styles["about-linki__cards"]} ${styles["desktop-cards"]}`} ref={aboutCardsListRef}>
          {cardsList.map((card) => {
            return <AboutLinkiCard key={card.id} data={card} />
          })}
        </div>
        <Swiper spaceBetween={20} slidesPerView={"auto"} className={`${styles["mobile-cards"]}`}>
          {cardsList.map((slide) => {
            return (
              <SwiperSlide key={slide.id} className={`${styles["mobile-cards__slide"]}`}>
                <AboutLinkiCard data={slide} />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}

export default AboutLinki
