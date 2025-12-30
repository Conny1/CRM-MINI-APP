import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  Activity,
  addClient,
  addReminderType,
  Client,
  findandfileter,
  Metric,
  Notes,
  Pagination,
  Reminder,
  ReminderStats,
  Stage,
  Tag,
  updateReminderType,
} from "../types";
import { baseQueryWithReauth } from "./customBaseQuery";

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Clients",
    "Tags",
    "Projects",
    "ClientStages",
    "Tasks",
    "Notes",
    "Reminder",
    "Logs",
  ],
  endpoints: (builder) => ({
    findandFilterClients: builder.query<
      { status: number; data: { results: Client[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/client/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Clients"],
    }),

    addClient: builder.mutation<
      { status: number; data: { message: string } },
      addClient
    >({
      query: (body) => ({
        url: "/admin/client/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients", "Logs"],
    }),
    updateClient: builder.mutation<{ status: number; data: Client }, Client>({
      query: (body) => ({
        url: `/admin/client/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Clients", "Logs"],
    }),

    getClientByid: builder.query<{ status: number; data: Client }, string>({
      query: (id) => ({
        url: `/admin/client/${id}`,
      }),
      providesTags: ["Clients"],
    }),

    getClientNames: builder.query<{ status: number; data: Client[] }, void>({
      query: () => ({
        url: `/admin/client/list/names`,
      }),
      providesTags: ["Clients"],
    }),
    getClientStats: builder.query<{ status: number; data: Metric[] }, void>({
      query: () => ({
        url: `/admin/client/stats`,
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),
    clientPipelineData: builder.query<
      { status: number; data: { status: string; clients: Client[] }[] },
      void
    >({
      query: () => ({
        url: `/admin/client/stage/pipeline`,
      }),
      providesTags: ["Clients", "ClientStages"],
    }),

    deleteClientData: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/client/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients", "Logs"],
    }),

    // TAGS
    findandFilterTags: builder.query<
      { status: number; data: { results: Tag[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/tags/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Tags"],
    }),

    addTags: builder.mutation<
      { status: number; data: { message: string } },
      { title: string }
    >({
      query: (body) => ({
        url: "/admin/tags/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tags", "Logs"],
    }),
    updateTags: builder.mutation<{ status: number; data: Tag }, Tag>({
      query: (body) => ({
        url: `/admin/tags/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tags"],
    }),

    getTagsByid: builder.query<{ status: number; data: Tag }, string>({
      query: (id) => ({
        url: `/admin/tags/${id}`,
      }),
      providesTags: ["Tags"],
    }),

    getTagsNames: builder.query<{ status: number; data: Tag[] }, void>({
      query: () => ({
        url: "/admin/tags/list/names",
      }),
      providesTags: ["Tags"],
    }),

    deletetags: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),

    // Client status | PIPELINE STAGES

    findandFilterClientStatus: builder.query<
      { status: number; data: { results: Stage[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/client-status/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["ClientStages"],
    }),

    addClientStatus: builder.mutation<
      { status: number; data: { message: string } },
      { title: string }
    >({
      query: (body) => ({
        url: "/admin/client-status/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClientStages", "Logs"],
    }),

    getClientStatusNames: builder.query<
      { status: number; data: Stage[] },
      void
    >({
      query: () => ({
        url: `/admin/client-status/list/names`,
      }),
      providesTags: ["ClientStages"],
    }),
    updateClientStatus: builder.mutation<
      { status: number; data: Stage },
      Stage
    >({
      query: (body) => ({
        url: `/admin/client-status/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ClientStages", "Logs"],
    }),

    deleteClientStatus: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/client-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientStages", "Logs"],
    }),

    // Notes
    findandFilterNotes: builder.query<
      { status: number; data: { results: Notes[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/notes/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Notes"],
    }),

    addNotes: builder.mutation<
      { status: number; data: { message: string } },
      { title: string; content: string; client_id: string }
    >({
      query: (body) => ({
        url: "/admin/notes/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes", "Logs"],
    }),

    updateNotes: builder.mutation<{ status: number; data: Notes }, Notes>({
      query: (body) => ({
        url: `/admin/notes/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notes", "Logs"],
    }),

    deleteNotes: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes", "Logs"],
    }),

    // Reminders
    findandFilterReminders: builder.query<
      { status: number; data: { results: Reminder[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/reminder/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Reminder"],
    }),

    addReminder: builder.mutation<
      { status: number; data: { message: string } },
      addReminderType
    >({
      query: (body) => ({
        url: "/admin/reminder/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reminder", "Logs"],
    }),

    updateReminder: builder.mutation<
      { status: number; data: Reminder },
      updateReminderType & {_id:string}
    >({
      query: (body) => ({
        url: `/admin/reminder/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Reminder", "Logs"],
    }),

    deleteReminder: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/reminder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reminder", "Logs"],
    }),

    getReminderStats: builder.query<
      { status: number; data: ReminderStats },
      void
    >({
      query: () => ({
        url: `/admin/reminder/stats`,
        method: "GET",
      }),
      providesTags: ["Reminder"],
    }),

    markReminderCompleted: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/reminder/complete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reminder", "Logs"],
    }),

    reOpenReminder: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/reminder/reopen/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reminder", "Logs"],
    }),

    getUpcomingDeadlineReminders: builder.query<
      { status: number; data: Reminder[] },
      void
    >({
      query: () => ({
        url: "/admin/reminder/upcoming/deadlines",
        method: "GET",
      }),
      providesTags: ["Reminder"],
    }),

    // Recent activity and logs
    findandFilterRecentActivity: builder.query<
      { status: number; data: { results: Activity[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/logs/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Logs"],
    }),

     // Recent activity and logs
    findRecentActivityByClientID : builder.query<
      { status: number; data: { results: Activity[] } & Pagination },
      findandfileter & {client_id:string}
    >({
      query: ({client_id, ...body}) => ({
        url: `/admin/logs/find/${client_id}`,
        method: "POST",
        body,
      }),
      providesTags: ["Logs"],
    }),
  }),
});

export const {
  // client
  useGetClientByidQuery,
  useAddClientMutation,
  useFindandFilterClientsQuery,
  useUpdateClientMutation,
  useDeleteClientDataMutation,
  useGetClientNamesQuery,
  useGetClientStatsQuery,
  // tags
  useGetTagsByidQuery,
  useUpdateTagsMutation,
  useDeletetagsMutation,
  useAddTagsMutation,
  useFindandFilterTagsQuery,
  useGetTagsNamesQuery,

  // clientStatus
  useFindandFilterClientStatusQuery,
  useDeleteClientStatusMutation,
  useAddClientStatusMutation,
  useUpdateClientStatusMutation,
  useGetClientStatusNamesQuery,
  useClientPipelineDataQuery,
  // Notes
  useAddNotesMutation,
  useUpdateNotesMutation,
  useDeleteNotesMutation,
  useFindandFilterNotesQuery,
  // reminder
  useFindandFilterRemindersQuery,
  useDeleteReminderMutation,
  useAddReminderMutation,
  useUpdateReminderMutation,
  useGetReminderStatsQuery,
  useGetUpcomingDeadlineRemindersQuery,
  useMarkReminderCompletedMutation,
  useReOpenReminderMutation,
  // recentActivity / Logs
  useFindandFilterRecentActivityQuery,
  useFindRecentActivityByClientIDQuery,
} = crmApi;
