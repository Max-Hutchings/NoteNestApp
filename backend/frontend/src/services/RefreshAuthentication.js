import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {jwtDecode} from "jwt-decode";


// The "(_," is just a placeholder for the payload, but there is no payload for this case.
export const refreshAuthentication = createAsyncThunk(
    "auth/refreshToken",
    async(_, {rejectWithValue}) => {
        const refreshToken = localStorage.getItem("refreshAuthToken");
        if (!refreshToken){
            return rejectWithValue("No refresh Token Available")
        }

        try{
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/refresh/",
                {refresh: refreshToken},{
                headers: {
                    'Content-Type': 'application/json'
                }})
            const decodedToken = jwtDecode(response.data.access);
            return { user: decodedToken, token: response.data.access};

        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

