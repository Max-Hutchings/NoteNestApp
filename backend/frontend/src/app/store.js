import { configureStore} from "@reduxjs/toolkit";
// import createAxiosInstance   from "../services/createAxiosInstance"
import authReducer from "../services/slices/UserAthenticationSlice"
import noteSectionsReducer from "../services/slices/NoteSectionsSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        noteSections: noteSectionsReducer
    }
})

// const axiosInstance = createAxiosInstance(store)


export { store}