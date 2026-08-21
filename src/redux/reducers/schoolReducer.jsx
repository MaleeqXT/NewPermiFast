import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import http from '../../helpers/http';


export const fetchSchools = createAsyncThunk(
    'schools/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await http.get('/admin/schools');
            return response.data;  // poora data return karo
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: 'Impossible de charger les auto-écoles.' });
        }
    }
);

export const addSchool = createAsyncThunk(
    'schools/add',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await http.post('/admin/schools', formData);
            return response.data.school;
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: "Impossible d'ajouter l'auto-école." });
        }
    }
);

//change school

export const selectSchool = createAsyncThunk(
    'schools/select',
    async (schoolId, { rejectWithValue }) => {
        try {
            const response = await http.post(`/admin/schools/select/${schoolId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data ?? { message: "Impossible de sélectionner l'auto-école." });
        }
    }
);



const schoolsSlice = createSlice({
    name: 'schools',
    initialState: {
        list: [],
        selected: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedSchool: (state, action) => {
            state.selected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchools.fulfilled, (state, action) => {
                // state.loading = false;
                // state.list = action.payload;
                    state.loading = false;
                    state.list    = action.payload?.schools ?? [];
                    //   if (action.payload.zone_id) {
                    //     state.selected = state.list.find(
                    //         s => s.id === action.payload.zone_id
                    //     );
                    // }

                      if (action.payload.selected_school_id) {
                        state.selected = state.list.find(
                            s => s.id === action.payload.selected_school_id
                        );
                    }
            })
            .addCase(fetchSchools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message ?? 'Impossible de charger les auto-écoles.';
            })
            .addCase(addSchool.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            .addCase(selectSchool.fulfilled, (state, action) => {
            // selected school update karo ; mean last reducer.
            state.selected = state.list.find(s => s.id === action.meta.arg);
             }); 
    },
});

export const { setSelectedSchool } = schoolsSlice.actions;
export default schoolsSlice.reducer;
