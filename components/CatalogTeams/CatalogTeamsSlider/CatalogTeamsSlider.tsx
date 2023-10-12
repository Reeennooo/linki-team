import styles from "./CatalogTeamsSlider.module.scss"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import CatalogTeamsCard from "../CatalogTeamsCard/CatalogTeamsCard"
import { ICatalogWeekTeam } from "types/pmteam"

interface Props {
  slides: ICatalogWeekTeam[]
  title?: string
  addClass?: string
  mainpage?: boolean
}

const CatalogTeamsSlider: React.FC<Props> = ({ addClass, title, slides, mainpage }) => {
  return (
    <div className={`${addClass ?? ""}`}>
      {title && <h3 className="page-section__title">{title}</h3>}
      <Swiper className={`${styles["catalog-teams-slider"]}`} spaceBetween={12} slidesPerView={"auto"}>
        {slides.map((slide) => {
          return (
            <SwiperSlide key={slide.id}>
              <CatalogTeamsCard
                id={slide.id}
                cover={slide.image}
                avatar={slide.avatar}
                name={slide.name}
                directions={slide.directions}
                rating={Number(slide.rating)}
                mainpage={mainpage}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default CatalogTeamsSlider
