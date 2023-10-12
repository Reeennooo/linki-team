import FavoritePerson from "components/FavoritePerson/FavoritePerson"
import AddUserButton from "components/ui/btns/AddUserButton/AddUserButton"
import { useAppDispatch, useAppSelector } from "hooks"
import Link from "next/link"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { useGetManagerTeamsQuery, useLazyGetManagerTeamsQuery } from "redux/api/pmteam"
import { resetCurrentTeam, seletCurrentTeam, updateCurrentTeam } from "redux/slices/currentTeam"
import { IPmTeamReceiving } from "types/pmteam"
import { BACKEND_HOST, CHAT_TYPE_TEAM } from "utils/constants"
import styles from "./TeamsList.module.scss"

interface Props {
  addClass?: string
  teamToEditId?: number
}

const TeamsList: React.FC<Props> = ({ addClass, teamToEditId }) => {
  const { updateTeams, resetForm } = useAppSelector(seletCurrentTeam)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: getAllTeamsData } = useGetManagerTeamsQuery()
  const [getLazyAllTeamsData] = useLazyGetManagerTeamsQuery()

  const teamsListRef = useRef(null)

  useEffect(() => {
    if (updateTeams) {
      getLazyAllTeamsData()
        .unwrap()
        .then((res) => {
          dispatch(updateCurrentTeam({ field: "updateTeams", data: false }))
        })
    }
  }, [updateTeams])

  useEffect(() => {
    if (getAllTeamsData) teamsListRef.current.scrollTop = teamsListRef.current.scrollHeight
  }, [getAllTeamsData])

  return (
    <div className={`${styles["teams-list"]} ${addClass ? addClass : ""}`}>
      <p className={`${styles["teams-list__title"]}`}>Your teams</p>
      <div className={`${styles["teams-list__teams"]}`} ref={teamsListRef}>
        {getAllTeamsData?.length > 0 &&
          getAllTeamsData.map((team, i) => {
            return (
              <FavoritePerson
                key={team.id}
                addClass={`${styles["teams-list__item"]} ${
                  Number(teamToEditId) === team.id ? styles["is-active"] : ""
                }`}
                data={{ ...team, avatar: team.avatar ? `${BACKEND_HOST}/${team.avatar}` : "", rating: null }}
                onClick={() => {
                  router.push(`/teams/${team.id}`)
                }}
                personJob={team.directions?.length > 0 && team.directions.map((dir) => dir.name).join(", ")}
                chatType={CHAT_TYPE_TEAM}
              />
            )
          })}
      </div>
      <AddUserButton
        addClass={`${styles["teams-list__add-btn"]}`}
        txt={"Add team"}
        onClick={() => {
          router.push("/teams/create")
          setTimeout(() => {
            dispatch(updateCurrentTeam({ field: "resetForm", data: resetForm + 1 }))
          }, 0)
        }}
      />
    </div>
  )
}

export default TeamsList
