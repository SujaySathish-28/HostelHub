import {configureStore, createSlice} from '@reduxjs/toolkit';

const studentSlice=createSlice({
    name:'student',
    initialState:{},
    reducers:{
        attendance:()=>{},
    }
})

const StudentStore=configureStore({
    reducer:{
        student:studentSlice.reducer,
    }
})