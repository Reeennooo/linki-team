import TeamMemberSelect from "components/TeamMemberSelect/TeamMemberSelect"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "hooks"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import ModalShareLink from "components/Modals/ModalShareLink/ModalShareLink"
import ModalAddFromFav from "components/Modals/ModalAddFromFav/ModalAddFromFav"
import styles from "./ProjectsTeam.module.scss"
import { ITeammate } from "types/team"
import { usePublishVacancyMutation } from "redux/api/team"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import { Swiper, SwiperSlide } from "swiper/react"
import { Scrollbar } from "swiper"

interface ProjectsTeamProps {
  team: ITeammate[]
  addClass?: string
}

const ProjectsTeam: React.FC<ProjectsTeamProps> = ({ team, addClass }) => {
  const dispatch = useAppDispatch()
  const [publishVacancy, resultPublishVacancy] = usePublishVacancyMutation()
  const { modalsList } = useAppSelector(selectModals)
  const { activeProjectIDAtWork } = useAppSelector(selectApiParams)
  const [jobName, setJobName] = useState(null)
  const [referralCode, setReferralCode] = useState(null)

  const [activeTeamMember, setActiveTeamMember] = useState(null)
  const [isPosted, setPosted] = useState(false)

  useEffect(() => {
    setActiveTeamMember(null)
    dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: null }))
  }, [activeProjectIDAtWork])

  const [isMobile, setMobile] = useState<boolean>(false)
  useEffect(() => {
    setMobile(window.innerWidth <= 767)
  }, [])

  return (
    <div className={`projects-team ${styles["projects-team"]} ${addClass ? addClass : ""}`}>
      <h3 className={styles["projects-team__title"]}>My team</h3>
      <Swiper
        modules={[Scrollbar]}
        scrollbar={{ draggable: true }}
        slidesPerView={"auto"}
        spaceBetween={isMobile ? 16 : 20}
        observer={true}
        observeSlideChildren={true}
        observeParents={true}
      >
        {team?.map((member) => {
          return (
            <SwiperSlide key={member.job_role_id}>
              <TeamMemberSelect
                key={member.job_role_id}
                jobItem={member}
                isActive={activeTeamMember === member.team_member_id}
                isSelected={
                  modalsList.includes("modal-add-from-fav") ||
                  modalsList.includes("modal-share-link") ||
                  member.in_search ||
                  member.candidates_count > 0
                }
                onClickAllBtn={() => {
                  if (member.in_search || member.id || member.candidates_count) {
                    setActiveTeamMember(member.team_member_id)
                  }
                  if (member.id) return
                  if (member.in_search || member.candidates_count) {
                    dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: member.team_member_id }))
                  }
                }}
                onClickItem={(item, name) => {
                  setJobName(item.job_role)
                  switch (name) {
                    case "add fav":
                      if (modalsList.includes("modal-add-from-fav")) {
                        dispatch(closeModal("modal-add-from-fav"))
                      } else {
                        setPosted(item.in_search)
                        dispatch(updateApiParams({ field: "activeTeamMemberIDVacancy", data: member.job_role_id }))
                        dispatch(updateApiParams({ field: "teamMemberID", data: member.team_member_id }))
                        dispatch(openModal("modal-add-from-fav"))
                      }
                      break
                    case "share link":
                      if (modalsList.includes("modal-share-link")) {
                        dispatch(closeModal("modal-share-link"))
                      } else {
                        dispatch(updateApiParams({ field: "teamMemberID", data: member.team_member_id }))
                        setReferralCode(member.referal_code)
                        dispatch(openModal("modal-share-link"))
                      }
                      break
                    case "post":
                      if (item.in_search) {
                        return false
                      } else {
                        publishVacancy(item.team_member_id)
                          .unwrap()
                          .then((res) => {
                            if (res.success) {
                              dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: item.team_member_id }))
                            }
                          })
                      }
                      break
                  }
                }}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
      <ModalAddFromFav
        isOpen={modalsList.includes("modal-add-from-fav")}
        onClose={() => {
          dispatch(closeModal("modal-add-from-fav"))
        }}
        jobName={jobName}
        isPosted={isPosted}
      />
      <ModalShareLink
        isOpen={modalsList.includes("modal-share-link")}
        onClose={() => {
          dispatch(closeModal("modal-share-link"))
        }}
        jobName={jobName}
        referralCode={referralCode}
      />
      <ModalUser
        isOpen={modalsList.includes("modal-candidate")}
        onClose={() => {
          dispatch(closeModal("modal-candidate"))
        }}
        headerUserClickable={false}
        modalName={"modal-candidate"}
        modalType={"humanCardPMAtWorkVacancy"}
      />
    </div>
  )
}

export default ProjectsTeam
