/*
*
STORE
*
*/


import {configureStore} from '@reduxjs/toolkit'
import register from './Register/registerSlice'
import login from './Login/loginSlice'

const store = configureStore({
    reducer: {
        register,
        login
    }
})

export default store