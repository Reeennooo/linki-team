import { Language, LinkWithOG, TimeZone } from "types/content"
import { IPmTeamsListItem } from "./pmteam"
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
  referal_code?: string
  register_code?: string
  manager_team_code?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  /** role: 1 - клиент, 2 - эксперт, 3 - менеджер */
  role: 1 | 2 | 3
  agree?: boolean
  /** referal_code - реф.код для регистрации на вакансию, register_code - реф.код для регистрации пользователя, manager_team_code - реф.код для регистрации на команду */
  referal_code?: string
  register_code?: string
  manager_team_code?: string
}

export interface User {
  created_at: Date
  id: number
  email: string
  name: string
  surname: string | null
  /** type: 1 - клиент, 2 - эксперт, 3 - менеджер */
  type: 1 | 2 | 3 | null
  is_verified: boolean
  portfolio: string | null
  language: Language[] | null
  timezone: TimeZone | null
  hourly_pay: number
  job_roles: []
  skills: []
  links: LinkWithOG[]
  languages: []
  company: {
    name: string
    links: LinkWithOG[]
  } | null
  avatar: string
  position: string
  project_directions:
    | [
        {
          id: number
          name: string
        }
      ]
    | []
  project_categories:
    | [
        {
          id: number
          name: string
          project_direction_id: number
        }
      ]
    | []
  rating: number
  telegram_link: string | null
  referal_code: string | null
  premium_subscribe: boolean
  is_onboarder_1: boolean
  is_onboarder_2: boolean
  is_onboarder_3: boolean
  is_onboarded_mob: boolean
  /** If user type: 2 (expert) */
  manager_teams?: IPmTeamsListItem[]
  /** is_confirmed: 0-модерацию не проходил,1-на проверке,2-пройдено*/
  is_confirmed: number
}

export interface UserData extends User {
  api_token: string
}

export interface SetRoleRequest {
  id: number
  /** role: 1 - клиент, 2 - эксперт, 3 - менеджер */
  role: 1 | 2 | 3
}

export interface IModerationQuestionsGroup {
  description: "" | null
  name: string
  questions: IModerationQuestion[]
}

export interface IModerationQuestion {
  answer_type:
    | "text"
    | "text_phone"
    | "text_email"
    | "text_url"
    | "select"
    | "multi_select"
    | "checkbox"
    | "radio_button"
    | "number"
    | "range"
    | "date"
    | "file"
    | "textarea"
  answers: string[]
  condition: string | null
  condition_group: number | null
  control_values: string | null
  id: number
  is_optional: boolean
  placeholder: string | null
  question: string
  user_type: 1 | 2 | 3
}
