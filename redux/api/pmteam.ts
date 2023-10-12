import { api } from "./index"
import { paramsStringify } from "utils/queryStringUtils"
import { BaseResponseType } from "types/content"
import { RootState } from "redux/store"
import { projectApi } from "redux/api/project"
import { objectToFormData } from "./utils"
import { ICatalogTeam, ICatalogTeamsResponse, IPmteam, IPmteamExecutor, IPmTeamReceiving } from "types/pmteam"

export const pmteamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //данные о конкретной команде
    getTeamInfo: builder.query<IPmTeamReceiving, number>({
      query: (id) => ({
        url: `/manager-team/${id}`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //список исполнителей для данной команды
    getPmTeamExecutors: builder.query<IPmteamExecutor[], number>({
      query: (id) => ({
        url: `/manager-team/executors/${id}`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //Список команд для конкретного ПМа
    getManagerTeams: builder.query<IPmTeamReceiving[], void>({
      query: () => ({
        url: `/manager-teams`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //Создание команды
    createTeam: builder.mutation<{ id: number }, IPmteam>({
      query: (data) => ({
        url: `/manager-team/create`,
        method: "POST",
        body: objectToFormData(data),
      }),
      transformResponse: (response: BaseResponseType<{ id: number }>) => response.data,
    }),

    //Редактирование команды
    updateTeam: builder.mutation<{ id: number }, { data: IPmteam; id: number }>({
      query: ({ data, id }) => ({
        url: `/manager-team/update/${id}`,
        method: "POST",
        body: objectToFormData(data),
      }),
      transformResponse: (response: BaseResponseType<{ id: number }>) => response.data,
    }),

    //Добавляем эксперта в команду
    addExpertToTeam: builder.mutation<any, { teamId: number; executorId: number }>({
      query: ({ teamId, executorId }) => ({
        url: `/manager-team/add/executor/${teamId}`,
        method: "POST",
        body: { executor_id: executorId },
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //Отправляем инвайт на почту эксперту
    sendEmailInviteToTeam: builder.mutation<any, { teamId: number; email: string }>({
      query: ({ teamId, email }) => ({
        url: `/manager-team/mail/invite/${teamId}`,
        method: "POST",
        body: { email: email },
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //Даем пользователю ЭКСКЛЮЗИВНОЕ право
    suggestExclusiveToExpert: builder.mutation<any, { teamId: number; executorId: number }>({
      query: ({ teamId, executorId }) => ({
        url: `/manager-team/suggest-exclusive/${teamId}/${executorId}`,
        method: "POST",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //Даем пользователю ЭКСКЛЮЗИВНОЕ право
    revokeExclusiveToExpert: builder.mutation<any, { teamId: number; executorId: number }>({
      query: ({ teamId, executorId }) => ({
        url: `/manager-team/revoke-exclusive/${teamId}/${executorId}`,
        method: "POST",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //УДАЛЯЕМ КОМАНДУ
    dellPmTeam: builder.mutation<any, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/manager-team/delete/${teamId}`,
        method: "DELETE",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //УДАЛЯЕМ эксперта из команды
    dellExpertFromTeam: builder.mutation<any, { teamId: number; executorId: number }>({
      query: ({ teamId, executorId }) => ({
        url: `/manager-team/remove/executor/${teamId}`,
        method: "DELETE",
        body: { executor_id: executorId },
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //ВЫХОД эксперта из команды
    exitExpertFromTeam: builder.mutation<any, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/manager-team/leave/${teamId}`,
        method: "DELETE",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //ЭКСПЕРТ СОГЛАШАЕТСЯ ВСТУПИТЬ В КОМАНДУ
    expertAcceptInviteToTeam: builder.mutation<any, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/manager-team/accept/${teamId}`,
        method: "POST",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),
    //ЭКСПЕРТ ОТКЛОНЯЕТ ПРИГЛАШЕНИЕ В КОМАНДУ
    expertRejectInviteToTeam: builder.mutation<any, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/manager-team/reject/${teamId}`,
        method: "POST",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //ЭКСПЕРТ ПРИНИМАЕТ ЭКСКЛЮЗИВ
    expertAcceptExclusive: builder.mutation<any, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/manager-team/exclusive/${teamId}`,
        method: "POST",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //ЭКСПЕРТ ОТКЛОНЯЕТ ЭКСКЛЮЗИВ
    expertRejectExclusive: builder.mutation<any, { teamId: number }>({
      query: ({ teamId }) => ({
        url: `/manager-team/reject-exclusive/${teamId}`,
        method: "POST",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    //ЭКСПЕРТ ВСТУПАЕТ В КОМАНДУ ЧЕРЕЗ КОД
    expertJoinPmTeamViaCode: builder.mutation<any, { manager_team_code: string | string[] }>({
      query: ({ manager_team_code }) => ({
        url: `/manager-team/join/via-code`,
        method: "POST",
        body: { manager_team_code: manager_team_code },
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    getCatalogTeams: builder.query<ICatalogTeamsResponse, void>({
      query: () => ({
        url: `/manager-teams/catalog`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    getCatalogTeamsFilters: builder.query<any, void>({
      query: () => ({
        url: `/manager-team/catalog/filters`,
        method: "GET",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),

    getCatalogTeamsFiltered: builder.query<
      any,
      {
        direction: number
        body?: {
          search?: string
          project_category?: number
          rating_min?: number
          job_count_max: number
          project_direction: number
        }
      }
    >({
      query: ({ direction, body }) => ({
        url: `/manager-team/catalog/${direction}`,
        method: "GET",
        params: paramsStringify(body),
      }),
      transformResponse: (response: BaseResponseType<ICatalogTeam>) => response.data,
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetTeamInfoQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useGetManagerTeamsQuery,
  useLazyGetManagerTeamsQuery,
  useLazyGetPmTeamExecutorsQuery,
  useAddExpertToTeamMutation,
  useExpertAcceptInviteToTeamMutation,
  useExpertRejectInviteToTeamMutation,
  useDellExpertFromTeamMutation,
  useExitExpertFromTeamMutation,
  useDellPmTeamMutation,
  useSuggestExclusiveToExpertMutation,
  useRevokeExclusiveToExpertMutation,
  useSendEmailInviteToTeamMutation,
  useExpertAcceptExclusiveMutation,
  useExpertRejectExclusiveMutation,
  useExpertJoinPmTeamViaCodeMutation,
  useGetCatalogTeamsQuery,
  useGetCatalogTeamsFiltersQuery,
  useLazyGetCatalogTeamsFiltersQuery,
  useGetCatalogTeamsFilteredQuery,
  useLazyGetCatalogTeamsFilteredQuery,
} = pmteamApi
