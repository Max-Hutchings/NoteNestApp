import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"
import { useNavigate } from 'react-router-dom';
import {Logout} from "@mui/icons-material";


const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({children}) {

    let currentToken = () =>localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")) : null
    let currentUser = ()=> localStorage.getItem("authToken") ? jwtDecode(localStorage.getItem("authToken")) : null


    let [authToken, setAuthToken] = useState(currentToken())
    let [user, setUser] = useState(currentUser())
    let [loading, setLoading] = useState(true)


    const navigate = useNavigate();


    async function loginUser(userForm){
    // Ensure userForm is defined and contains the email and password properties
    if (userForm && userForm.email && userForm.password) {
        let response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": userForm.email,
                "password": userForm.password
            })
        });
        let data = await response.json();
        console.log("data: ", data);

        if (response.status === 200){
            setAuthToken(data)
            setUser(jwtDecode(data.access))
            console.log(JSON.stringify(data))
            console.log(user)
            localStorage.setItem("authToken", JSON.stringify(data))



            navigate('/');

        }

    } else {
        console.error("Something went wrong");
    }
}

    function logoutUser(){
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");


        setAuthToken(null)
        setUser(null)

        navigate("/")
    }

    async function updateToken(){
    console.log("update token called");


    // Extract the refresh token from localStorage or state
    const storedToken = JSON.parse(localStorage.getItem("authToken"));
    console.log(storedToken)
    const refreshToken = storedToken ? storedToken.refresh : null;

    if (!refreshToken) {
        console.log("No refresh token found.");
        return;
    }

    try {
        let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });

        if (response.status === 200){
            let data = await response.json();


            const newTokenData = {
                ...storedToken, ...data
            }

            setAuthToken(newTokenData);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authToken", JSON.stringify(newTokenData));
            console.log("Refreshed access token successfully")
        } else {
            console.log("Failed to refresh token, logging out.");
            logoutUser();
        }
    } catch (error) {
        console.error("An error occurred while refreshing token:", error);
        logoutUser();
    }
}


    let contextData ={
        userEmail: user ? user.email : null,
        userName: user ? user.name : null,
        userId: user ? user.user_id : null,
        token: authToken ? authToken.access : null,
        loginUser: loginUser,
        LogoutUser: logoutUser
    }

    console.log(contextData)

    useEffect(() => {

        let interval = setInterval(() => {
            if (authToken){
                updateToken()
                console.log("Toke updated")
            }
        }, 1000 * 60)
        return () => clearInterval(interval)

    }, [authToken, loading, updateToken])

    return (
        <AuthContext.Provider value={contextData }>
            {children}
        </AuthContext.Provider>
    )
}
