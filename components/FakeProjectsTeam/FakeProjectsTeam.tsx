import TeamMemberSelect from "components/TeamMemberSelect/TeamMemberSelect"

import styles from "./FakeProjectsTeam.module.scss"

import { Swiper, SwiperSlide } from "swiper/react"
import { Scrollbar } from "swiper"

interface FakeProjectsTeamProps {
  addClass?: string
  show: boolean
  open: boolean
  user: boolean
}

const FakeProjectsTeam: React.FC<FakeProjectsTeamProps> = ({ addClass, show, open, user }) => {
  return (
    <div
      className={`projects-team ${styles["projects-team"]} ${addClass ? addClass : ""} ${
        show ? styles["is-active"] : ""
      }`}
    >
      <h3 className={styles["projects-team__title"]}>My team</h3>
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{ draggable: true }}
        slidesPerView={"auto"}
        spaceBetween={20}
        observer={true}
        observeSlideChildren={true}
        observeParents={true}
      >
        <SwiperSlide key={1}>
          <TeamMemberSelect
            key={1}
            jobItem={{
              avatar: "/img/onboarding/7.jpg",
              candidates_count: 0,
              id: user ? 1 : null,
              in_search: false,
              job_role: "UX/UI Designer",
              job_role_id: 1,
              name: "Ivan",
              surname: "T.",
              team_member_id: 1,
            }}
            isActive={open}
            initialyOpen={open}
            isSelected={false}
            onClickAllBtn={() => false}
          />
        </SwiperSlide>
        <SwiperSlide key={2}>
          <TeamMemberSelect
            key={2}
            jobItem={{
              avatar: "",
              candidates_count: 0,
              id: null,
              in_search: false,
              job_role: "Java developer",
              job_role_id: 1,
              name: "",
              surname: "",
              team_member_id: 1,
            }}
            isActive={false}
            isSelected={false}
            onClickAllBtn={() => false}
          />
        </SwiperSlide>
        <SwiperSlide key={3}>
          <TeamMemberSelect
            key={3}
            jobItem={{
              avatar: "",
              candidates_count: 0,
              id: null,
              in_search: false,
              job_role: "Voice artists",
              job_role_id: 1,
              name: "",
              surname: "",
              team_member_id: 1,
            }}
            isActive={false}
            isSelected={false}
            onClickAllBtn={() => false}
          />
        </SwiperSlide>
        <SwiperSlide key={4}>
          <TeamMemberSelect
            key={4}
            jobItem={{
              avatar: "",
              candidates_count: 0,
              id: null,
              in_search: false,
              job_role: "Social media manager",
              job_role_id: 1,
              name: "",
              surname: "",
              team_member_id: 1,
            }}
            isActive={false}
            isSelected={false}
            onClickAllBtn={() => false}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default FakeProjectsTeam
