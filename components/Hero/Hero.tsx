import React, { useEffect, useRef } from "react"
import Link from "next/link"
import styles from "./Hero.module.scss"
import gsap from "gsap"

const Hero: React.FC = () => {
  // const clientsArr = [1, 2, 3, 4, 5, 6]
  // const clients = clientsArr.map((i) => {
  //   return (
  //     <div key={i} className={`${styles["clients-list__item"]}`}>
  //       <img src={`/img/hero/clients/image ${i}.png`} alt="" />
  //     </div>
  //   )
  // })

  //Animations
  const heroRef = useRef(null)
  const partnerRef = useRef(null)
  const titleRef = useRef(null)
  const person2Ref = useRef(null)
  const person3Ref = useRef(null)
  const titleRef1 = useRef(null)
  const person21Ref = useRef(null)
  const person31Ref = useRef(null)
  const btnRef = useRef(null)

  const animTxtRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const partner = partnerRef.current
    const title = titleRef.current
    const person2 = person2Ref.current
    const person3 = person3Ref.current
    const title2 = titleRef.current
    const person21 = person2Ref.current
    const person31 = person3Ref.current
    const btn = btnRef.current
    const cursor = cursorRef.current
    const animTxt = animTxtRef.current

    const words = ["feature", "business plan", "product", "idea", "marketing"]
    //Text animation
    const textAnimTl = gsap.timeline({ repeat: -1 }).pause()
    words.forEach((word) => {
      const tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.2, ease: "back.out(1.7)" })
      tl.to(animTxt, { duration: 1.1, text: word })
      textAnimTl.add(tl)
    })

    gsap.to(hero, { opacity: 1 })

    gsap.fromTo(
      partner,
      {
        scale: 0,
        x: 200,
      },
      {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
      }
    )
    gsap.fromTo(
      title,
      {
        x: -200,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
      }
    )
    gsap.fromTo(
      title2,
      {
        x: -200,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        onComplete: () => textAnimTl.play(),
      }
    )

    gsap.fromTo(person2, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" })
    gsap.fromTo(person3, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "back.out(1.7)" })
    gsap.fromTo(person21, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" })
    gsap.fromTo(
      person31,
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "back.out(1.7)" }
    )
    gsap.fromTo(btn, { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" })
    gsap.to(cursor, { opacity: 0, ease: "power2.inOut", duration: 1, repeat: -1 })
  }, [])

  return (
    <>
      <div className={`${styles.hero}`} style={{ opacity: 0 }} ref={heroRef}>
        <div className={`container ${styles.hero__wrap}`}>
          <div className={styles.hero__main}>
            <h1 className={`${styles["hero-title"]}`} ref={partnerRef}>
              <span className={`${styles["hero-title__accent"]}`}>Your partner </span>
            </h1>
            <div className={`${styles["title-desktop"]}`} ref={titleRef}>
              <h2 className={`${styles["hero-title"]} ${styles["hero-title--anim"]}`}>
                <span>for delivering any </span>
                <span className={`${styles["hero-title__spell"]}`}>
                  <span className={`${styles["hero-title__spell-txt"]}`} ref={animTxtRef}></span>
                  <span className={`${styles["hero-title__spell-cursor"]}`} ref={cursorRef}>
                    |
                  </span>
                </span>
              </h2>
              <h2 className={`${styles["hero-title"]} `}>
                <span className={`${styles["hero-title__persons"]}`}>
                  <img src="/img/hero/avatar1.svg" alt="avatar1" width={45} />
                  <img src="/img/hero/avatar2.svg" alt="avatar1" width={45} ref={person2Ref} />
                  <img src="/img/hero/avatar3.svg" alt="avatar1" width={45} ref={person3Ref} />
                </span>
                on one platform
              </h2>
            </div>

            <h2 className={`${styles["hero-title"]} ${styles["title-mobile"]}`} ref={titleRef1}>
              for delivering
              <span className={`${styles["hero-title__persons"]}`}>
                <img src="/img/hero/avatar1.svg" alt="avatar1" width={45} />
                <img src="/img/hero/avatar2.svg" alt="avatar1" width={45} ref={person21Ref} />
                <img src="/img/hero/avatar3.svg" alt="avatar1" width={45} ref={person31Ref} />
              </span>
              <br></br>
              any
              <span className={`${styles["hero-title__spell"]}`}> product</span>
              on one platform
            </h2>
            <h3 className={`${styles["hero-subtitle"]}`}>
              Your idea, our execution! We link you with experienced PMs who take care of<br></br> self-organized teams
              from start to finish so you can save time for you next big idea.
            </h3>
            <div ref={btnRef}>
              <Link href="/signup">
                <a className={`${styles.hero__link}`}>Go to start</a>
              </Link>
            </div>
          </div>
          {/* <div className={`${styles.clients}`}>
            <div className={`${styles["clients__title"]} `}>Among our clients</div>
            <div className={`${styles["hero__clients-list"]} ${styles["clients-list"]}`}>{clients}</div>
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Hero
