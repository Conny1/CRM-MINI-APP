import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  addClient,
  Client,
  findandfileter,
  Notes,
  Pagination,
  Stage,
  Tag,
  } from "../types";
import { baseQueryWithReauth } from "./customBaseQuery";

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: baseQueryWithReauth,
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
      { title: string; content: string; client_id: string }
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
  useGetClientNamesQuery,
  useClientPipelineDataQuery,
  useAddNotesMutation,
  useUpdateNotesMutation,
  useDeleteNotesMutation,
  useFindandFilterNotesQuery,
} = crmApi;
