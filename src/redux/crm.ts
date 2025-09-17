import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { addClient, Client, findandfileter, Pagination } from "../types";

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
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
  }),
});
