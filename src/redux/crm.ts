import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  addClient,
  addProjectType,
  Client,
  findandfileter,
  Pagination,
  Project,
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
          url: "/admin/project/",
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
  }),
});

export const {
  useGetClientByidQuery,
  useAddClientMutation,
  useFindandFilterClientsMutation,
  useDeleteClientQuery,
  useAddProjectMutation,
  useFindandFilterProjectsMutation,
  useGetProjectByidQuery,
  useDeleteProjectQuery,
} = crmApi;
