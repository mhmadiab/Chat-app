import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const registerUser = createAsyncThunk("register/registerUser" , async(userData, ThunkAPI)=>{
    const {rejectWithValue}= ThunkAPI
    try {

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register` , userData)
        return response.data
        
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue({ message: error.response.data.message });
        }
        return rejectWithValue({ message: error.message });
    }
})

export default registerUser;