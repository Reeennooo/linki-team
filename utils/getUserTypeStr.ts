import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT, USER_TYPE_PM } from "utils/constants"

export function getUserTypeStr(type: number): string {
  switch (type) {
    case USER_TYPE_CUSTOMER:
      return "Client"
    case USER_TYPE_EXPERT:
      return "Expert"
    case USER_TYPE_PM:
      return "Project Manager"
    default:
      return "no type"
  }
}
