import { createSlice } from "@reduxjs/toolkit";
import { companies } from "../data/mockData";

const companySlice = createSlice({
  name: "companies",
  initialState: {
    items: companies,
  },
  reducers: {},
});

export default companySlice.reducer;
