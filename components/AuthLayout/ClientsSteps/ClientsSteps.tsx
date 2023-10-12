import IdeaCard from "../IdeaCard/IdeaCard"
import styles from "./ClientsSteps.module.scss"

interface Props {
  formik?: any
}

const ClientsSteps: React.FC<Props> = () => {
  const ideas = [
    {
      img: "/img/AuthLayout/ideaCards/1-min.png",
      txt: "I know what specialist I need",
    },
    {
      img: "/img/AuthLayout/ideaCards/2-min.png",
      txt: "I know what specialist I need",
    },
  ]
  return (
    <>
      <div className={`${styles["clients-steps"]} `}>
        <h2 className={`${styles["clients-steps__title"]} `}>Let&apos;s talk about your idea</h2>
        <p className={`${styles["clients-steps__subtitle"]} `}>
          You can choose the service yourself or entrust it to us{" "}
        </p>
        <div className={`${styles["clients-steps__cards"]} `}>
          {ideas &&
            ideas.map((ideaCard, iter) => {
              return (
                <IdeaCard
                  key={iter}
                  img={ideaCard.img}
                  txt={ideaCard.txt}
                  addClass={`${styles["clients-steps__card"]}`}
                />
              )
            })}
        </div>
      </div>
    </>
  )
}

export default ClientsSteps
