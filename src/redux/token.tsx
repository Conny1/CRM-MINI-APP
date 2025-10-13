import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: {
      _id: "",
      access_token: null,
      refresh_token:null
    },
  },
  reducers: {
    updateTokenData: (state, action) => {
      state.value = action.payload;
    },

    clearToken: (state) => {
      state.value = {
        access_token: null,
        refresh_token:null,
        _id: "",
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTokenData, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
