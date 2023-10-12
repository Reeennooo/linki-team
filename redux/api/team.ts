import { api } from "./index"
import { paramsStringify } from "utils/queryStringUtils"
import {
  ExecutorStatusParams,
  IEditVacancyParams,
  IExecutorListData,
  IExecutorListParams,
  IManagerStatusData,
  ITeamJobsData,
  IVacanciesIncomingData,
  IVacanciesSalaryParams,
  IVacancyData,
  ManagerStatusParams,
  TeamMemberID,
  VacanciesIncomingParams,
} from "types/team"
import { BaseResponseType } from "types/content"
import { RootState } from "redux/store"
import { projectApi } from "redux/api/project"

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    publishVacancy: builder.mutation<{ success: boolean }, number>({
      query: (team_member_id) => ({
        url: `team/${team_member_id}/search`,
        method: "PATCH",
        body: { search_state: 1 },
      }),
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const {
            apiParams: { getManagerOffers, activeProjectIDAtWork },
          } = getState() as RootState
          dispatch(
            projectApi.util.updateQueryData("getManagerOffers", getManagerOffers ?? undefined, (draft) => {
              draft[activeProjectIDAtWork].users.map((vacancy) => {
                if (vacancy.team_member_id === queryArg) vacancy.in_search = true
                return vacancy
              })
            })
          )
        } catch {
          console.log("error publishVacancy")
        }
      },
    }),
    deleteVacancy: builder.mutation<any, number>({
      query: (team_member_id) => ({
        url: `team/${team_member_id}/search`,
        method: "PATCH",
        body: { search_state: 0 },
      }),
    }),
    getVacanciesIncoming: builder.query<IVacanciesIncomingData[], VacanciesIncomingParams>({
      // Для ПМа и исполнителя так же используется сущность кандидатов - точнее - рабочих кандидатов.
      // Но, поскольку ПМ может перетаскивать кандидатов на вакансию сразу и во второй и в третий столбец,
      // и наоборот - исполнитель может перетащить вакансию сразу в третий столбец,
      // а может и во второй - тут у нас 2 статуса, а не один - статус от ПМа и статус от Исполнителя
      query: (data) => ({
        url: `team/incoming`,
        method: "GET",
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),
    getVacanciesSalary: builder.query<number[], IVacanciesSalaryParams>({
      query: (data) => ({
        url: `team/incoming/salary`,
        method: "GET",
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<number[]>) => response.data,
    }),
    getTeamJobs: builder.query<ITeamJobsData[], VacanciesIncomingParams>({
      query: (data) => ({
        url: `team/jobs`,
        method: "GET",
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),
    changeExecutorStatus: builder.mutation<{ success: boolean }, ExecutorStatusParams>({
      query: (data) => ({
        url: `team/executor/status`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => response.data || [],
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const { auth } = getState() as RootState
          const { executor_status: executorStatusID, team_member_id: teamMemberID } = queryArg
          const filter = { job_roles: auth.user.job_roles.map(({ id }) => id) }
          dispatch(
            teamApi.util.updateQueryData("getVacanciesIncoming", filter, (draft) => {
              draft?.map((vacancy) => {
                if (vacancy.team_member.id === teamMemberID) {
                  if (
                    executorStatusID < 0 &&
                    vacancy.team_member.candidates_count > 0 &&
                    vacancy.work_candidate_statuses?.executor_status > 0
                  ) {
                    vacancy.team_member.candidates_count = vacancy.team_member.candidates_count - 1
                  } else if (executorStatusID > 0) {
                    if (!vacancy.work_candidate_statuses?.executor_status) {
                      vacancy.team_member.candidates_count = vacancy.team_member.candidates_count + 1
                    }
                  }
                  vacancy.work_candidate_statuses.executor_status = executorStatusID
                }
                return vacancy
              })
            })
          )
        } catch {
          console.log("error changeExecutorStatus")
        }
      },
    }),
    changeManagerStatus: builder.mutation<{ success: boolean }, ManagerStatusParams>({
      query: (data) => ({
        url: `team/manager/status`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => response.data || [],
      async onQueryStarted(queryArg, { dispatch }) {
        try {
          const { team_member_id, manager_status, executor_id } = queryArg
          dispatch(
            teamApi.util.updateQueryData("getVacancyCandidates", { team_member_id: team_member_id }, (draft) => {
              draft.map((candidate) => {
                if (candidate.executor_id === executor_id) candidate.manager_status = manager_status
                return candidate
              })
            })
          )
        } catch {
          console.log("error changeManagerStatus")
        }
      },
    }),
    getVacancyCandidates: builder.query<IManagerStatusData[], TeamMemberID>({
      query: (data) => ({
        url: `team/candidates`,
        method: "GET",
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<IManagerStatusData[]>) => response.data || [],
    }),
    deleteTeamCandidate: builder.mutation<{ success: boolean }, TeamMemberID>({
      //удаляет кандидата - по сути - для перетаскивания исполнителем каточки обратно в первый столбец
      query: (data) => ({
        url: `/team/delete/candidate`,
        method: "DELETE",
        body: data,
      }),
      transformResponse: (response: any) => response.data || [],
      async onQueryStarted(queryArg, { dispatch, getState }) {
        try {
          const { auth } = getState() as RootState
          const { team_member_id: teamMemberID } = queryArg
          const filter = { job_roles: auth.user.job_roles.map(({ id }) => id) }
          dispatch(
            teamApi.util.updateQueryData("getVacanciesIncoming", filter, (draft) => {
              draft.map((vacancy) => {
                if (vacancy.team_member.id === teamMemberID) {
                  if (vacancy.team_member.candidates_count > 0) {
                    vacancy.team_member.candidates_count = vacancy.team_member.candidates_count - 1
                  }
                  vacancy.work_candidate_statuses.executor_status = null
                }
                return vacancy
              })
            })
          )
        } catch {
          console.log("error changeExecutorStatus")
        }
      },
    }),
    getVacancy: builder.query<IVacancyData, number>({
      query: (team_member_id) => ({
        url: `team/order/${team_member_id}`,
      }),
      transformResponse: (response: BaseResponseType<IVacancyData>) => response.data,
    }),
    createVacancyCode: builder.mutation<string, number>({
      query: (team_member_id) => ({
        url: `team/${team_member_id}/referal`,
        method: "PATCH",
      }),
      transformResponse: (response: BaseResponseType<string>) => response.data,
      async onQueryStarted(queryArg, { dispatch, getState, queryFulfilled }) {
        try {
          const {
            apiParams: { getManagerOffers, teamMemberID, activeProjectIDAtWork },
          } = getState() as RootState
          queryFulfilled.then((res) => {
            if (!res.data) return
            dispatch(
              projectApi.util.updateQueryData("getManagerOffers", getManagerOffers ?? undefined, (draft) => {
                draft[activeProjectIDAtWork].users.map((user) => {
                  if (user.team_member_id === teamMemberID) user.referal_code = res.data
                  return user
                })
              })
            )
          })
        } catch (err) {
          console.error(err)
        }
      },
    }),
    sendInviteEmail: builder.mutation<{ success: boolean }, { team_member_id: number; email: string }>({
      query: ({ team_member_id, email }) => ({
        url: `team/${team_member_id}/invite`,
        method: "POST",
        body: { email },
      }),
    }),
    inviteFavoriteToJob: builder.mutation<{ success: boolean }, { team_member_id: number; executor_id: number }>({
      query: ({ team_member_id, executor_id }) => ({
        url: `team/${team_member_id}/favorite/invite`,
        method: "POST",
        body: { executor_id },
      }),
    }),
    editVacancy: builder.mutation<any, IEditVacancyParams>({
      query: (data) => ({
        url: `team/${data.team_member_id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),
    assignToJob: builder.mutation<{ success: boolean }, { team_member_id: number; executor_id: number }>({
      query: ({ team_member_id, executor_id }) => ({
        url: `team/${team_member_id}/executor`,
        method: "PATCH",
        body: { executor_id },
      }),
    }),
    finishJob: builder.mutation<any, { team_member_id: number; rating: number }>({
      query: ({ team_member_id, rating }) => ({
        url: `team/${team_member_id}/finish`,
        method: "PATCH",
        body: { rating },
      }),
    }),
    getExecutorList: builder.query<IExecutorListData[], IExecutorListParams | void>({
      query: (data) => ({
        url: "executors/list",
        method: "GET",
        params: paramsStringify(data),
      }),
      transformResponse: (response: BaseResponseType<IExecutorListData[]>) => response.data || [],
    }),
    getExecutorsSalaryLimits: builder.query<number[], void>({
      query: () => ({
        url: `executors/list/salary/limits`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<number[]>) => response.data,
    }),
  }),
  overrideExisting: false,
})

export const {
  usePublishVacancyMutation,
  /* устанавливает статус со стороны исполнителя */
  useChangeExecutorStatusMutation,
  /* устанавливает статус со стороны ПМа */
  useChangeManagerStatusMutation,
  useDeleteVacancyMutation,
  useGetVacanciesIncomingQuery,
  useLazyGetVacanciesIncomingQuery,
  useGetVacanciesSalaryQuery,
  useLazyGetVacanciesSalaryQuery,
  useGetTeamJobsQuery,
  useLazyGetTeamJobsQuery,
  useGetVacancyCandidatesQuery,
  useLazyGetVacancyCandidatesQuery,
  useDeleteTeamCandidateMutation,
  useLazyGetVacancyQuery,
  useCreateVacancyCodeMutation,
  useSendInviteEmailMutation,
  useEditVacancyMutation,
  useAssignToJobMutation,
  useFinishJobMutation,
  useInviteFavoriteToJobMutation,
  /* список исполнителей со 100% профилем для PM с премиумом */
  useGetExecutorListQuery,
  useLazyGetExecutorListQuery,
  /* min/max значения ставки за час у 100% профилей экспертов */
  useGetExecutorsSalaryLimitsQuery,
  useLazyGetExecutorsSalaryLimitsQuery,
} = teamApi
