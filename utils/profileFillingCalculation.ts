import { User } from "types/auth"
import { hasValueBetweenTags } from "./hasValueBetweenTags"

export const generateImproveListFunction = (user: User) => {
  const customerImproveList = [
    {
      name: user.avatar?.length > 0 ? null : "Avatar",
      id: 1,
      area: "photoedit",
    },
    {
      name: user.name?.length > 0 ? null : "First Name",
      id: 2,
      area: "firstnameedit",
    },
    {
      name: user.surname?.length > 0 ? null : "Last Name",
      id: 3,
      area: "lasttnameedit",
    },
    {
      name: hasValueBetweenTags(user.position) ? null : "Details",
      id: 4,
      area: "detailsedit",
    },
    {
      name: user.company?.links?.length > 0 && user.company?.name?.length ? null : "Company",
      id: 5,
      area: "companyedit",
    },
    {
      name: user.languages?.length > 0 ? null : "Language",
      id: 6,
      area: "langedit",
    },
    {
      name: user.timezone ? null : "Timezone",
      id: 7,
      area: "timezoneedit",
    },
  ]
  const expertImproveList = [
    {
      name: user.avatar?.length > 0 ? null : "Avatar",
      id: 1,
      area: "photoedit",
    },
    {
      name: user.name?.length > 0 ? null : "First Name",
      id: 2,
      area: "firstnameedit",
    },
    {
      name: user.surname?.length > 0 ? null : "Last Name",
      id: 3,
      area: "lasttnameedit",
    },
    {
      name: hasValueBetweenTags(user.position) ? null : "Details",
      id: 5,
      area: "detailsedit",
    },
    {
      name: user.links?.length > 0 ? null : "Portfolio",
      id: 6,
      area: "portfolioedit",
    },
    {
      name: user.job_roles?.length > 0 ? null : "Roles & Skills",
      id: 7,
      area: "rolesedit",
    },
    {
      name: user.languages?.length > 0 ? null : "Language",
      id: 8,
      area: "langedit",
    },
    {
      name: user.timezone ? null : "Timezone",
      id: 9,
      area: "timezoneedit",
    },
  ]
  const pmImproveList = [
    {
      name: user.avatar?.length > 0 ? null : "Avatar",
      id: 1,
      area: "photoedit",
    },
    {
      name: user.name?.length > 0 ? null : "First Name",
      id: 2,
      area: "firstnameedit",
    },
    {
      name: user.surname?.length > 0 ? null : "Last Name",
      id: 3,
      area: "lasttnameedit",
    },
    {
      name: hasValueBetweenTags(user.position) ? null : "Details",
      id: 4,
      area: "detailsedit",
    },
    {
      name: user.links?.length > 0 ? null : "Portfolio",
      id: 5,
      area: "portfolioedit",
    },
    {
      name: user.project_categories?.length > 0 ? null : "Directions & Categories",
      id: 6,
      area: "directionsedit",
    },
    {
      name: user.languages?.length > 0 ? null : "Language",
      id: 7,
      area: "langedit",
    },
    {
      name: user.timezone ? null : "Timezone",
      id: 9,
      area: "timezoneedit",
    },
  ]

  let improveList = []

  switch (user.type) {
    case 1:
      improveList = customerImproveList
      break
    case 2:
      improveList = expertImproveList
      break
    case 3:
      improveList = pmImproveList
      break
    default:
      improveList = []
  }
  return improveList
}

export const calculatePercentagesFunction = (user: User): number => {
  let count = 0
  const improveList = generateImproveListFunction(user)
  const improveItemValue = Math.floor(100 / improveList.length)
  improveList.length > 0 &&
    improveList.forEach((item) => {
      if (item.name) count++
    })
  return 100 - improveItemValue * count > 5 && count > 0 ? 100 - improveItemValue * count : 100
}
