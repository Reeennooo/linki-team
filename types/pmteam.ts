import { LinkWithOGParams, LinkWithOG } from "./content"
import { UserJobRole } from "./user"

export interface IPmteam {
  name: string
  description?: string
  telegram_link?: string
  links?: LinkWithOGParams[]
  project_categories: number[]
  image?: any
  avatar?: any
}

export interface IPmteamExecutor {
  avatar: string
  created_at: string
  email: string
  id: number
  job_roles?: UserJobRole[]
  name: string
  position: string
  rating: number
  status: number
  surname: string
  telegram_link: string
  type: number
}
export interface IPmTeamReceiving {
  avatar: string
  description: string | null
  id: number
  image: string
  jobs_count: number
  member_count: number
  members: string[]
  name: string
  team_code: string | number | null
  telegram_link: string
  executors: IPmteamExecutor[]
  directions: { id: number; name: string }[]
  categories: { id: number; name: string; project_direction_id: number }[]
  links?: LinkWithOG[]
  total_job_cost?: number
  created_at?: string
  manager?: {
    id: number
    name: string
    surname: string
    avatar: string
  }
}

export interface IPmTeamsListItem {
  avatar: string
  description: string
  id: number
  name: string
  project_categories: { id: number; name: string }[]
  status: number
  telegram_link: string | null
  manager: {
    name: string
    surname: string
    avatar: {
      path: string
    }
  }
}

export interface ICatalogTeam {
  avatar: string
  id: number
  jobs_count: number
  name: string
  rating: string
}
export interface ICatalogWeekTeam {
  avatar: string
  directions: { id: number; name: string }[]
  image: string
  name: string
  rating: string
  id: number
  jobs_count?: number
}

export interface ICatalogMabagerTeams {
  [key: number]: ICatalogTeam
}
;[]

export interface ICatalogDirection {
  direction: { id: number; name: string }
  managers_teams: ICatalogMabagerTeams
}

export interface ICatalogTeamsResponse {
  grouped_teams: ICatalogDirection[]
  week_teams: ICatalogWeekTeam[]
}
