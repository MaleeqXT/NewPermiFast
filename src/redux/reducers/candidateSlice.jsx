import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';

//fetch
export const fetchStudents = createAsyncThunk(
    'admins/fetchStudents',
    async (params = {}, { rejectWithValue }) => {
        try {
            let { page = 1, search = '', status } = params;
            search = search.trim() || undefined;
            const response = await http.get('/admin/users/students', {
                params: { page, search, status }  // ✅ query params bhejo
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCpfStudents = createAsyncThunk(
    'candidates/fetchCpfStudents',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await http.get('/admin/users/students/cpf-form', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: 'Impossible de charger les élèves CPF.' });
        }
    }
);

export const fetchMonitorStudents = createAsyncThunk(
    'candidates/fetchMonitorStudents',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { page = 1, search = '', status = 1 } = params;
            const response = await http.get('/monitor/students', {
                params: { page, search, status },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: 'Unable to fetch monitor students' });
        }
    }
);

//get by id

export const fetchCandidateById = createAsyncThunk(
    'candidates/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.get(`/admin/users/students/${id}/edit`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


//add
export const addCandidate = createAsyncThunk(
    'candidate/add',
    async (formData, { rejectWithValue }) => {
        try { 
            // const response = await http.post('/admin/users/secretaries', formData);
            const response = await http.post('/admin/users/students', formData, {
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

//update

export const updateCandidate = createAsyncThunk(
    'candidate/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`/admin/users/students/${id}`, formData);
            return response.data; // { success, message, data: {...} }
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: 'Unable to update candidate.' });
        }
    }
);

export const updateCandidateStatus = createAsyncThunk(
    'candidates/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            await http.put(`/admin/users/${id}`, { status });
            return { id, status };
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: error.message });
        }
    }
);

const candidateSlice = createSlice({
    name: 'candidates',
    initialState: {
        list: [],
        monitorList: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15,
         activeCount: 0,   // ✅ add karo
            archiveCount: 0,   //add
            newCount:0,
        loading: false,
        monitorLoading: false,
        error: null,
        monitorError: null,
        cpfList: [],
        cpfLoading: false,
        cpfError: null,

        //get single user
            selected: null,        // ✅ add karo
    selectedLoading: false,
    
    },
      reducers: {
          clearSelectedCandidate: (state) => {
            state.selected = null;
        },
      },


      extraReducers: (builder) => {
            builder
                //add candidate
              .addCase(addCandidate.fulfilled, (state, action) => {
                    state.list.unshift(action.payload);
                 })

                .addCase(fetchCpfStudents.pending, (state) => {
                    state.cpfLoading = true;
                    state.cpfError = null;
                })
                .addCase(fetchCpfStudents.fulfilled, (state, action) => {
                    state.cpfLoading = false;
                    state.cpfList = action.payload?.data ?? [];
                })
                .addCase(fetchCpfStudents.rejected, (state, action) => {
                    state.cpfLoading = false;
                    state.cpfError = action.payload?.message ?? 'Impossible de charger les élèves CPF.';
                    state.cpfList = [];
                })

                 //fetch Students.
                       .addCase(fetchStudents.pending, (state) => {
                                     state.loading = true;
                                     state.error = null;
                                 })
                                 .addCase(fetchStudents.fulfilled, (state, action) => {
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
                                         state.newCount=action.payload.new_count;
                 
                                 })
                .addCase(fetchStudents.rejected, (state, action) => {
                                     state.loading = false;
                                     state.error = action.payload;
                                 })

                                // monitor candidates
                                .addCase(fetchMonitorStudents.pending, (state) => {
                                    state.monitorLoading = true;
                                    state.monitorError = null;
                                })
                                .addCase(fetchMonitorStudents.fulfilled, (state, action) => {
                                    state.monitorLoading = false;
                                    const paginator = action.payload.data ?? action.payload.students ?? action.payload;
                                    state.monitorList = paginator.data ?? paginator ?? [];
                                    state.currentPage = paginator.current_page ?? 1;
                                    state.lastPage = paginator.last_page ?? 1;
                                    state.total = paginator.total ?? state.monitorList.length;
                                    state.perPage = paginator.per_page ?? state.perPage;
                                })
                                .addCase(fetchMonitorStudents.rejected, (state, action) => {
                                    state.monitorLoading = false;
                                    state.monitorError = action.payload;
                                })

                                 //geting Id
                                //get monitor by id (edit ke liye)
                            .addCase(fetchCandidateById.pending, (state) => {
                                state.selectedLoading = true;
                                state.error = null;
                            })
                            .addCase(fetchCandidateById.fulfilled, (state, action) => {
                                state.selectedLoading = false;
                                // backend response shape: { monitor: {...} }
                                state.selected = action.payload.user;
                            })
                            .addCase(fetchCandidateById.rejected, (state, action) => {
                                state.selectedLoading = false;
                                state.error = action.payload;
                            })
                    

                            //update
                                .addCase(updateCandidate.pending, (state) => {
                                        state.selectedLoading = true;
                                        })
                                        .addCase(updateCandidate.fulfilled, (state, action) => {
                                        state.selectedLoading = false;
                                        state.selected = action.payload.data;
                                        })
                                        .addCase(updateCandidate.rejected, (state) => {
                                        state.selectedLoading = false;
                                        })
                                .addCase(updateCandidateStatus.fulfilled, (state, action) => {
                                    state.list = state.list.map((student) =>
                                        student.id === action.payload.id
                                            ? { ...student, status: action.payload.status }
                                            : student
                                    );
                                })
                                .addCase(updateCandidateStatus.rejected, (state, action) => {
                                    state.error = action.payload;
                                })




      }
});

export const {clearSelectedCandidate}=candidateSlice.actions;

export default candidateSlice.reducer;

export const selectSelectedCandidate= (state) =>state.candidates.selected;
export const selectSelectedCandidateLoading= (state) =>state.candidates.selectedLoading;
