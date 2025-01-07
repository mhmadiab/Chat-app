import { createSlice } from "@reduxjs/toolkit";
import loginUser from "./act/loginAct";

const initialState = {
    loggedInUser: null,
    error: null,
    loading: false,
    success: false,
    message : null

}

const loginSlice =  createSlice({
    name: 'login',
    initialState,
    reducers: {
        resetLoginState: (state) => {
            state.loggedInUser = null;
            state.error = null;
            state.loading = false;
            state.success = false;
            state.message = null;
        }
    },
    extraReducers : (builder) => {
        builder.addCase(loginUser.pending , (state)=>{
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        builder.addCase(loginUser.fulfilled , (state,action)=>{
            state.loading = false;
            state.success = true;
            state.loggedInUser = action.payload.data;
            state.message = action.payload.message

        })
        builder.addCase(loginUser.rejected , (state, action)=>{
            state.loading = false;
            state.success = false;
            state.error = action.payload?.message || "An unexpected error occurred";
        })
    }
})


export {loginUser }       
export const  { resetLoginState } = loginSlice.actions
export default loginSlice.reducer;