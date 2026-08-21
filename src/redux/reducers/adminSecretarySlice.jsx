import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';


export const fetchSecretaries = createAsyncThunk(
    'admins/fetchSecretaries',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { page = 1, search = '', status = '', zone_id } = params;
            const response = await http.get(`/admin/users/secretaries/index?zone_id=${encodeURIComponent(zone_id ?? '')}`, {
                params: { page, search, status }  // ✅ query params bhejo
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addSecretaries = createAsyncThunk(
    'secretaries/add',
    async (formData, { rejectWithValue }) => {
        try { 
            // const response = await http.post('/admin/users/secretaries', formData);
            const response = await http.post('/admin/users/secretaries', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // ✅ yeh add karo
                }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//get single user///
export const fetchSecretaryById = createAsyncThunk(
    'secretaries/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.get(`/admin/users/secretaries/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateSecretary = createAsyncThunk(
    'secretaries/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`/admin/users/secretaries/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const adminSecretarySlice = createSlice({
    name: 'secretaries',
     initialState: {
        list: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15,
         activeCount: 0,   // ✅ add karo
            archiveCount: 0,   //add
        loading: false,
        error: null,

        //get single user
            selected: null,        // ✅ add karo
    selectedLoading: false,
    },
      reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(fetchSecretaries.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchSecretaries.fulfilled, (state, action) => {
                    console.log(action.payload);
                    state.loading = false;
                    // Laravel paginate() ka response: action.payload.data is the paginator object
                    // const paginator = action.payload.data;
                    // state.list = paginator.data;
                    // state.currentPage = paginator.current_page;
                    // state.lastPage = paginator.last_page;
                    // state.total = paginator.total;
                    // state.perPage = paginator.per_page;
                        const paginator = action.payload.data;
                        state.list        = paginator.data; // yeh array hai secretaries ka
                        state.currentPage = paginator.current_page;
                        state.lastPage    = paginator.last_page;
                        state.total       = paginator.total;
                        state.perPage     = paginator.per_page;
                            state.activeCount  = action.payload.active_count;   // ✅ backend se aayega
                        state.archiveCount = action.payload.archive_count;
                })
                .addCase(fetchSecretaries.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(addSecretaries.fulfilled, (state, action) => {
                         state.list.unshift(action.payload);
                })

                //single user reducers
                .addCase(fetchSecretaryById.pending, (state) => {
                    state.selectedLoading = true;
                    state.selected = null;
                })
                .addCase(fetchSecretaryById.fulfilled, (state, action) => {
                    state.selectedLoading = false;
                    state.selected = action.payload;
                })
                .addCase(fetchSecretaryById.rejected, (state) => {
                    state.selectedLoading = false;
                })
                .addCase(updateSecretary.pending, (state) => {
                    state.selectedLoading = true;
                })
                .addCase(updateSecretary.fulfilled, (state, action) => {
                    state.selectedLoading = false;
                        state.selected = {
                        ...action.payload.secretary,
                        user: action.payload.user,
                    };
                    // state.selected = action.payload;  // updated data store karo
                })
                .addCase(updateSecretary.rejected, (state) => {
                    state.selectedLoading = false;
                })

            }


});

export default adminSecretarySlice.reducer;
