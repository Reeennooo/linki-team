import {
  PROJECT_STATUS_CLOSE,
  PROJECT_STATUS_DRAFT,
  PROJECT_STATUS_MODERATING,
  PROJECT_STATUS_OPEN,
  PROJECT_STATUS_WORK,
} from "utils/constants"
import { ITeammate } from "types/team"

export type ProjectStatusDraft = typeof PROJECT_STATUS_DRAFT
export type ProjectStatusModerating = typeof PROJECT_STATUS_MODERATING
export type ProjectStatusOpen = typeof PROJECT_STATUS_OPEN
export type ProjectStatusWork = typeof PROJECT_STATUS_WORK
export type ProjectStatusClose = typeof PROJECT_STATUS_CLOSE
/**
 * 1 - черновик заявки
 * 2 - заявка на модерации (в данный момент не используется)
 * 3 - заявка открыта
 * 4 - заявка в работе(!)
 * 5 - заявка закрыта
 */
export type ProjectStatuses =
  | ProjectStatusDraft
  | ProjectStatusModerating
  | ProjectStatusOpen
  | ProjectStatusWork
  | ProjectStatusClose

export interface ProjectsIncomingParams {
  project_categories?: number[]
  search?: string
  date?: "all" | "3_days" | "week" | "month"
}

export interface Project {
  budget: number
  candidate_statuses: { [key: number]: number }[]
  candidates_count: number
  categories?: {
    id?: number
    name?: string
    order?: number
    project_direction_id?: number
    published?: boolean
  }[]
  cover: string
  created_at: string
  started_at: null | string
  description: string | JSX.Element
  id: number
  manager_id?: number | null
  manager: string
  manager_percent: number
  manager_avatar?: string
  manager_surname?: string
  manager_telegram_link?: string
  media: string[]
  name: string
  offers: number[]
  owner_id: number | null
  owner: string
  owner_telegram_link?: string
  status: number
  text_status: null | number
}
export interface ExactProject {
  budget: number
  candidate_statuses: { [key: number]: number }[]
  candidates_count: number
  cover: string
  created_at: string
  started_at: null | string
  description: string | JSX.Element
  finished_at: string | null
  id: number
  manager: string
  manager_id?: number
  manager_percent: number
  media: string[]
  name: string
  offers: number[]
  owner: string
  status: number
  text_status: null | number
  categories: {
    id: number
    name: string
    project_direction_id: number
  }[]
  owner_id: number
}

export interface IProjectCard extends Project {
  author?: {
    name: string
    img: string
  }
  progress?: number
  team?: string[]
}

export interface Candidate {
  id: number
  order: {
    id: number
    name: string
    description: string
    cover: string
    budget: number
    owner: string
    manager: ""
    manager_percent: number
    status: 1 | 2 | 3
    text_status: null | number | string
    created_at: string
    media: string[]
  }
  manager: {
    avatar: string
    id: number
    name: string
    position: null | string
    rating: number
    surname: null | string
  }
  /** статус кандидата:
   1 - менеджер откликнулся т.е. перетащил задачу во второй столбец;
   2 - доступен чат т.е. заказчик перетащил во второй столбец;
   3 - подготовлен оффер т.е. менеджер перетащил в третий столбец;
   4 - оффер принят т.е. заказчик перетащил в третий столбец;
   5 - ждет оплаты - т.е. менеджер нажал на кнопку "Start project" в третьей колонке */
  status: 1 | 2 | 3 | 4 | 5
  price: null | number
}

export interface OfferParams {
  order_id: number
  manager_id: number
}

export interface OfferMember {
  hours: number
  id: number
  job_role: string
  salary_per_hour: number
  user: string | null
  area_expertise_id: number
  job_role_id: number
}

export interface OfferData {
  id: number
  days: number
  description: string
  work_description: string
  telegram_link?: string | null
  order_id: number
  manager_id: number
  price: number
  manager_price?: number
  team: OfferMember[] | string[]
}

export interface CreateOfferParams {
  order_id: number
  manager_id: number
  days: number
  price?: number
  manager_price?: number
  description?: string
  work_description?: string
  telegram_link?: string
  team?: {
    user_id?: number
    job_role_id: number
    hours: number
    salary_per_hour: number
  }[]
}

export interface UpdateOfferParams extends Omit<CreateOfferParams, "order_id" | "manager_id"> {
  id: number
}

export interface IManagerOffersData {
  [key: number]: {
    telegram_link: string
    work_description: string
    users: ITeammate[]
  }
}

export interface IManagerOffersParams {
  orders_id: number[]
}
