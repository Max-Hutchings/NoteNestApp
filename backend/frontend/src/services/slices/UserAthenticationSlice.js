import {jwtDecode} from "jwt-decode"
import { useNavigate } from 'react-router-dom';
import { refreshAuthentication  } from "../RefreshAuthentication"
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios"

// Decoded Token Structure
// email:"k@gmail.com"
// exp:1700049268
// iat:1700048968
// jti:"94e0ee8b3224462e87fd27a2a69b3e32"
// name:"Tim Carrol"
// token_type:"access"
// userId:4
// user_id:4


// Initial State before calling user information
const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    status: "idle", // "idle" | "loading" | "succeeded" | "failed
    error: null
}


// Async Thunk for user login
// "auth/loginUser" makes this a reducer within authSlice. Has to be this way due to API.
// As a thunk, it is used to trigger side affects to redux store, but are not a reducer
// User data in formate {"email": userForm.email, "password": userForm.password}
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try{
            const data = JSON.stringify({
                "email": userData.email,
                "password": userData.password
            })
            const response = await axios.post("http://127.0.0.1:8000/api/token/", data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem("refreshAuthToken", response.data.refresh); //Saving to local storage
            const decodedToken = jwtDecode(response.data.access);
            return { user: decodedToken, token: response.data.access};
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
);

//Auth slice
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            // localStorage.removeItem("refreshAuthToken");
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.token
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(refreshAuthentication.fulfilled, (state, action) => {
                state.token = action.payload.token
                state.user = action.payload.user;
            })
            .addCase(refreshAuthentication.rejected, (state, action) =>{
                state.error = action.payload
            })

    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;