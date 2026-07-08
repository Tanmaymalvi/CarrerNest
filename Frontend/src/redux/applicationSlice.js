import { createSlice } from "@reduxjs/toolkit";
import { applications } from "../data/mockData";

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    items: applications,
  },
  reducers: {
    withdrawApplication: (state, action) => {
      state.items = state.items.map((application) =>
        application.id === action.payload
          ? { ...application, status: "Withdrawn" }
          : application,
      );
    },
  },
});

export const { withdrawApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
