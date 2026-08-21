import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../helpers/http";

export const fetchBaskets = createAsyncThunk(
  "baskets/fetchBaskets",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await http.get("/admin/carts", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? {
        message: error.message ?? "Impossible de charger les paniers.",
      });
    }
  },
);

export const fetchBasketById = createAsyncThunk(
  "baskets/fetchBasketById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.get(`/admin/carts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? {
        message: error.message ?? "Impossible de charger le panier.",
      });
    }
  },
);

const basketsSlice = createSlice({
  name: "baskets",
  initialState: {
    list: [],
    counts: {},
    currentPage: 1,
    lastPage: 1,
    total: 0,
    currentBasket: null,
    detailLoading: false,
    loading: false,
    error: null,
    requestId: null,
  },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchBaskets.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.requestId = action.meta.requestId;
    })
    .addCase(fetchBaskets.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      const carts = action.payload.carts ?? {};
      state.loading = false;
      state.requestId = null;
      state.list = Array.isArray(carts) ? carts : (carts.data ?? []);
      state.currentPage = carts.current_page ?? 1;
      state.lastPage = carts.last_page ?? 1;
      state.total = carts.total ?? state.list.length;
      state.counts = action.payload.counts ?? {};
    })
    .addCase(fetchBaskets.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.loading = false;
      state.requestId = null;
      state.error = action.payload;
    })
    .addCase(fetchBasketById.pending, (state) => {
      state.detailLoading = true;
      state.error = null;
      state.currentBasket = null;
    })
    .addCase(fetchBasketById.fulfilled, (state, action) => {
      state.detailLoading = false;
      state.currentBasket = action.payload.cart ?? null;
    })
    .addCase(fetchBasketById.rejected, (state, action) => {
      state.detailLoading = false;
      state.error = action.payload;
    }),
});

export default basketsSlice.reducer;
