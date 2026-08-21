import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await http.get("/admin/commandes", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data ?? { message: error.message ?? "Impossible de charger les commandes." });
  }
});

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (id, { rejectWithValue }) => {
  try {
    const response = await http.get(`/admin/commandes/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data ?? { message: error.message ?? "Impossible de charger la commande." });
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], stats: {}, statsComparison: {}, counts: {}, currentPage: 1, lastPage: 1, total: 0, perPage: 15, loading: false, error: null, requestId: null, currentOrder: null, detailLoading: false },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchOrders.pending, (state, action) => {
      state.loading = true; state.error = null; state.requestId = action.meta.requestId;
    })
    .addCase(fetchOrders.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      const sales = action.payload.sales ?? {};
      state.loading = false; state.requestId = null;
      state.list = Array.isArray(sales) ? sales : (sales.data ?? []);
      state.currentPage = sales.current_page ?? 1; state.lastPage = sales.last_page ?? 1;
      state.total = sales.total ?? state.list.length;
      state.perPage = sales.per_page ?? 15;
      state.stats = action.payload.stats?.current ?? {};
      state.statsComparison = action.payload.stats?.comparison ?? {};
      state.counts = action.payload.counts ?? {};
    })
    .addCase(fetchOrders.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.loading = false; state.requestId = null; state.error = action.payload;
    })
    .addCase(fetchOrderById.pending, (state) => {
      state.detailLoading = true; state.error = null; state.currentOrder = null;
    })
    .addCase(fetchOrderById.fulfilled, (state, action) => {
      state.detailLoading = false; state.currentOrder = action.payload.sale ?? null;
    })
    .addCase(fetchOrderById.rejected, (state, action) => {
      state.detailLoading = false; state.error = action.payload;
    }),
});

export default ordersSlice.reducer;
