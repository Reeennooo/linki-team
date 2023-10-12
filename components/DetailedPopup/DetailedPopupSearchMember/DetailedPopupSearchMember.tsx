import FavoritePerson from "components/FavoritePerson/FavoritePerson"
import InputSearch from "components/ui/InputSearch/InputSearch"
import { useAppDispatch, useAppSelector } from "hooks"
import { useEffect, useMemo, useState } from "react"
import { selectApiParams, updateApiParams } from "redux/slices/apiParams"
import styles from "./DetailedPopupSearchMember.module.scss"
import { openModal } from "redux/slices/modals"
import { UserFavoriteData } from "types/user"
import {
  useInviteFavoriteToJobMutation,
  useLazyGetVacancyCandidatesQuery,
  usePublishVacancyMutation,
} from "redux/api/team"
import { useLazyGetManagerOffersQuery } from "redux/api/project"
import { useAuth } from "hooks/useAuth"

interface Props {
  addClass?: string
  onClose?: () => void
  favList: UserFavoriteData[]
}

const DetailedPopupSearchMember: React.FC<Props> = ({ addClass, onClose, favList }) => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const [inviteFavoriteToJob, resultInviteFavoriteToJob] = useInviteFavoriteToJobMutation()
  const [getManagerOffers, { data: teams, isFetching: isFetchingManagersOffers }] = useLazyGetManagerOffersQuery()
  const [getVacancyCandidates, { data: vacancyCandidates }] = useLazyGetVacancyCandidatesQuery()

  const [searchTxt, setSearchTxt] = useState("")
  const {
    activeTeamMemberIDVacancy,
    activeVacancyIDAtWork,
    teamMemberID,
    getManagerOffers: getManagerOffersApiParams,
  } = useAppSelector(selectApiParams)

  const favListToShow = useMemo(() => {
    const managerTeams = user.manager_teams.map((el) => el.id)
    if (!activeTeamMemberIDVacancy) return
    if (searchTxt.length) {
      return favList.filter(
        (el) =>
          el.name.toLowerCase().includes(searchTxt.toLowerCase()) &&
          el.job_roles &&
          el.job_roles.filter((job) => job.id === activeTeamMemberIDVacancy).length > 0 &&
          (!el.exclusive_team || managerTeams.includes(el.exclusive_team))
      )
    } else {
      return favList?.filter((el) => {
        const isExpertAlreadyInProject = vacancyCandidates?.some((candidate) => candidate.executor_id === el.id)
        if (isExpertAlreadyInProject || isExpertAlreadyInProject === undefined) return false
        return (
          el.job_roles &&
          el.job_roles.filter((job) => job.id === activeTeamMemberIDVacancy).length > 0 &&
          (!el.exclusive_team || managerTeams.includes(el.exclusive_team))
        )
      })
    }
  }, [searchTxt, favList, activeTeamMemberIDVacancy, vacancyCandidates])

  const handleOnAdd = (id) => {
    inviteFavoriteToJob({ team_member_id: teamMemberID, executor_id: id })
      .unwrap()
      .then((res) => {
        if (res.success) {
          dispatch(updateApiParams({ field: "activeVacancyIDAtWork", data: teamMemberID }))
          onClose()
          getManagerOffers(getManagerOffersApiParams)
          getVacancyCandidates({ team_member_id: teamMemberID })
        }
      })
  }

  useEffect(() => {
    getVacancyCandidates({ team_member_id: teamMemberID })
  }, [getVacancyCandidates, teamMemberID, user])

  return (
    <>
      <div className={` ${addClass ? addClass : ""} popup-body__section`}>
        <div className={`${styles["search-member__search"]}`}>
          <InputSearch onChange={(val) => setSearchTxt(val)} placeholder={"Search for a specialist"} />
        </div>
        {favList &&
        activeTeamMemberIDVacancy &&
        (favList?.length < 1 ||
          !favList?.filter(
            (el) => el.job_roles && el.job_roles.filter((job) => job.id === activeTeamMemberIDVacancy).length > 0
          ).length) ? (
          <div className={`${styles["search-member__empty"]}`}>
            <div className={`${styles["search-member__img"]}`}>
              <img src="/assets/search-member-min.png" alt="" />
            </div>
            <div className={`${styles["search-member__txt"]}`}>
              <p>
                There are no experts with this specialization in your Favorites. Add an expert to your Favorites or{" "}
                <span
                  onClick={() => {
                    onClose()
                    setTimeout(() => {
                      dispatch(openModal("modal-share-link"))
                    }, 200)
                  }}
                >
                  invite
                </span>{" "}
                an expert to the platform.
              </p>
            </div>
          </div>
        ) : (
          <div className={`${styles["favorite-list"]}`}>
            {favListToShow?.map((fav) => {
              return (
                <FavoritePerson
                  key={fav.id}
                  addClass={`${styles["favorite-list__item"]}`}
                  data={fav}
                  onAdd={() => {
                    handleOnAdd(fav.id)
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default DetailedPopupSearchMember
