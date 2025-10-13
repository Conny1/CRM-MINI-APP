import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  addClient,
  addProjectType,
  Client,
  findandfileter,
  Notes,
  Pagination,
  Project,
  Stage,
  Tag,
  Task,
  TaskformInputType,
} from "../types";

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NTc1OTcyNTh9.hBs8PY9jdogePqODqjU62EILdT5elXhMqfspp2Ui-p8";
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Clients", "Tags", "Projects", "ClientStages", "Tasks", "Notes"],
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
      invalidatesTags: ["Clients"],
    }),
    updateClient: builder.mutation<{ status: number; data: Client }, Client>({
      query: (body) => ({
        url: `/admin/client/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Clients"],
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
      invalidatesTags: ["Clients"],
    }),
    // Projects
    findandFilterProjects: builder.query<
      { status: number; data: { results: Project[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/project/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Projects"],
    }),

    addProject: builder.mutation<
      { status: number; data: { message: string } },
      addProjectType
    >({
      query: (body) => ({
        url: "/admin/project/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<{ status: number; data: Project }, Project>(
      {
        query: (body) => ({
          url: `/admin/project/${body._id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Projects"],
      }
    ),

    getProjectByid: builder.query<{ status: number; data: Project }, string>({
      query: (id) => ({
        url: `/admin/project/${id}`,
      }),
      providesTags: ["Projects"],
    }),

    getProjectNames: builder.query<{ status: number; data: Project[] }, void>({
      query: () => ({
        url: "/admin/project/list/names",
      }),
      providesTags: ["Projects"],
    }),

    deleteProject: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    // TASKS
    findandFilterTasks: builder.query<
      { status: number; data: { results: Task[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/task/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Tasks"],
    }),

    addTask: builder.mutation<
      { status: number; data: { message: string } },
      TaskformInputType
    >({
      query: (body) => ({
        url: "/admin/task/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<{ status: number; data: Task }, Task>({
      query: (body) => ({
        url: `/admin/task/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    getTaskByid: builder.query<{ status: number; data: Task }, string>({
      query: (id) => ({
        url: `/admin/task/${id}`,
      }),
      providesTags: ["Tasks"],
    }),

    deletetask: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
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
      invalidatesTags: ["Tags"],
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
      invalidatesTags: ["ClientStages"],
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
      invalidatesTags: ["ClientStages"],
    }),

    deleteClientStatus: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/client-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientStages"],
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
      { title: string; content: string , client_id:string}
    >({
      query: (body) => ({
        url: "/admin/notes/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),

    updateNotes: builder.mutation<{ status: number; data: Notes }, Notes>({
      query: (body) => ({
        url: `/admin/notes/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),

    deleteNotes: builder.mutation<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetClientByidQuery,
  useAddClientMutation,
  useFindandFilterClientsQuery,
  useUpdateClientMutation,
  useDeleteClientDataMutation,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useFindandFilterProjectsQuery,
  useGetProjectByidQuery,
  useDeleteProjectMutation,
  useAddTaskMutation,
  useDeletetaskMutation,
  useGetTaskByidQuery,
  useFindandFilterTasksQuery,
  useUpdateTaskMutation,
  useGetTagsByidQuery,
  useUpdateTagsMutation,
  useDeletetagsMutation,
  useAddTagsMutation,
  useFindandFilterTagsQuery,
  useFindandFilterClientStatusQuery,
  useDeleteClientStatusMutation,
  useAddClientStatusMutation,
  useUpdateClientStatusMutation,
  useGetClientStatusNamesQuery,
  useGetTagsNamesQuery,
  useGetProjectNamesQuery,
  useGetClientNamesQuery,
  useClientPipelineDataQuery,
  useAddNotesMutation,
  useUpdateNotesMutation,
  useDeleteNotesMutation,
  useFindandFilterNotesQuery,
} = crmApi;
