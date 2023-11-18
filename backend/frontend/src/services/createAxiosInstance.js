// import axios from "axios";
// import  useToken  from "./getToken"; // Adjust the path based on where getToken is located
//
// function createAxiosInstance(store) {
//     const axiosInstance = axios.create({
//         baseURL: "/api"
//     });
//
//     axiosInstance.interceptors.request.use((config) => {
//         const token = useToken();
//         if (token){
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     });
//
//     return axiosInstance;
// };
//
// export default createAxiosInstance;
