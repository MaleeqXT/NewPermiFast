import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';

export const fetchSubCompetences = createAsyncThunk(
    'subCompetences/fetch',
    async ({ groupId, page = 1, search = '', status = '' }, { rejectWithValue }) => {
        try {
            const response = await http.get(`admin/competences/sub/${groupId}`, {
                params: { page, search, status }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addSubCompetence = createAsyncThunk(
    'subCompetences/add',
    async ({ groupId, formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`admin/competences/sub/${groupId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

            export const updateSubCompetence = createAsyncThunk(
            'subCompetences/update',
            async ({ id, formData }, { rejectWithValue }) => {
                try {
                    const response = await http.put(`admin/competences/sub/${id}/`, formData);
                    return response.data;
                } catch (error) {
                    return rejectWithValue(error.response.data);
                }
            }
        );


export const deleteSubCompetence = createAsyncThunk(
    'subCompetences/delete',
    async (id, { rejectWithValue }) => {
        try {
            await http.delete(`admin/competences/sub/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



const subCompetencesSlice = createSlice({
    name: 'subCompetences',
    initialState: {
        list: [],
        group: null,
        activeCount: 0,
        archiveCount: 0,
        allCount: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCompetences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCompetences.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.subCompetencies.map(s => ({
                    ...s,
                    status: s.status ? "active" : "inactive",
                }));
                state.group        = action.payload.group;
                state.activeCount  = action.payload.activeCount  ?? 0;
                state.archiveCount = action.payload.archiveCount ?? 0;
                state.allCount     = action.payload.allCount     ?? 0;
            })
            .addCase(fetchSubCompetences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addSubCompetence.fulfilled, (state, action) => {
                    state.loading = false;
                })
                .addCase(addSubCompetence.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                .addCase(updateSubCompetence.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateSubCompetence.rejected, (state, action) => {
                state.error = action.payload;
            })

             .addCase(deleteSubCompetence.fulfilled, (state, action) => {
                            state.list = state.list.filter(s => s.id !== action.payload);
                        })
            .addCase(deleteSubCompetence.rejected, (state, action) => {
                            state.error = action.payload;
                        })

    }
});

export default subCompetencesSlice.reducer;

// Selectors
export const selectSubCompetenceList     = (state) => state.subCompetences.list;
export const selectSubCompetenceLoading  = (state) => state.subCompetences.loading;
export const selectSubCompetenceAllCount    = (state) => state.subCompetences.allCount;
export const selectSubCompetenceActiveCount = (state) => state.subCompetences.activeCount;
export const selectSubCompetenceArchiveCount = (state) => state.subCompetences.archiveCount;