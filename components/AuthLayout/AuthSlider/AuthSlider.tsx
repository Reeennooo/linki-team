import styles from "./AuthSlider.module.scss"
import React, { useMemo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCreative, Lazy } from "swiper"

import "swiper/css"
import "swiper/css/effect-creative"

interface IAuthSliderProps {
  isLogo?: boolean
}

const AuthSlider: React.FC<IAuthSliderProps> = ({ isLogo }) => {
  const items = useMemo(() => {
    let ind = 0
    const output = []
    while (ind < 22) {
      ind++
      output.push(
        <SwiperSlide key={ind}>
          <div className={styles["slider__img-wrap"]}>
            <img
              className={`swiper-lazy ${styles.slider__img}`}
              data-src={"/assets/auth/auth-" + ind + ".jpg"}
              alt={"preview"}
            />
          </div>
        </SwiperSlide>
      )
    }
    return output
  }, [])

  return (
    <div className={`auth-slider ${styles.slider}`}>
      <Swiper
        modules={[Autoplay, EffectCreative, Lazy]}
        effect={"creative"}
        lazy={{ loadPrevNext: true }}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        autoplay={{ delay: 5000 }}
        observer={true}
      >
        {items}
      </Swiper>
      <img className={styles.slider__decor} src={"/assets/auth/unsplash.svg"} alt={"unsplash"} />
      {isLogo && <img className={styles.slider__logo} src="/img/header/linlilogo.svg" alt="linlilogo" width={114} />}
    </div>
  )
}

export default AuthSlider
