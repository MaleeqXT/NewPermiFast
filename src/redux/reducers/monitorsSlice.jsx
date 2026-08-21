import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';


export const fetchMonitors = createAsyncThunk(
    'admins/fetchMonitors',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { page = 1, search = '', status = '', zone_id } = params;
            const response = await http.get('/admin/users/monitors', {
                params: { zone_id: zone_id ?? '', page, search, status }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const addMonitor = createAsyncThunk(
    'monitors/add',
    async (formData, { rejectWithValue }) => {
        try { 
            // const response = await http.post('/admin/users/secretaries', formData);
            const response = await http.post('/admin/users/monitors/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // ✅ yeh add karo
                }
            });
            return {
                ...response.data.data.user,
                monitor: response.data.data.monitor,
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//geting monitor for edit
export const fetchMonitorById = createAsyncThunk(
    'monitors/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            console.log('URL:', `/admin/users/monitors/${id}/edit`); 
            const response = await http.get(`/admin/users/monitors/${id}/edit`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//update

export const updateMonitor = createAsyncThunk(
    'monitor/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`/admin/users/monitors/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data; // { success, message, data: {...} }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// DELETE
export const deleteCompetence = createAsyncThunk(
    'competences/delete',
    async (id, { rejectWithValue }) => {
        try {
            await http.delete(`admin/competences/group/${id}`);
            return id; // id wapas bhejo taake list se remove kar sakein
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);





const monitorsSlice = createSlice({
    name: 'monitors',
     initialState: {
        list: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15,
         activeCount: 0,   // ✅ add karo
            archiveCount: 0,   //add
            inholdCount:0,
            allCount:0,
        loading: false,
        error: null,
            selected: null,        // ✅ add karo
    selectedLoading: false,
    },
      reducers: {
        clearSelectedMonitor: (state) => {
            state.selected = null;
        },
      },
        extraReducers: (builder) => {
            builder
                .addCase(fetchMonitors.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchMonitors.fulfilled, (state, action) => {
                    state.loading = false;
                        const paginator = action.payload.data;
                        state.list        = paginator.data; // yeh array hai secretaries ka
                        state.currentPage = paginator.current_page;
                        state.lastPage    = paginator.last_page;
                        state.total       = paginator.total;
                        state.perPage     = paginator.per_page;
                            state.activeCount  = action.payload.active_count;
                            state.allCount=action.payload.all_count,   // ✅ backend se aayega
                        state.archiveCount = action.payload.inactive_count;
                        state.inholdCount = action.payload.inhold_count;

                })
                .addCase(fetchMonitors.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                //add monitors
                   .addCase(addMonitor.fulfilled, (state, action) => {
                                         state.list.unshift(action.payload);
                  })

                //get monitor by id (edit ke liye)
                .addCase(fetchMonitorById.pending, (state) => {
                    state.selectedLoading = true;
                    state.error = null;
                })
                .addCase(fetchMonitorById.fulfilled, (state, action) => {
                    state.selectedLoading = false;
                    // backend response shape: { monitor: {...} }
                    state.selected = action.payload.monitor;
                })
                .addCase(fetchMonitorById.rejected, (state, action) => {
                    state.selectedLoading = false;
                    state.error = action.payload;
                })

                // update cases
                    .addCase(updateMonitor.fulfilled, (state, action) => {
                        const updated = action.payload.data;
                        state.selected = updated;
                        state.list = state.list.map((user) =>
                            user.id === updated.user_id
                                ? { ...user, ...updated.user, monitor: updated }
                                : user
                        );
                    })
                        // delete cases
                        .addCase(deleteCompetence.fulfilled, (state, action) => {
                            state.list = state.list.filter(s => s.id !== action.payload);
                        })
            }


});

export const { clearSelectedMonitor } = monitorsSlice.actions;

export default monitorsSlice.reducer;

// ---- Selectors ----
export const selectSelectedMonitor = (state) => state.monitors.selected;
export const selectSelectedMonitorLoading = (state) => state.monitors.selectedLoading;
