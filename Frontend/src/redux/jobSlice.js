import { createSlice } from "@reduxjs/toolkit";
import { jobs } from "../data/mockData";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    items: jobs,
    saved: ["job-1", "job-3"],
  },
  reducers: {
    toggleSavedJob: (state, action) => {
      state.saved = state.saved.includes(action.payload)
        ? state.saved.filter((id) => id !== action.payload)
        : [...state.saved, action.payload];
    },
  },
});

export const { toggleSavedJob } = jobSlice.actions;
export default jobSlice.reducer;
