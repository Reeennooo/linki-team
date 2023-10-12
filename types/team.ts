import { OfferMember, ProjectsIncomingParams } from "types/project"

/**
 * @search - необязательно - позволяет искать по названию задачи (там же выводится вакансия и задача)
 * @date - необязательно - значения all, month, week, 3_days - позволяет искать только те вакансии, чьи задачи были переведены в статус "в работе" в указанном промежутке времени
 * @job_roles - не обязательно - массив из id job_roles - позволяет ограничить вакансии
 */
export interface VacanciesIncomingParams extends Omit<ProjectsIncomingParams, "project_categories"> {
  job_roles?: number[]
  hourly_pay?: number[]
}
export interface IVacanciesIncomingData {
  offer: {
    description: string
    work_description: string
  }
  order: {
    description: string
    id: number
    name: string
    started_at: string
  }
  team_member: {
    candidates_count: number
    hours: number
    id: number
    job_role: string
    job_role_id: number
    salary: number
  }
  work_candidate_statuses: {
    executor_status: number | null
    manager_status: number | null
  }
}
export interface IVacancyData extends IVacanciesIncomingData {
  order: {
    description: string
    id: number
    manager_id: number
    name: string
    cover: string
    started_at: string
    media: string[]
    categories: {
      id: number
      name: string
      project_direction_id: number
    }[]
  }
}

export interface IVacanciesSalaryParams {
  search?: string
  date?: string
  job_roles?: number[]
}

/**
 * @team_member_id - id вакансии. Найти id можно тут interface OfferMember["id"]
 */
export interface TeamMemberID {
  team_member_id: number
}

/**
 * @manager_status - значения -1, 0, 1, 2 -статус со стороны менеджера - архив, первая, вторая, третья колонка
 */
export interface ManagerStatusParams extends TeamMemberID {
  manager_status: -1 | 0 | 1 | 2
  executor_id: number
}

export interface IManagerStatusData {
  executor_id: number
  executor_status: number
  id: number
  manager_status: number
  team_member: {
    area_expertise_id: number
    hours: number
    id: number
    job_role: string
    job_role_id: number
    salary_per_hour: number
    user: null | string
  }
  team_member_id: number
  user: {
    avatar: string
    email: string
    id: number
    job_roles: {
      area_expertise_id: number
      hourly_pay: number
      id: number
      name: string
      rating: string
    }[]
    name: string
    position: string
    rating: number
    surname: string
    type: number
  }
}

/**
 * @executor_status - значения 1 или 2 - собственно статус от исполнителя - вторая или третья колонка. -1 - архив
 */
export interface ExecutorStatusParams extends TeamMemberID {
  executor_status: -1 | 1 | 2
}

export interface ITeamJobsData {
  executor_id: number
  executor_status: number // статус со стороны Исполнителя
  id: number
  manager_status: number // статус со стороны PM. 0 - first column
  offer: {
    days: number
    id: number
    manager_id: number
    order_id: number
    price: number
    work_description: string
  }
  order: {
    description: string
    id: number
    name: string
    started_at: string
    work_description: string | null
  }
  team_member: OfferMember
  team_member_id: number
}

export interface ITeammate {
  avatar: string | null
  candidates_count: number
  id: number | null
  in_search: boolean
  job_role: string
  job_role_id: number
  name: string | null
  surname: string | null
  team_member_id: number
  telegram_link?: string
  referal_code?: string
  rating?: number
}

export interface IEditVacancyParams {
  team_member_id: number
  user_id?: number
  job_role_id: number
  hours: number
  salary: number
}

/**
 * @search - поиск по имени, не обязателен
 * @areas_expertise - массив ID-шников области знаний, не обязателен
 * @job_roles - массив ID-шников рабочих ролей(профессий), не обязателен
 * @skills - массив ID-шников скилов, не обязателен
 * @languages - массив ID-шников языков, не обязателен
 * @hourly_pay_min - минимальная ставка, если используется, то только в паре с 'hourly_pay_max', иначе ни одну из них не указывать
 * @hourly_pay_max - максимальная ставка, если используется, то только в паре с 'hourly_pay_min', иначе ни одну из них не указывать
 * @rating_min - минимальный рейтинг, обязательно только вместе с 'rating_max' - иначе не использовать ни одну из них
 * @rating_max - максимальный рейтинг, обязательно только вместе с 'rating_min' -иначе не использовать ни одну из них
 */
export interface IExecutorListParams {
  search?: string
  areas_expertise?: number[]
  job_roles?: number[]
  skills?: number[]
  languages?: number[]
  hourly_pay_min?: number
  hourly_pay_max?: number
  rating_min?: number
  rating_max?: number
}

export interface IExecutorListData {
  id: number
  name: string
  surname: string
  position: string
  rating: number
  email: string
  type: number
  telegram_link: string
  created_at: string
  avatar: string
  job_roles: {
    id: number
    name: string
    area_expertise_id: number
    rating: number | string
    hourly_pay: number
    skills: {
      id: number
      name: string
      job_role_id: number
    }[]
  }[]
}
