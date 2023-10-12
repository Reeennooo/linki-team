import { api } from "redux/api/index"
import { BaseResponseType, LinkWithOGParams } from "types/content"
import {
  ChatTypeList,
  IChatDialogsListData,
  IChatMessageData,
  IChatMessageParams,
  ICreateChatData,
  ICreateChatParams,
  ISendMesData,
} from "types/chat"

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<ICreateChatData, ICreateChatParams>({
      query: ({ ...data }) => ({
        url: `dialog/create`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: BaseResponseType<ICreateChatData>) => response.data,
    }),
    createWorkChat: builder.mutation<any, { order_id: number }>({
      query: ({ order_id }) => ({
        url: `dialog/old/create/${order_id}`,
        method: "PUT",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),
    createTeamChat: builder.mutation<any, { team_id: number }>({
      query: ({ team_id }) => ({
        url: `team-dialog/old/create/${team_id}`,
        method: "PUT",
      }),
      transformResponse: (response: BaseResponseType<any>) => response.data,
    }),
    // ф-ция отправки сообщения. Возвращает dialog_id
    // sendMessage: builder.mutation<ISendMesData, MessageParams>({
    sendMessage: builder.mutation<ISendMesData, { formData: FormData; socket: string }>({
      query: ({ socket, formData }) => ({
        url: `dialog/send/message`,
        method: "POST",
        body: formData,
        headers: {
          "X-Socket-ID": socket,
        },
      }),
      transformResponse: (response: BaseResponseType<ISendMesData>) => response.data,
    }),
    getDialog: builder.query<IChatDialogsListData, number>({
      query: (dialog_id) => ({
        url: `dialog/${dialog_id}`,
      }),
      transformResponse: (response: BaseResponseType<IChatDialogsListData>) => response.data,
    }),
    // список чатов, в которых состоит юзер. В основном просто id. Для сокета - чтобы получать список диалогов к которым нужно подключить юзера при загрузке
    getDialogs: builder.query<{ user_id: number; dialogs: number[] }, void>({
      query: () => ({
        url: `user/dialogs`,
      }),
      transformResponse: (response: BaseResponseType<{ user_id: number; dialogs: number[] }>) => response.data,
    }),
    // список чатов с полной инфой
    getDialogsList: builder.mutation<IChatDialogsListData[], void>({
      query: () => ({
        url: `user/dialogs/list`,
      }),
      transformResponse: (response: BaseResponseType<IChatDialogsListData[]>) => response.data,
    }),
    // принимает offset (сколько сообщений пропустить) - выдает по 20 последних сообщений, начиная с offset. Возвращает результат, либо null/[]
    getMessages: builder.query<IChatMessageData[], IChatMessageParams>({
      query: ({ dialog_id, offset }) => ({
        url: `dialog/${dialog_id}/messages`,
        method: "GET",
        params: { offset },
      }),
      transformResponse: (response: BaseResponseType<IChatMessageData[]>) => response.data,
    }),
    // выдает кол-во сообщений в указанном чате. Возвращает результат, либо null/[]
    getMessagesCount: builder.query<number, { dialog_id: number }>({
      query: ({ dialog_id }) => ({
        url: `dialog/${dialog_id}/messages/count`,
      }),
      transformResponse: (response: BaseResponseType<number>) => response.data,
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateChatMutation,
  useSendMessageMutation,
  useLazyGetDialogQuery,
  useLazyGetDialogsQuery,
  useGetDialogsListMutation,
  useLazyGetMessagesQuery,
  useLazyGetMessagesCountQuery,
  useCreateWorkChatMutation,
  useCreateTeamChatMutation,
} = chatApi

// target_id - id юзера с кем хочу говорить(если с ним нет диалога), если диалог с ним есть, то вместо target_id передаем dialog_id
// если не передаём dialog_id, то передаём type
type DialogID = { target_id: number; type: ChatTypeList } | { dialog_id: number }
type MessageParams = DialogID & {
  socket: string
  order_id?: number
  text: string
  links?: LinkWithOGParams[]
  files?: any
}
