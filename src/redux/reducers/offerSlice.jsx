import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import http from '../../helpers/http';



export const fetchOffers = createAsyncThunk(
    'offers/fetchOffers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await http.get('/admin/offers', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data ?? {
                message: error.message ?? 'Unable to fetch offers.',
            });
        }
    }
);

// fetchOfferById 
export const fetchOfferById = createAsyncThunk(
    'offers/fetchById',
    async (id, { rejectWithValue }) => {
        try {
     
            const response = await http.get(`/admin/offers/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const addOffer = createAsyncThunk(
    'offers/add',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`admin/offers`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateOffer = createAsyncThunk(
    'offer/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            // PHP does not reliably populate multipart fields for a real PUT
            // request. Send POST with Laravel's method override instead.
            formData.set('_method', 'PUT');
            const response = await http.post(`/admin/offers/${id}`, formData);
            return response.data; // { success, message, data: {...} }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteOffer = createAsyncThunk(
    'offers/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.delete(`/admin/offers/${id}`);
            return { id, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data ?? {
                message: error.message ?? 'Unable to delete offer.',
            });
        }
    }
);

export const updateStudentBalance = createAsyncThunk(
    'offers/updateStudentBalance',
    async ({ studentId, offer_id, balance, status }, { rejectWithValue }) => {
        try {
            const response = await http.post(`/admin/balances/student/${studentId}`, {
                offer_id,
                balance,
                status, // "inc" ya "dec"
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const getStudentselectedOffers = createAsyncThunk(
    'offers/getStudentselectedOffers',
    async ({studentId}, { rejectWithValue }) => {
        try {
            const response = await http.get(`/admin/balances/student/${studentId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)






const addOfferSlice = createSlice({
    name: 'addOffer',
    initialState: {
        list: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15,
        activeCount: 0,
        archiveCount: 0,
        allCount: 0,
        cpfCount: 0,
        cart_count: 0,
        currentOffer: null, // single offer ke liye
        loading: false,
        error: null,
        currentRequestId: null,
        selectedOffers: [],
        selectedOffersLoading: false,
        deleting: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload);
            })
            .addCase(addOffer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //fetch offers
                .addCase(fetchOffers.pending, (state, action) => {
                    state.loading = true;
                    state.error = null;
                    state.currentRequestId = action.meta.requestId;
                    state.list = [];
                })
                       .addCase(fetchOffers.fulfilled, (state, action) => {
                    if (state.currentRequestId !== action.meta.requestId) return;
                    state.loading = false;
                    state.currentRequestId = null;
                    const paginator = action.payload.offers; // ← 'data' nahi 'offers' hai JSON mein!
                    state.list        = Array.from(
                        new Map((paginator?.data ?? []).map((offer) => [offer.id, offer])).values()
                    );
                    state.currentPage = paginator?.current_page ?? 1;
                    state.lastPage    = paginator?.last_page ?? 1;
                    state.total       = paginator?.total ?? 0;
                    state.perPage     = paginator?.per_page ?? 15;
                    state.activeCount  = action.payload.active_count ?? 0;
                    state.allCount     = action.payload.count_all ?? state.total;
                    state.cpfCount     = action.payload.cpf_count ?? 0;
                    state.cart_count   = action.payload.cart_count ?? 0;
                    state.archiveCount = action.payload.archived_count ?? 0;
                })
                 .addCase(fetchOffers.rejected, (state, action) => {
                    if (state.currentRequestId !== action.meta.requestId) return;
                    state.loading = false;
                    state.currentRequestId = null;
                    if (!action.meta.aborted) {
                        state.error = action.payload;
                    }
                })
            

              .addCase(fetchOfferById.pending, (state) => {
                    state.loading = true;
                    state.currentOffer = null;
                })
                .addCase(fetchOfferById.fulfilled, (state, action) => {
                    state.loading = false;
                    state.currentOffer = action.payload; // single offer yahan store hoga
                })
                .addCase(fetchOfferById.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                //update.
                 .addCase(updateOffer.pending, (state) => {
                        state.loading = true;
                        })
                        .addCase(updateOffer.fulfilled, (state, action) => {
                        state.loading = false;
                        // list update nahi — bas currentOffer update karo
                        state.currentOffer = action.payload.data;
                        })
                .addCase(updateOffer.rejected, (state) => {
                        state.loading = false;
                        })

                .addCase(deleteOffer.pending, (state) => {
                    state.deleting = true;
                    state.error = null;
                })
                .addCase(deleteOffer.fulfilled, (state, action) => {
                    state.deleting = false;
                    state.list = state.list.filter((offer) => offer.id !== action.payload.id);
                })
                .addCase(deleteOffer.rejected, (state, action) => {
                    state.deleting = false;
                    state.error = action.payload;
                })


                //balance add
                .addCase(updateStudentBalance.pending, (state) => {
                    state.balanceLoading = true;
                })
                .addCase(updateStudentBalance.fulfilled, (state, action) => {
                    state.balanceLoading = false;
                    // agar backend updated balance wapis bhejta hai to yahan reflect kar sakte ho
                })
                .addCase(updateStudentBalance.rejected, (state, action) => {
                    state.balanceLoading = false;
                    state.error = action.payload;
                })

                
                // Get Student Selected Offers
            .addCase(getStudentselectedOffers.pending, (state) => {
                state.selectedOffersLoading = true;
                state.error = null;
                state.selectedOffers = [];
            })

            .addCase(getStudentselectedOffers.fulfilled, (state, action) => {
                state.selectedOffersLoading = false;

                state.selectedOffers = action.payload.data ?? [];

                // Pagination
                state.currentPage = action.payload.current_page;
                state.lastPage = action.payload.last_page;
                state.total = action.payload.total;
                state.perPage = action.payload.per_page;
            })

            .addCase(getStudentselectedOffers.rejected, (state, action) => {
                state.selectedOffersLoading = false;
                state.error = action.payload;
                state.selectedOffers = [];
            })





    }
});

export default addOfferSlice.reducer;
