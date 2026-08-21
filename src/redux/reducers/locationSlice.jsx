import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../helpers/http';
import { createSelector } from '@reduxjs/toolkit';
import { archiveAdmin } from './adminsSlice';

// Saari zones fetch karta hai -> GET /api/admin/locations/area
export const fetchZones = createAsyncThunk(
  "locations/fetchZones",
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get("/admin/locations/area");
      // backend shape: { data: [ {id, name, status, created_at}, ... ] }
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Zones load nahi ho payi");
    }
  }
);

// Ek specific zone ke places fetch karta hai -> GET /api/admin/locations/{zone}/places
// NOTE: backend yeh paginated (Laravel paginate()) response deta hai:
// { current_page, data: [...], last_page, total, ... }
// isliye humein res.data.data lena hai, res.data poora object nahi
export const fetchPlacesByZone = createAsyncThunk(
  "locations/fetchPlacesByZone",
  async (zoneId, { rejectWithValue }) => {
    try {
      const res = await http.get(`/admin/locations/${zoneId}/places`);
      return { zoneId, places: res.data.data || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Places load nahi ho paye");
    }
  }
);

export const storeMonitorPlaces = createAsyncThunk(
  "locations/storeMonitorPlaces",
  async ({ lieux }, { rejectWithValue }) => {
    try {
      const response = await http.post("/monitor/places", {
        lieux,
      });

      return response.data ?? { success: true, lieux };
    } catch (err) {
      const status = err.response?.status;
      if (status === 302) {
        return { success: true, lieux, status };
      }
      return rejectWithValue(err.response?.data?.message || "Places store nahi ho paye");
    }
  }
);


export const addPlacesByZone = createAsyncThunk(
    'addPlacesByZone/add',
    async ({ zoneId, formData }, { rejectWithValue }) => {
        try {
            const response = await http.post(`admin/places/${zoneId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchPlacesById = createAsyncThunk(
    'fetchPlacesById/fetch',
    async ({ zoneId, page = 1, search = '', status = '' }, { rejectWithValue }) => {
        try {
            const response = await http.get(`admin/places/${zoneId}`, {
                params: { page, search, status }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



                export const updatePlaceById = createAsyncThunk(
            'places/update',
            async ({ placeId, formData }, { rejectWithValue }) => {
                try {
                    const response = await http.put(`admin/places/${placeId}/`, formData);
                    return response.data;
                } catch (error) {
                    return rejectWithValue(error.response.data);
                }
            }
        );


        export const deletePlaceById = createAsyncThunk(
    'places/delete',
    async (id, { rejectWithValue }) => {
        try {
            await http.delete(`admin/places/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



const initialState = {
  zones: [],
  zonesStatus: "idle", // idle | loading | succeeded | failed
  zonesError: null,

  // placesByZone: { [zoneId]: { items: [...], status, error } }
  placesByZone: {},
  activeCount: 0,
  archiveCount:0,
  allCount:0,
  loading: false,
  error: null,
    list: [],
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 15,
  zone: null,

  // user ke selected (zone + place) pairs, MonitorForm ke "locations" array jaisa
  selectedLocations: [],
};

const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    addSelectedLocation: (state, action) => {
      // action.payload: { zoneId, zoneName, place }
      const { zoneId, place } = action.payload;
      const exists = state.selectedLocations.some(
        (item) => String(item.zoneId) === String(zoneId) && item.place === place
      );
      if (!exists) {
        state.selectedLocations.push({
          id: Date.now() + Math.random(),
          ...action.payload,
        });
      }
    },
    removeSelectedLocation: (state, action) => {
      // action.payload: id
      state.selectedLocations = state.selectedLocations.filter(
        (item) => item.id !== action.payload
      );
    },
    clearSelectedLocations: (state) => {
      state.selectedLocations = [];
    },
    setSelectedLocationsBulk: (state, action) => {
  // action.payload: array of { zoneId, zoneName, placeId, place }
  // edit mode mein monitor ki existing locations ek saath load karne ke liye
  state.selectedLocations = (action.payload || []).map((item) => ({
    id: Date.now() + Math.random(),
    ...item,
  }));
},


    resetLocationsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // zones
      .addCase(fetchZones.pending, (state) => {
        state.zonesStatus = "loading";
        state.zonesError = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zonesStatus = "succeeded";
        state.zones = action.payload || [];
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.zonesStatus = "failed";
        state.zonesError = action.payload;
      })

      // places per zone
      .addCase(fetchPlacesByZone.pending, (state, action) => {
        const zoneId = action.meta.arg;
        state.placesByZone[zoneId] = {
          items: state.placesByZone[zoneId]?.items || [],
          status: "loading",
          error: null,
        };
      })
      .addCase(fetchPlacesByZone.fulfilled, (state, action) => {
        const { zoneId, places } = action.payload;
        state.placesByZone[zoneId] = {
          items: places || [],
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchPlacesByZone.rejected, (state, action) => {
        const zoneId = action.meta.arg;
        state.placesByZone[zoneId] = {
          items: state.placesByZone[zoneId]?.items || [],
          status: "failed",
          error: action.payload,
        };
      })

         .addCase(addPlacesByZone.fulfilled, (state, action) => {
                          state.loading = false;
                      })
          .addCase(addPlacesByZone.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //fetching
             .addCase(fetchPlacesById.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(fetchPlacesById.fulfilled, (state, action) => {
                    state.loading = false;
                    const paginator = action.payload.lieux;
                    state.list        = paginator.data.map(p => ({
                        ...p,
                        status: p.status ? "active" : "inactive",
                        mapUrl: p.url,  // UI mein mapUrl expect karta hai
                    }));
                    state.currentPage  = paginator.current_page;
                    state.lastPage     = paginator.last_page;
                    state.total        = paginator.total;
                    state.perPage      = paginator.per_page;
                    state.activeCount  = action.payload.activeCount  ?? 0;
                    state.archiveCount = action.payload.archiveCount ?? 0;
                    state.allCount     = action.payload.allCount     ?? 0;
                    state.zone         = action.payload.zone;
                })
                
                    .addCase(fetchPlacesById.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                    })

                    .addCase(updatePlaceById.fulfilled, (state) => {
                                    state.loading = false;
                                })
                                .addCase(updatePlaceById.rejected, (state, action) => {
                                    state.error = action.payload;
                                })

                      //delete
                        .addCase(deletePlaceById.fulfilled, (state, action) => {
                                                  state.list = state.list.filter(s => s.id !== action.payload);
                                              })
                                  .addCase(deletePlaceById.rejected, (state, action) => {
                                                  state.error = action.payload;
                                              })



  },
});

export const {
  addSelectedLocation,
  setSelectedLocationsBulk,
  removeSelectedLocation,
  clearSelectedLocations,
  resetLocationsState,
} = locationSlice.actions;

export default locationSlice.reducer;

// ---- Selectors ----
export const selectZones = (state) => state.locations.zones;

export const selectZonesStatus = (state) => state.locations.zonesStatus;

export const selectPlacesForZone = (zoneId) => createSelector(
  (state) => state.locations.placesByZone[zoneId],
  (zone) => zone?.items || []
);

export const selectPlacesStatusForZone = (zoneId) => createSelector(
  (state) => state.locations.placesByZone[zoneId],
  (zone) => zone?.status || "idle"
);
// export const selectPlacesStatusForZone = (zoneId) => (state) =>
//   state.locations.placesByZone[zoneId]?.status || "idle";
export const selectSelectedLocations = (state) => state.locations.selectedLocations;

export const selectPlacesList    = (state) => state.locations.list;
export const selectPlacesLoading = (state) => state.locations.loading;
export const selectPlacesAllCount    = (state) => state.locations.allCount;
export const selectPlacesActiveCount = (state) => state.locations.activeCount;
export const selectPlacesArchiveCount = (state) => state.locations.archiveCount;
export const selectPlacesZone    = (state) => state.locations.zone; 
