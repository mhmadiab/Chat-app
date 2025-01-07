import { createSlice } from "@reduxjs/toolkit";
import registerUser from "./act/registerAct";

const initialState = {
    user: null,
    error: null,
    loading: false,
    success: false,
    message : null

}

const registerSlice =  createSlice({
    name: 'register',
    initialState,
    reducers: {
        resetRegisterState: (state) => {
            state.user = null;
            state.error = null;
            state.loading = false;
            state.success = false;
            state.message = null;
        }
    },
    extraReducers : (builder) => {
        builder.addCase(registerUser.pending , (state)=>{
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        builder.addCase(registerUser.fulfilled , (state,action)=>{
            state.loading = false;
            state.success = true;
            state.user = action.payload.data;
            state.message = action.payload.message

        })
        builder.addCase(registerUser.rejected , (state, action)=>{
            state.loading = false;
            state.success = false;
            state.error = action.payload?.message || "An unexpected error occurred";
        })
    }
})


export {registerUser }
        
export const  { resetRegisterState } = registerSlice.actions
export default registerSlice.reducer;