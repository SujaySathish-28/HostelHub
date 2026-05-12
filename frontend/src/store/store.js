import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    student: studentReducer,
    admin: adminReducer,
  },
});

export default store;
