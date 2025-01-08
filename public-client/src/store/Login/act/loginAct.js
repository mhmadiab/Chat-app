import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const loginUser = createAsyncThunk("login/loginUser" , async(userData, ThunkAPI)=>{
    const {rejectWithValue}= ThunkAPI
    try {
        console.log(process.env.REACT_APP_API_URL)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login` , userData)
        return response.data
        
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue({ message: error.response.data.message });
        }
        return rejectWithValue({ message: error.message });
    }
})

export default loginUser;