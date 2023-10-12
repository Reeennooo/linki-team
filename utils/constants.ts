export const IS_DEV = process.env.NODE_ENV === "development"
export const EMAIL_REGEXP =
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
export const PASS_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&+~()^?`-])[A-Za-z\d@$!%*#?&+~()^?`-]{8,}$/
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL
export const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL
export const MAX_AGE_TOKEN_30_DAYS_IN_SECONDS = 60 * 60 * 24 * 30 //30 дней
export const MAX_AGE_COOKIE_1_DAY_IN_SECONDS = 60 * 60 * 24
export const USER_ID_COOKIE = "user_id"
export const USER_TOKEN_COOKIE = "token"
export const REFERRAL_VACANCY_CODE = "rv_code"
export const REFERRAL_USER_CODE = "ref_code"
export const MANAGER_TEAM_CODE = "mt_code"
export const REFERRAL_WRONG_USER_MSG = "referal_wrong_user_type"
export const PERCENT_PM = 0.2
export const PERCENT_SERVICE = 0.2
export const PERCENT_VAT = 0.19

export const PROJECT_STATUS_DRAFT = 1
export const PROJECT_STATUS_MODERATING = 2
export const PROJECT_STATUS_OPEN = 3
export const PROJECT_STATUS_WORK = 4
export const PROJECT_STATUS_CLOSE = 5

export const USER_TYPE_CUSTOMER = 1
export const USER_TYPE_EXPERT = 2
export const USER_TYPE_PM = 3

export const NOTIFICATION_TYPE_PAYMENT = 1
export const NOTIFICATION_TYPE_PROJECT = 2
export const NOTIFICATION_TYPE_CHAT = 3

export const BLUR_IMAGE_DATA_URL =
  "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

export const DESKTOP_ONBOARDING_BREAKPOINT = 991

export const CHAT_TYPE_PRIVATE = "private"
export const CHAT_TYPE_TEAM = "team"
export const CHAT_TYPE_WORK = "work"
export const CHAT_TYPE_CUSTOMER_MANAGER = "customer_type"
export const CHAT_TYPE_MANAGER_EXPERT = "manager_executor"
export const CHAT_OFFSET_MESSAGES = 20
