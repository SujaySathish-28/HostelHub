import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAdminProfile } from '../services/adminServices';

export const fetchAdminProfile = createAsyncThunk(
  'admin/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const data = await getAdminProfile();
      if (data?.message || data?.error) {
        return thunkAPI.rejectWithValue(data.message || data.error);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch admin profile');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    profile: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setAdminProfile: (state, action) => {
      state.profile = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearAdminProfile: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.profile = null;
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Unable to load admin profile';
      });
  },
});

export const { setAdminProfile, clearAdminProfile } = adminSlice.actions;

export default adminSlice.reducer;
