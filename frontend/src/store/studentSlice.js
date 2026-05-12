import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getStudentProfile } from '../services/studentServices';

export const fetchStudentProfile = createAsyncThunk(
  'student/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const data = await getStudentProfile();
      console.log(data)
      if (data?.message || data?.error) {
        return thunkAPI.rejectWithValue(data.message || data.error);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch student profile');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    profile: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setStudentProfile: (state, action) => {
      state.profile = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    clearStudentProfile: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.profile = null;
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Unable to load profile';
      });
  },
});

export const { setStudentProfile, clearStudentProfile } = studentSlice.actions;

export default studentSlice.reducer;
