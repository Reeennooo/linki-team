import { ProjectStatuses } from "types/project"

export type BaseResponseType<T> = {
  data: T
  success: boolean
  message?: string
}

export interface Cover {
  id: number
  image: string
  name: string
}

export interface Stack {
  id: number
  name: string
  area_expertise_id: number
}

export interface Skill {
  id: number
  job_role_id: number
  name: string
}

export interface Speck {
  id: number
  name: string
}

export interface Direction {
  id: number
  name: string
  label: string
  value: number
}

export interface Category {
  id: number
  label: string
  value: number
  name: string
  specialization_id: number
  project_direction_id?: number
}

export interface Tech {
  id: number
  name: string
  stack_id: number
  label: string
  value: number
}

export interface FilterCategoryPM {
  id: number
  name: string
}

export interface FilterCategoriesPM extends FilterCategoryPM {
  categories: FilterCategoryPM[]
}

export interface FilterJobRolesExpert {
  roles: {
    id: number
    name: string
    roles: {
      id: number
      name: string
    }[]
  }[]
}

export interface IHumanCardData {
  // status = 1
  id: number
  name: string
  surname: string
  position: string
  avatar?: string
  rating: number
  // status = 3
  // isOffer?: boolean // проверять есть ли цена
  price?: number | null
  telegram_link?: string | null
}

export interface LinkWithOGParams {
  url: string
  site_name?: string
  title?: string
  description?: string
  image_url?: string
}

export interface LinkWithOG extends LinkWithOGParams {
  id: number
}
export interface TimeZone {
  id: number
  code: string
  name: string
  offset_hours: number
}

export interface Language {
  id: number
  code: string
  country?: string
  name: string
}

export interface ProjectSearchResult {
  id: number
  name: string
  status: ProjectStatuses
}

export interface UserSearchResult {
  avatar: string
  id: number
  name: string
  surname: string
}
