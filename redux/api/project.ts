import { api } from "./index"
import {
  Candidate,
  CreateOfferParams,
  ExactProject,
  IManagerOffersData,
  IManagerOffersParams,
  OfferData,
  OfferParams,
  Project,
  ProjectsIncomingParams,
  ProjectStatuses,
  UpdateOfferParams,
} from "types/project"
import { BaseResponseType, FilterCategoriesPM, FilterJobRolesExpert } from "types/content"
import { paramsStringify } from "utils/queryStringUtils"
import { clearEmptiesFromObject } from "utils/clearEmptiesFromObject"
import { RootState } from "redux/store"
import { PROJECT_STATUS_WORK } from "utils/constants"
import moment from "moment"

export const projectApi = api.enhanceEndpoints({ addTagTypes: ["Projects"] }).injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<any, FormData>({
      query: (data) => ({
        url: `order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
    startProject: builder.mutation<any, { project_id: number; manager_id: number }>({
      query: ({ project_id, manager_id }) => ({
        url: `/order/start/${project_id}`,
        method: "POST",
        body: { manager_id },
      }),
      async onQueryStarted(queryArg, { dispatch }) {
        try {
          const { project_id } = queryArg
          dispatch(
            projectApi.util.updateQueryData("getProjects", undefined, (draft) => {
              draft.map((project) => {
                if (project.id === project_id) {
                  project.status = PROJECT_STATUS_WORK
                  project.started_at = moment().format("DD.MM.YYYY")
                }
                return project
              })
            })
          )
        } catch {
          console.log("catch error")
        }
      },
    }),
    getPay: builder.query<string, { order_id: number; manager_id: number }>({
      query: ({ order_id, manager_id }) => ({
        url: `/invoice/${order_id}?manager_id=${manager_id}`,
        // params: paramsStringify(manager_id),
      }),
      transformResponse: (response: BaseResponseType<string>) => response.data,
      async onQueryStarted(queryArg, { queryFulfilled }) {
        try {
          queryFulfilled.then((res) => {
            if (res.data?.length > 0) {
              window.open(res.data, "_blank")
            }
          })
        } catch (err) {
          console.log("catch error", err)
        }
      },
    }),

    deleteProject: builder.mutation<any, { project_id: number }>({
      query: ({ project_id }) => ({
        url: `order/delete/draft/${project_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch }) {
        try {
          const { project_id } = queryArg
          dispatch(
            projectApi.util.updateQueryData("getProjects", undefined, (draft) => {
              return draft.filter((project) => project.id !== project_id)
            })
          )
        } catch {
          console.log("catch error")
        }
      },
    }),
    deleteOpenProject: builder.mutation<any, { project_id: number }>({
      query: ({ project_id }) => ({
        url: `order/delete/open/${project_id}`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArg, { dispatch }) {
        try {
          const { project_id } = queryArg
          dispatch(
            projectApi.util.updateQueryData("getProjects", undefined, (draft) => {
              return draft.filter((project) => project.id !== project_id)
            })
          )
        } catch {
          console.log("catch error")
        }
      },
    }),
    changeProjectStatus: builder.mutation<any, { project_id: number; status: ProjectStatuses }>({
      query: ({ project_id, status }) => ({
        url: `order/status/${project_id}`,
        method: "POST",
        body: { status },
      }),
    }),
    getExactProject: builder.query<ExactProject, number>({
      query: (order_id) => ({
        url: `order/${order_id}`,
      }),
      transformResponse: (response: BaseResponseType<ExactProject>) => response.data,
    }),
    // Если авторизован клиент - выдаст созданные им задачи. Если авторизован менеджер - выдаст задачи, на которые он назначен. Для исполнителя доступа нет.
    getProjects: builder.query<Project[], void>({
      query: () => ({
        url: `orders`,
      }),
      providesTags: ["Projects"],
      transformResponse: (response: BaseResponseType<Project[]>) => response.data || [],
    }),
    getProjectsIncoming: builder.query<Project[], ProjectsIncomingParams | void>({
      query: (data) => ({
        url: `orders/incoming`,
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<Project[]>) => response.data || [],
    }),
    getProjectsFinished: builder.query<any, void>({
      query: () => ({
        url: `orders/finished`,
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data || [],
    }),
    // finishOrder - для PM, ставит дату finished_at для проекта
    finishOrder: builder.mutation<
      { success: boolean },
      { order_id: number; ratings: { rating: number; about_id: number }[] }
    >({
      query: ({ order_id, ratings }) => ({
        url: `order/finish/${order_id}`,
        method: "POST",
        body: { ratings },
      }),
    }),
    // closeOrder - для заказчика, ставит проекту статус 5
    closeOrder: builder.mutation<{ success: boolean }, { order_id: number; rating: number }>({
      query: ({ order_id, rating }) => ({
        url: `order/close/${order_id}`,
        method: "POST",
        body: { rating },
      }),
    }),
    getManagerProjectCategories: builder.query<FilterCategoriesPM[], void>({
      query: () => ({
        url: `manager/project/categories`,
      }),
      transformResponse: (response: BaseResponseType<FilterCategoriesPM[]>) => response.data || [],
    }),
    getExecutorJobRoles: builder.query<FilterJobRolesExpert[], void>({
      query: () => ({
        url: `executor/job/roles`,
      }),
      transformResponse: (response: BaseResponseType<FilterJobRolesExpert[]>) => response.data || [],
    }),
    getCandidates: builder.query<Candidate[], { order_id: number }>({
      query: ({ order_id }) => ({
        url: `order/${order_id}/candidates`,
      }),
      transformResponse: (response: BaseResponseType<Candidate[]>) => response.data || [],
    }),
    deleteCandidate: builder.mutation<{ data: []; success: boolean }, { order_id: number; manager_id: number }>({
      query: (data) => ({
        url: `candidate/delete`,
        method: "delete",
        body: data,
      }),
      transformResponse: (response: any) => response.data || [],
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const { boardFilter } = getState() as RootState
          const { order_id, manager_id } = queryArg
          dispatch(
            projectApi.util.updateQueryData("getProjectsIncoming", clearEmptiesFromObject(boardFilter), (draft) => {
              draft.map((project) => {
                if (project.id === order_id) {
                  let isManagerExist = false
                  project.candidate_statuses = project.candidate_statuses.filter((status) => {
                    if (status.hasOwnProperty(manager_id)) isManagerExist = true
                    return !status.hasOwnProperty(manager_id)
                  })
                  if (project.candidates_count > 0 && isManagerExist) {
                    project.candidates_count = project.candidates_count - 1
                  }
                }
                return project
              })
            })
          )
        } catch {}
      },
    }),
    setCandidatesStatus: builder.mutation<Candidate[], { order_id: number; manager_id: number; status: number }>({
      query: (data) => ({
        url: `candidate/status`,
        method: "post",
        body: data,
      }),
      transformResponse: (response: BaseResponseType<Candidate[]>) => response.data || [],
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const { boardFilter, auth } = getState() as RootState
          const { order_id: orderIDQuery, status: statusQuery, manager_id: managerIDQuery } = queryArg
          switch (auth.user.type) {
            case 3: // manager
              dispatch(
                projectApi.util.updateQueryData("getProjectsIncoming", clearEmptiesFromObject(boardFilter), (draft) => {
                  draft.map((project) => {
                    if (project.id === orderIDQuery) {
                      let isStatusExist = false
                      project.candidate_statuses.map((statusCandidate) => {
                        if (statusCandidate.hasOwnProperty(managerIDQuery)) {
                          isStatusExist = true
                          statusCandidate[managerIDQuery] = statusQuery
                        }
                        return statusCandidate
                      })

                      if (statusQuery < 0 && project.candidates_count > 0 && isStatusExist) {
                        project.candidates_count = project.candidates_count - 1
                      } else if (statusQuery > 0 && !isStatusExist) {
                        project.candidates_count = project.candidates_count + 1
                      }

                      if (!project.candidate_statuses.length) {
                        project.candidate_statuses.push({ [managerIDQuery]: statusQuery })
                        return project
                      }
                    }
                    return project
                  })
                })
              )
              break
            case 1: // client
              dispatch(
                projectApi.util.updateQueryData("getCandidates", { order_id: orderIDQuery }, (draft) => {
                  draft.map((candidate) => {
                    if (candidate.manager.id === managerIDQuery) candidate.status = statusQuery as Candidate["status"]
                    return candidate
                  })
                })
              )
              break
          }
        } catch {}
      },
    }),
    getOffer: builder.query<OfferData, OfferParams>({
      query: (data) => ({
        url: `offer`,
        params: data,
      }),
      transformResponse: (response: BaseResponseType<OfferData>) => response.data,
    }),
    getManagerOffers: builder.query<IManagerOffersData, IManagerOffersParams>({
      query: (data) => ({
        url: `order/manager/offers`,
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<IManagerOffersData>) => response.data,
    }),
    getExecutingOffers: builder.query<IManagerOffersData, IManagerOffersParams>({
      query: (data) => ({
        url: `order/executing/offers`,
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<IManagerOffersData>) => response.data,
    }),
    createOffer: builder.mutation<{ success: boolean }, CreateOfferParams>({
      query: (data) => ({
        url: `offer`,
        method: "post",
        body: data,
      }),
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const { manager_id, order_id } = queryArg
          const { boardFilter } = getState() as RootState
          dispatch(
            projectApi.util.updateQueryData("getProjectsIncoming", clearEmptiesFromObject(boardFilter), (draft) => {
              draft.map((project) => {
                if (project.id === order_id && !project.offers.includes(manager_id)) {
                  project.offers.push(manager_id)
                }
                return project
              })
            })
          )
        } catch {
          console.log("error createOffer")
        }
      },
    }),
    updateOffer: builder.mutation<{ success: boolean }, UpdateOfferParams>({
      query: ({ id, ...data }) => ({
        url: `offer/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const { work_description } = queryArg
          const {
            apiParams: { getManagerOffers, projectID },
          } = getState() as RootState
          if (!work_description) return
          dispatch(
            projectApi.util.updateQueryData("getManagerOffers", getManagerOffers ?? undefined, (draft) => {
              draft[projectID].work_description = work_description
            })
          )
        } catch {
          console.log("error updateOffer")
        }
      },
    }),
    updateOfferPublic: builder.mutation<{ success: boolean }, number>({
      query: (offer_id) => ({
        url: `offer/${offer_id}/public`,
        method: "PATCH",
      }),
    }),
    deleteOffer: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `offer/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateProjectMutation,
  useStartProjectMutation,
  useDeleteProjectMutation,
  useDeleteOpenProjectMutation,
  useChangeProjectStatusMutation,
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
  useGetProjectsFinishedQuery,
  useLazyGetProjectsFinishedQuery,
  useLazyGetExactProjectQuery,
  useGetProjectsIncomingQuery,
  useLazyGetProjectsIncomingQuery,
  useGetManagerProjectCategoriesQuery,
  useLazyGetManagerProjectCategoriesQuery,
  useGetExecutorJobRolesQuery,
  useLazyGetExecutorJobRolesQuery,
  useGetCandidatesQuery,
  useLazyGetCandidatesQuery,
  useDeleteCandidateMutation,
  useSetCandidatesStatusMutation,
  useGetOfferQuery,
  useLazyGetOfferQuery,
  useLazyGetManagerOffersQuery,
  useLazyGetExecutingOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useUpdateOfferPublicMutation,
  useDeleteOfferMutation,
  useFinishOrderMutation,
  useCloseOrderMutation,
  useLazyGetPayQuery,
} = projectApi
