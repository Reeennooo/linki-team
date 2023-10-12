import { api } from "./index"
import {
  BaseResponseType,
  Cover,
  Direction,
  Category,
  Tech,
  Stack,
  Speck,
  TimeZone,
  Language,
  ProjectSearchResult,
  UserSearchResult,
} from "types/content"

export const contentApi = api.enhanceEndpoints({ addTagTypes: ["Category", "Tech"] }).injectEndpoints({
  endpoints: (builder) => ({
    getCovers: builder.query<Cover[], void>({
      query: () => ({
        url: `covers`,
      }),
      transformResponse: (response: BaseResponseType<Cover[]>) => response.data,
    }),
    getStacks: builder.query<Stack[], void>({
      query: () => ({
        url: `stacks`,
      }),
      transformResponse: (response: BaseResponseType<Stack[]>) => response.data,
    }),
    getSpecks: builder.query<Speck[], void>({
      query: () => ({
        url: `specks`,
      }),
      transformResponse: (response: BaseResponseType<Speck[]>) => response.data,
    }),
    getDirections: builder.query<Direction[], void>({
      query: () => ({
        url: `directions`,
      }),
      transformResponse: (response: BaseResponseType<Direction[]>) =>
        response.data.map((item) => ({ ...item, value: item.id, label: item.name })),
    }),
    getCategories: builder.query<Category[], number | void>({
      query: (project_direction_id) => ({
        url: `categories`,
        params: project_direction_id ? { project_direction_id } : null,
      }),
      providesTags: (result, error, id) => [{ type: "Category", id: id ? id : undefined }],
      transformResponse: (response: BaseResponseType<Category[]>) =>
        response.data.map((item) => ({ ...item, value: item.id, label: item.name })),
    }),
    getTechs: builder.query<Tech[], number | void>({
      query: (job_role_id) => ({
        url: `techs`,
        params: job_role_id ? { job_role_id } : null,
      }),
      providesTags: (result, error, id) => [{ type: "Tech", id: id ? id : undefined }],
      transformResponse: (response: BaseResponseType<Tech[]>) =>
        response.data.map((item) => ({ ...item, value: item.id, label: item.name })),
    }),
    getLanguages: builder.query<Language[], void>({
      query: () => ({
        url: `languages`,
      }),
      transformResponse: (response: BaseResponseType<Language[]>) => response.data,
    }),
    getTimezones: builder.query<TimeZone[], void>({
      query: () => ({
        url: `timezones`,
      }),
      transformResponse: (response: BaseResponseType<TimeZone[]>) => response.data,
    }),
    searchUsers: builder.query<UserSearchResult[], { search: string }>({
      query: (params) => ({
        url: `user/search`,
        params: params,
      }),
      transformResponse: (response: BaseResponseType<UserSearchResult[]>) => response.data,
    }),
    searchProjects: builder.query<ProjectSearchResult[], { search: string }>({
      query: (params) => ({
        url: `orders/search`,
        params: params,
      }),
      transformResponse: (response: BaseResponseType<ProjectSearchResult[]>) => response.data,
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCoversQuery,
  useGetStacksQuery,
  useGetSpecksQuery,
  useLazyGetSpecksQuery,
  useLazyGetCoversQuery,
  useGetDirectionsQuery,
  useLazyGetDirectionsQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetTechsQuery,
  useLazyGetTechsQuery,
  useGetLanguagesQuery,
  useLazyGetLanguagesQuery,
  useGetTimezonesQuery,
  useLazySearchUsersQuery,
  useLazySearchProjectsQuery,
} = contentApi
