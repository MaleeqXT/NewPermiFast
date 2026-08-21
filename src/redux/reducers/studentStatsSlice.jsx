import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http";

export const fetchStudentStats = createAsyncThunk(
  "studentStats/fetchStudentStats",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await http.get(`/stats/students/${studentId}`);
      return {
        studentId,
        payload: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unable to load student stats" });
    }
  }
);

const studentStatsSlice = createSlice({
  name: "studentStats",
  initialState: {
    entities: {},
    loadingById: {},
    errorById: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentStats.pending, (state, action) => {
        const studentId = action.meta.arg;
        state.loadingById[studentId] = true;
        state.errorById[studentId] = null;
      })
      .addCase(fetchStudentStats.fulfilled, (state, action) => {
        const { studentId, payload } = action.payload;
        state.loadingById[studentId] = false;
        state.entities[studentId] = payload?.data ?? payload ?? {};
      })
      .addCase(fetchStudentStats.rejected, (state, action) => {
        const studentId = action.meta.arg;
        state.loadingById[studentId] = false;
        state.errorById[studentId] = action.payload;
      });
  },
});

export default studentStatsSlice.reducer;

export const selectStudentStatsById = (state, studentId) => state.studentStats?.entities?.[studentId] ?? null;
export const selectStudentStatsLoadingById = (state, studentId) => Boolean(state.studentStats?.loadingById?.[studentId]);
export const selectStudentStatsErrorById = (state, studentId) => state.studentStats?.errorById?.[studentId] ?? null;
