import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  addClient,
  addProjectType,
  Client,
  findandfileter,
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
  endpoints: (builder) => ({
    findandFilterClients: builder.mutation<
      { status: number; data: { results: Client[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/client/findandfilter",
        method: "POST",
        body,
      }),
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
    }),
    updateClient: builder.mutation<{ status: number; data: Client }, Client>({
      query: (body) => ({
        url: "/admin/client/",
        method: "PUT",
        body,
      }),
    }),

    getClientByid: builder.query<{ status: number; data: Client }, string>({
      query: (id) => ({
        url: `/admin/client/${id}`,
      }),
    }),

    deleteClient: builder.query<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/client/${id}`,
        method: "DELETE",
      }),
    }),
    // Projects
    findandFilterProjects: builder.mutation<
      { status: number; data: { results: Project[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/project/findandfilter",
        method: "POST",
        body,
      }),
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
    }),
    updateProject: builder.mutation<{ status: number; data: Project }, Project>(
      {
        query: (body) => ({
          url: `/admin/project/${body._id}`,
          method: "PUT",
          body,
        }),
      }
    ),

    getProjectByid: builder.query<{ status: number; data: Project }, string>({
      query: (id) => ({
        url: `/admin/project/${id}`,
      }),
    }),

    deleteProject: builder.query<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/project/${id}`,
        method: "DELETE",
      }),
    }),

    // TASKS
    findandFilterTasks: builder.mutation<
      { status: number; data: { results: Task[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/task/findandfilter",
        method: "POST",
        body,
      }),
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
    }),
    updateTask: builder.mutation<{ status: number; data: Task }, Task>({
      query: (body) => ({
        url: `/admin/task/${body._id}`,
        method: "PUT",
        body,
      }),
    }),

    getTaskByid: builder.query<{ status: number; data: Task }, string>({
      query: (id) => ({
        url: `/admin/task/${id}`,
      }),
    }),

    deletetask: builder.query<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/task/${id}`,
        method: "DELETE",
      }),
    }),

    // TAGS
    findandFilterTags: builder.mutation<
      { status: number; data: { results: Tag[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/tags/findandfilter",
        method: "POST",
        body,
      }),
    }),

    addTags: builder.mutation<
      { status: number; data: { message: string } },
      { user_id: string; title: string }
    >({
      query: (body) => ({
        url: "/admin/tags/",
        method: "POST",
        body,
      }),
    }),
    updateTags: builder.mutation<{ status: number; data: Tag }, Tag>({
      query: (body) => ({
        url: `/admin/tags/${body._id}`,
        method: "PUT",
        body,
      }),
    }),

    getTagsByid: builder.query<{ status: number; data: Tag }, string>({
      query: (id) => ({
        url: `/admin/tags/${id}`,
      }),
    }),

    deletetags: builder.query<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/tags/${id}`,
        method: "DELETE",
      }),
    }),

    // Client status | PIPELINE STAGES
    // TAGS
    findandFilterClientStatus: builder.mutation<
      { status: number; data: { results: Tag[] } & Pagination },
      findandfileter
    >({
      query: (body) => ({
        url: "/admin/client-status/findandfilter",
        method: "POST",
        body,
      }),
    }),

    addClientStatus: builder.mutation<
      { status: number; data: { message: string } },
      { user_id: string; title: string }
    >({
      query: (body) => ({
        url: "/admin/client-status/",
        method: "POST",
        body,
      }),
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
    }),

    deleteClientStatus: builder.query<
      { status: number; data: { message: string } },
      string
    >({
      query: (id) => ({
        url: `/admin/client-status/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetClientByidQuery,
  useAddClientMutation,
  useFindandFilterClientsMutation,
  useUpdateClientMutation,
  useDeleteClientQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useFindandFilterProjectsMutation,
  useGetProjectByidQuery,
  useDeleteProjectQuery,
  useAddTaskMutation,
  useDeletetaskQuery,
  useGetTaskByidQuery,
  useFindandFilterTasksMutation,
  useUpdateTaskMutation,
  useGetTagsByidQuery,
  useUpdateTagsMutation,
  useDeletetagsQuery,
  useAddTagsMutation,
  useFindandFilterTagsMutation,
  useFindandFilterClientStatusMutation,
  useDeleteClientStatusQuery,
  useAddClientStatusMutation,
  useUpdateClientStatusMutation
} = crmApi;
