import { Category, Direction, Language, LinkWithOG, LinkWithOGParams, Skill, TimeZone } from "types/content"
import { NOTIFICATION_TYPE_CHAT, NOTIFICATION_TYPE_PAYMENT, NOTIFICATION_TYPE_PROJECT } from "utils/constants"
import { IPmTeamsListItem } from "./pmteam"

export interface UserInfo {
  avatar: string
  email: string
  id: number
  in_favorites: boolean
  languages: Language[]
  name: string
  position: string
  rating: number
  surname: string
  timezone: TimeZone
  telegram_link?: string
  /** type: 1 - Customer, 2 - Expert, 3 - PM */
  type: 1 | 2 | 3
  /** If user type: 2 | 3 (expert | PM)*/
  links?: LinkWithOG[]
  /** If user type: 3 (PM) */
  project_categories?: Omit<Category, "value" | "label">[]
  /** If user type: 3 (PM) */
  project_directions?: Omit<Direction, "value" | "label">[]
  /** If user type: 2 (expert) */
  job_roles?: UserJobRole[]
  /** If user type: 1 (Customer) */
  company?: {
    name: string
    links: LinkWithOG[]
  }
  premium_subscribe: boolean
  /** If user type: 2 (expert) */
  manager_teams?: IPmTeamsListItem[]
  exclusive_team?: number | null
}

export type UserFavoriteData = Pick<
  UserInfo,
  | "avatar"
  | "id"
  | "name"
  | "rating"
  | "surname"
  | "type"
  | "job_roles"
  | "project_categories"
  | "project_directions"
  | "exclusive_team"
>

export interface UserJobRole {
  hourly_pay?: number
  id: number
  area_expertise_id: number
  name: string
  skills: Skill[]
}

export interface UpdateUserDefaultParams {
  avatar?: any // не обязательно, файл
  name: string
  surname: string
  description?: string
  timezone_id: number
  languages: number[]
  telegram_link?: string
}

export interface UpdateUserExpertParams extends UpdateUserDefaultParams {
  job_roles: number[]
  skills: number[]
  links: LinkWithOGParams[]
}

export interface UpdateUserPMParams extends UpdateUserDefaultParams {
  project_categories: number[]
  links: LinkWithOGParams[]
}

export interface UpdateUserCustomerParams extends UpdateUserDefaultParams {
  company: {
    name: string
    links: LinkWithOGParams[]
  }
}

export type UpdateUserParams = UpdateUserCustomerParams | UpdateUserExpertParams | UpdateUserPMParams

/** 1 - отправка на email, 2 - отправка в браузер, 3 - отправка туда и туда, 0 | null - ничего не выбрано */
export type NotificationSettingsCodes = 1 | 2 | 3 | 0

export type NotificationNames = "payments" | "projects" | "chats" | "news"

/** 1 - отправка на email, 2 - отправка в браузер, 3 - отправка туда и туда, 0 | null - ничего не выбрано */
export type NotificationSettings = Record<NotificationNames, NotificationSettingsCodes>

export type IPopupNotificationIcon = "info" | "error" | "wait" | "check" | "delete" | false
export type IPopupNotificationMod = "success" | "error" | "warning"

/** people-Client(people in projects), budget-Client(General budget), projects-Client(My projects in linki), completed-PM/Expert, earned-PM/Expert, incoming-PM/Expert */
export interface UserStatistic {
  budget?: number
  completed?: number
  earned?: number
  incoming?: number
  people?: number
  projects?: number
  rating: number
  wallet: {
    estimated: number
    reserve: number
  }
}

export type NotificationTypes =
  | typeof NOTIFICATION_TYPE_PAYMENT
  | typeof NOTIFICATION_TYPE_PROJECT
  | typeof NOTIFICATION_TYPE_CHAT

/** type: 1 - Payments, 2 - Projects, 3 - Chats. Status: true/false - read/not read. dialog_id - id чата */
export interface INotificationsData {
  created_at?: string
  dialog_id?: number
  id: number
  image?: string
  name?: string
  status: boolean
  text: string
  type: NotificationTypes
  user_id: number
}

export interface IReferralUserData {
  id: number
  name: string
  surname: string | null
  position: string | null
  rating: number
  email: string
  type: number
  telegram_link: string | null
  created_at: string
  avatar: string
}
