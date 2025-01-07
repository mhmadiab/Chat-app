import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const loginUser = createAsyncThunk("login/loginUser" , async(userData, ThunkAPI)=>{
    const {rejectWithValue}= ThunkAPI
    try {

        const response = await axios.post("http://localhost:8555/api/auth/login" , userData)
        return response.data
        
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue({ message: error.response.data.message });
        }
        return rejectWithValue({ message: error.message });
    }
})

export default loginUser;