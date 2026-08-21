import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';

export const fetchAdmins = createAsyncThunk(
    'admins/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            // params = { page: 1, search: '', status: '' } jaisa kuch
            const response = await http.get('/admin/users/admins', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addAdmin = createAsyncThunk(
    'admins/add',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await http.post('/admin/users/admins', formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAdmin = createAsyncThunk(
    'admins/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await http.put(`/admin/users/admins/${id}`, formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const archiveAdmin = createAsyncThunk(
    'admins/archive',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.delete(`/admin/users/admins/${id}`);
            return { id, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const changeAdminStatus = createAsyncThunk(
    'admins/changeStatus',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.get(`/admin/users/admins/status/${id}`);
            return response.data.data; // updated user object
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);




const adminsSlice = createSlice({
    name: 'admins',
    initialState: {
        list: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmins.fulfilled, (state, action) => {
                state.loading = false;
                // Laravel paginate() ka response: action.payload.data is the paginator object
                const paginator = action.payload.data;
                state.list = paginator.data;
                state.currentPage = paginator.current_page;
                state.lastPage = paginator.last_page;
                state.total = paginator.total;
                state.perPage = paginator.per_page;
            })
            .addCase(fetchAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAdmin.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateAdmin.fulfilled, (state, action) => {
                const idx = state.list.findIndex(a => a.id === action.payload.id);
                if (idx !== -1) state.list[idx] = action.payload;
            })
            .addCase(archiveAdmin.fulfilled, (state, action) => {
                const idx = state.list.findIndex(a => a.id === action.payload.id);
                if (idx !== -1) state.list[idx].status = 'archived';
            })

            // active unactive
            .addCase(changeAdminStatus.fulfilled, (state, action) => {
                const idx = state.list.findIndex(a => a.id === action.payload.id);
                if (idx !== -1) {
                    state.list[idx].status = action.payload.status;
                }
            })
    },
});

export default adminsSlice.reducer;