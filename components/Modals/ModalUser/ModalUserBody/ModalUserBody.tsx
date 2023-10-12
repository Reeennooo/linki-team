import stylesModal from "components/ui/Modal/Modal.module.scss"
import { Category, Direction, Language, LinkWithOG, TimeZone } from "types/content"
import { UserJobRole } from "types/user"
import DetailedPopupLangList from "components/DetailedPopup/DetailedPopupLangList/DetailedPopupLangList"
import DetailedPopupPortfolio from "components/DetailedPopup/DetailedPopupPortfolio/DetailedPopupPortfolio"
import DetailedPopupDetails from "components/DetailedPopup/DetailedPopupDetails/DetailedPopupDetails"
import { memo, useMemo, FC } from "react"
import IcontitleAndTags from "components/IcontitleAndTags/IcontitleAndTags"
import ProgressBar from "components/ProgressBar/ProgressBar"
import { calculatePercentagesFunction } from "utils/profileFillingCalculation"
import { useAuth } from "hooks/useAuth"
import { IPmTeamsListItem } from "types/pmteam"
import TeamCard from "components/TeamCard/TeamCard"
import { BACKEND_HOST, USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"
import { useAppDispatch } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import { openModal } from "redux/slices/modals"
import EmptySection from "./ModalUserSections/EmptySection"
import Section from "./ModalUserSections/Section"
import { hasValueBetweenTags } from "../../../../utils/hasValueBetweenTags"

interface IModalUserExpertBodyProps {
  userData: {
    company?: {
      name: string
      links: LinkWithOG[]
    }
    project_directions?: Omit<Direction, "value" | "label">[]
    project_categories?: Omit<Category, "value" | "label">[]
    languages?: Language[]
    timezone?: TimeZone
    links?: LinkWithOG[]
    position?: string
    job_roles?: UserJobRole[]
    manager_teams?: IPmTeamsListItem[]
    type?: number
  }
}

const ModalUserBody: FC<IModalUserExpertBodyProps> = ({ userData }) => {
  const {
    type,
    manager_teams,
    job_roles,
    project_categories,
    project_directions,
    position,
    company,
    links,
    languages,
    timezone,
  } = userData || {}

  const { user } = useAuth()
  const dispatch = useAppDispatch()

  const calculatePercentages: number = useMemo(() => {
    return calculatePercentagesFunction(user)
  }, [user])

  const teamsSection = useMemo(() => {
    if (!manager_teams?.length) return null

    return (
      <Section title={"Teams"}>
        <div className={`popup-body__cards-list`}>
          {manager_teams.map((team) => {
            //FOR EXPERT
            if (type === USER_TYPE_EXPERT) {
              return (
                <TeamCard
                  type={team?.status === -1 ? "invite" : team?.status === -2 ? "exclusive-invite" : "chat"}
                  key={team.id}
                  data={{ ...team, avatar: team.avatar ? `${BACKEND_HOST}/${team.avatar}` : null }}
                  pmAvatar={team.manager?.avatar?.path ? `${BACKEND_HOST}/${team.manager.avatar.path}` : null}
                  onClick={() => {
                    dispatch(updateApiParams({ field: "currentPmTeamID", data: team.id }))
                    dispatch(openModal("modal-pm-team-in-modal-user"))
                  }}
                  openExclusive={() => {
                    dispatch(updateApiParams({ field: "currentPmTeamID", data: team.id }))
                    dispatch(openModal("modal-exclusive-in-modal-user"))
                  }}
                />
              )
            }
            return (
              <TeamCard
                type={"none"}
                key={team.id}
                data={{ ...team, avatar: team.avatar ? `${BACKEND_HOST}/${team.avatar}` : null }}
              />
            )
          })}
        </div>
      </Section>
    )
  }, [dispatch, manager_teams, type])

  const jobRolesSection = useMemo(() => {
    if (!job_roles?.length) {
      return <EmptySection title={"Roles & Skills"} />
    }

    return (
      <Section title="Roles & Skills">
        {job_roles.map((el) => {
          return (
            <IcontitleAndTags
              key={el.id}
              addClass="iat"
              title={el.name}
              tags={el.skills}
              iconId={el.area_expertise_id}
              userType={2}
              topBlockPrice={el.hourly_pay}
            />
          )
        })}
      </Section>
    )
  }, [job_roles])

  const directionsSection = useMemo(() => {
    if (!project_directions?.length) {
      return <EmptySection title={"Directions & Categories"} />
    }

    return (
      <Section title="Directions & Categories">
        {project_directions.map((dir) => {
          return (
            <IcontitleAndTags
              key={dir.id}
              addClass="iat"
              title={dir.name}
              iconId={dir.id}
              userType={3}
              tags={
                !!project_categories.length && project_categories.filter((cat) => cat.project_direction_id === dir.id)
              }
            />
          )
        })}
      </Section>
    )
  }, [project_categories, project_directions])

  const detailsSection = useMemo(() => {
    if (!position || !hasValueBetweenTags(position)) {
      return <EmptySection title={"Details"} />
    }
    return <DetailedPopupDetails defOpen={true} addClass="popup-body__section" description={position} />
  }, [position])

  const companySection = useMemo(() => {
    if (!company) {
      return <EmptySection title={"Company"} />
    }
    return (
      <DetailedPopupPortfolio companyTitle={company?.name} addClass="popup-body__section" portfolio={company?.links} />
    )
  }, [company])

  const portfolioSection = useMemo(() => {
    if (!links?.length) {
      return <EmptySection title={"Portfolio"} />
    }
    return <DetailedPopupPortfolio addClass="popup-body__section" portfolio={links} />
  }, [links])

  const langSection = useMemo(() => {
    if (!languages?.length) {
      return <EmptySection title={"Languages"} />
    }
    return (
      <Section title="Languages">
        <DetailedPopupLangList langList={languages} />
      </Section>
    )
  }, [languages])

  const timeZoneSection = useMemo(() => {
    if (!timezone?.code) {
      return <EmptySection title={"Timezone"} />
    }
    return (
      <Section title="Timezone">
        <p className={"popup-body__p"}>{timezone.code}</p>
      </Section>
    )
  }, [timezone?.code])

  const sections = useMemo(() => {
    switch (type) {
      case USER_TYPE_CUSTOMER:
        return (
          <>
            {detailsSection} {companySection} {langSection} {timeZoneSection}
          </>
        )
      case USER_TYPE_EXPERT:
        return (
          <>
            {teamsSection} {jobRolesSection} {detailsSection} {portfolioSection} {langSection} {timeZoneSection}
          </>
        )
      case USER_TYPE_PM:
        return (
          <>
            {teamsSection} {directionsSection} {detailsSection} {portfolioSection} {langSection} {timeZoneSection}
          </>
        )
      default:
        return null
    }
  }, [
    type,
    companySection,
    detailsSection,
    directionsSection,
    jobRolesSection,
    langSection,
    portfolioSection,
    teamsSection,
    timeZoneSection,
  ])

  return (
    <div>
      {calculatePercentages < 100 && (
        <div className={stylesModal["modal-progressbar"]}>
          <ProgressBar
            title={
              calculatePercentages < 100
                ? "Complete your profile"
                : "<span>Congratulation!</span><br /><br /> Your profile is complete"
            }
            progress={calculatePercentages}
            mod={"lg"}
          />
        </div>
      )}
      {sections}
    </div>
  )
}

export default memo(ModalUserBody)
