import CategoryCard from "components/CategoryCard/CategoryCard"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import styles from "./SearchTeams.module.scss"
import { useRouter } from "next/router"

interface Props {
  addClass?: string
}

const SearchTeams: React.FC<Props> = ({ addClass }) => {
  const router = useRouter()

  const stList = [
    {
      name: "Programming & Tech",
      id: 3,
    },
    // {
    //   name: "Lifestyle",
    //   id: 7,
    // },
    // {
    //   name: "Startups",
    //   id: 4,
    // },
    // {
    //   name: "Blockchain",
    //   id: 5,
    // },
    // {
    //   name: "Business",
    //   id: 6,
    // },
    {
      name: "Graphics & Design",
      id: 8,
    },
    {
      name: "Digital Marketing",
      id: 9,
    },
    // {
    //   name: "Writing & Translation",
    //   id: 10,
    // },
    // {
    //   name: "Video & Animation",
    //   id: 11,
    // },
    // {
    //   name: "Music & Audio",
    //   id: 12,
    // },
  ]

  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
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
  }, [])

  return (
    <section className={`${styles["search-teams"]} ${addClass ? addClass : ""}`}>
      <div className="container">
        <h2 className={`section-title `} ref={titleRef}>
          Search teams by category
        </h2>
        <h3 className="section-subtitle" ref={subtitleRef}>
          Hire professionals with a wide range of skills or offer your own in-demand experience
        </h3>
        <div className={`${styles["search-teams-list"]}`}>
          {stList.map((el) => {
            return (
              <CategoryCard
                mod={"lg-row"}
                onClick={() => {
                  router.push("#")
                }}
                key={el.id}
                txt={el.name}
                id={el.id}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SearchTeams
