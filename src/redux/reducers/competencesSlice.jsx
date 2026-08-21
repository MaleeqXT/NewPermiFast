import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';


export const fetchCompetence = createAsyncThunk(
    'admins/fetchCompetence',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { page = 1, search = '', status = '' } = params;
            const response = await http.get('admin/competences/group', {
                params: { page, search, status }  // ✅ query params bhejo
            }); 
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const addCompetence = createAsyncThunk(
    'competences/add',
    async (formData, { rejectWithValue }) => {
        try { 
            // const response = await http.post('/admin/users/secretaries', formData);
            const response = await http.post('admin/competences/group/', formData, {
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
export const updateCompetence = createAsyncThunk(
    'competences/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await http.put(`admin/competences/group/${id}/`, formData); // 👈 slash add kiya
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const deleteCompetence = createAsyncThunk(
    'competences/delete',
    async (id, { rejectWithValue }) => {
        try {
            await http.delete(`admin/competences/group/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const competencesSlice = createSlice({
    name: 'competences',
     initialState: {
        list: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 15,
         activeCount: 0,   // ✅ add karo
            archiveCount: 0,   //add
            allCount:0,
        loading: false,
        error: null,
            selected: null,        // ✅ add karo
    selectedLoading: false,
    },
      reducers: {
        clearSelectedCompetence: (state) => {
            state.selected = null;
        },
      },
        extraReducers: (builder) => {
            builder
                .addCase(fetchCompetence.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchCompetence.fulfilled, (state, action) => {
                   state.loading = false;
                        state.list = action.payload.groups.map(g => ({
                            ...g,
                            status: g.status ? "active" : "inactive",
                        }));
                        // ✅ camelCase — backend ka actual response
                        state.activeCount  = action.payload.activeCount  ?? 0;
                        state.archiveCount = action.payload.archiveCount ?? 0;
                        state.allCount     = action.payload.allCount     ?? action.payload.groups.length;

                        state.currentPage = action.payload.current_page ?? 1;
                        state.lastPage    = action.payload.last_page    ?? 1;
                        state.total       = action.payload.total        ?? action.payload.groups.length;
                })
                
                .addCase(fetchCompetence.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                  //add Com
                .addCase(addCompetence.fulfilled, (state, action) => {
                     state.list.unshift({
                        ...action.payload,
                        status: action.payload.status ? "active" : "inactive",
                    });
                    
                })

                 
            // update cases
            .addCase(updateCompetence.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                // state.list = action.payload.groups.map(g => ({
                //     ...g,
                //     status: g.status ? "active" : "inactive",
                // }));
            })

            .addCase(updateCompetence.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(deleteCompetence.fulfilled, (state, action) => {
                state.list = state.list.filter(s => s.id !== action.payload);
            })
            .addCase(deleteCompetence.rejected, (state, action) => {
                state.error = action.payload;
            })

        }

    });


    export const { clearSelectedCompetence } = competencesSlice.actions;
    
    export default competencesSlice.reducer;
    
    // ---- Selectors ----
    export const selectCompetenceList    = (state) => state.competences.list;
export const selectCompetenceLoading = (state) => state.competences.loading;

export const selectCompetenceAllCount  = (state) => state.competences.allCount;
export const selectCompetenceActiveCount   = (state) => state.competences.activeCount;
export const selectCompetenceArchiveCount  = (state) => state.competences.archiveCount;


    export const selectSelectedCompetence = (state) => state.competences.selected;
    export const selectSelectedCompetenceLoading = (state) => state.competences.selectedLoading;

