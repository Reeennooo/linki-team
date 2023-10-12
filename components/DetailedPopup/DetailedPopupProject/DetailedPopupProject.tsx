import ProgressBar from "components/ProgressBar/ProgressBar"
import styles from "./DetailedPopupProject.module.scss"
import Dollar from "public/assets/svg/dollar.svg"
import moment from "moment"
import { numberFormat } from "utils/formatters"
import ProjectCardCompleted from "components/ProjectCard/ProjectCardCompleted/ProjectCardCompleted"
interface Props {
  data: {
    start?: string
    days?: number
    salary?: number
    hours?: number
    sum?: number
    progress?: boolean
    status?: string
    created?: string
    responses?: number
    teamMembers?: number
    teamRate?: {
      min: number
      max: number
    }
    teamJobs?: number
    teamEarned?: number
    teamCreated?: string
  }
  addClass?: string
  progressType?: "overdue" | "completed" | null
}

const DetailedPopupProject: React.FC<Props> = ({ data, addClass, progressType }) => {
  const generateDate = (date, column) => {
    if (!date) return
    switch (column) {
      case "start":
        return moment(date, "DD.MM.YYYY").format("MMM D")
      case "deadline":
        if (!data?.days) return null
        return moment(date, "DD.MM.YYYY").add(data.days, "days").format("MMM D")
      case "teamCreated":
        return moment(date, "DD.MM.YYYY").format("MMM D, YYYY")
    }
  }

  const deadlineDate =
    data?.start && data.days ? moment(data.start, "DD.MM.YYYY").add(data.days, "days").format("MMM D YYYY") : null
  const daysRemain = deadlineDate
    ? moment.duration(moment(deadlineDate, "MMM D YYYY").diff(moment().startOf("day"))).asDays()
    : null
  const progressCount = deadlineDate ? (daysRemain <= 0 ? 100 : 100 - Math.floor((daysRemain * 100) / data.days)) : null

  return (
    <>
      <div className={`${styles["project"]} scrollbar-transparent-tablet ${addClass ? addClass : ""}`}>
        {data.start && !data.salary && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Start date</p>
            <p className={`${styles["project__item-val"]}`}>{generateDate(data?.start, "start")}</p>
          </div>
        )}
        {data.created && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Created</p>
            <p className={`${styles["project__item-val"]}`}>{generateDate(data?.created, "start")}</p>
          </div>
        )}
        {data.status && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Status</p>
            <p className={`${styles["project__item-val"]}`}>{data.status}</p>
          </div>
        )}
        {data?.responses > 0 && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Responses</p>
            <p className={`${styles["project__item-val"]} ${styles["project__item-val--accent"]}`}>{data.responses}</p>
          </div>
        )}
        {!data.start && data.salary && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Hourly rate</p>
            <p className={`${styles["project__item-val"]}`}>
              <Dollar /> {data.salary} per hour
            </p>
          </div>
        )}
        {data?.start && !data?.hours && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Deadline</p>
            <p className={`${styles["project__item-val"]}`}>{generateDate(data?.start, "deadline")}</p>
          </div>
        )}
        {!data?.start && data?.hours && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Realization period</p>
            <p className={`${styles["project__item-val"]}`}>x {data?.hours} Hours</p>
          </div>
        )}

        {(data?.sum || data?.hours || data?.salary) && (
          <div className={`${styles["project__item"]} ${styles["project__item--dead"]}`}>
            <p className={`${styles["project__item-name"]}`}>Total sum</p>
            <p className={`${styles["project__item-val"]}`}>
              <Dollar />
              {data?.sum
                ? numberFormat(data.sum)
                : data?.hours && data?.salary
                ? numberFormat(data?.hours * data?.salary)
                : ""}
            </p>
          </div>
        )}
        {progressType === "completed" ? (
          <ProjectCardCompleted addClass={styles.project__completed} />
        ) : data.progress ? (
          <div className={`${styles["project__item"]} ${styles["project__item--progress"]}`}>
            <ProgressBar daysRemain={daysRemain} title={"Progress"} progress={progressCount} mod={"md"} />
          </div>
        ) : (
          ""
        )}

        {(data?.teamMembers || data?.teamMembers === 0) && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Members</p>
            <p className={`${styles["project__item-val"]}`}>{data?.teamMembers}</p>
          </div>
        )}
        {(data?.teamRate || data?.teamRate?.min === 0 || data?.teamRate?.max === 0) && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Hourly rate</p>
            <p className={`${styles["project__item-val"]}`}>
              ${data?.teamRate.min} - ${data?.teamRate.max}
            </p>
          </div>
        )}
        {(data?.teamJobs || data?.teamJobs === 0) && (
          <div className={`${styles["project__item"]}`}>
            <p className={`${styles["project__item-name"]}`}>Total jobs</p>
            <p className={`${styles["project__item-val"]}`}>{data.teamJobs}</p>
          </div>
        )}
        {(data?.teamEarned || data?.teamEarned === 0) && (
          <div className={`${styles["project__item"]} ${styles["project__item--dead"]}`}>
            <p className={`${styles["project__item-name"]}`}>Total earned</p>
            <p className={`${styles["project__item-val"]}`}>{numberFormat(data.teamEarned)}</p>
          </div>
        )}
        {data?.teamCreated && (
          <div className={`${styles["project__item"]} ${styles["project__item--date"]}`}>
            <p className={`${styles["project__item-name"]}`}>Member since</p>
            <p className={`${styles["project__item-val"]}`}>{generateDate(data?.teamCreated, "teamCreated")}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default DetailedPopupProject
