import {
  CHAT_TYPE_CUSTOMER_MANAGER,
  CHAT_TYPE_MANAGER_EXPERT,
  CHAT_TYPE_PRIVATE,
  CHAT_TYPE_TEAM,
  CHAT_TYPE_WORK,
} from "utils/constants"

export type ChatTypePrivate = typeof CHAT_TYPE_PRIVATE
export type ChatTypeTeam = typeof CHAT_TYPE_TEAM
export type ChatTypeWork = typeof CHAT_TYPE_WORK
export type ChatTypeCustomerManager = typeof CHAT_TYPE_CUSTOMER_MANAGER
export type ChatTypeManagerExpert = typeof CHAT_TYPE_MANAGER_EXPERT
/**
 * private - личный чат
 * team - командный чат без привязки к задаче
 * work - групповой чат задачи
 * customer_type - чат между клиентом и менеджером с привязкой к задаче
 * manager_executor - чат между менеджером и исполнителем с привязкой к задаче
 */
export type ChatTypeList =
  | ChatTypePrivate
  | ChatTypeTeam
  | ChatTypeWork
  | ChatTypeCustomerManager
  | ChatTypeManagerExpert
export interface IChatMessageData {
  created_at: string
  dialog_id: number
  files?: {
    description: string
    id: number
    path: string
    size: number
  }[]
  id: number
  links?: any[]
  text?: string
  updated_at?: string
  user_id?: number
  user?: {
    email: string
    id: number
    name: string
    surname?: string
    type: number
    main_image?: {
      path?: string
    }
  }
  socket?: string
}
export interface IChatDialogsListData {
  comment?: string
  created_at: string | null
  id: number
  is_archive: boolean
  manager_team_id: number | null
  order_id: number | null
  type: ChatTypeList
  users: {
    email: string
    id: number
    name: string
    surname: string
    type: number
  }[]
}
/* offset - кол-во сообщений, которых нужно пропустить. Изначально 0, потом +20 */
export interface IChatMessageParams {
  dialog_id: number
  offset: number
}
export interface ICreateChatData {
  id: number
  comment: string
  is_archive: boolean
  type: ChatTypeList
}
export interface ICreateChatParams {
  /** target_id - целевой юзер */
  target_id?: number
  /** order_id - ид задачи, если это групповой чат */
  order_id?: number
  /** comment - заголовок диалога - позволит его в админке легче искать ну или если может для каких-то особенных диалогов */
  comment?: string
  /** type - тип чата */
  type: ChatTypeList
}
export interface ISendMesData {
  dialog_id: number
  message_id: number
  message: {
    created_at: string
    dialog_id: number
    files?: {
      description: string
      id: number
      path: string
      size: number
    }[]
    id: number
    links?: []
    text: string
    user: {
      email: string
      id: number
      name: string
      surname?: string
      type: number
      main_image?: {
        path?: string
      }
    }
  }
}
