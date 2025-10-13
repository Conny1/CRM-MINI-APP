import { configureStore } from "@reduxjs/toolkit";
import { crmApi } from "./crm";
import { setupListeners } from "@reduxjs/toolkit/query";
import tokenReducer from "./token";

export const store = configureStore({
  reducer: {
    token: tokenReducer,

    [crmApi.reducerPath]: crmApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crmApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
