import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {

    const [authToken, setAuthToken] = useState(() => JSON.parse(localStorage.getItem("authToken")) || null);
    const [user, setUser] = useState(() => jwtDecode(localStorage.getItem("authToken")) || null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    async function loginUser(userForm) {
        if (userForm && userForm.email && userForm.password) {
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                    email: userForm.email,
                    password: userForm.password
                });

                const data = response.data;
                console.log("data: ", data);

                if (response.status === 200) {
                    setAuthToken(data);
                    setUser(jwtDecode(data.access));
                    console.log(JSON.stringify(data));
                    console.log(user);
                    localStorage.setItem("authToken", JSON.stringify(data));
                    navigate('/');
                }

            } catch (error) {
                console.error("Something went wrong: ", error);
            }
        } else {
            console.error("Something went wrong");
        }
    }

    function logoutUser() {
        localStorage.removeItem("authToken"); // Updated key to remove authToken
        setAuthToken(null);
        setUser(null);
        navigate("/");
    }

    async function updateToken() {
        console.log("update token called");

        const storedToken = JSON.parse(localStorage.getItem("authToken"));
        console.log(storedToken);
        const refreshToken = storedToken ? storedToken.refresh : null;

        if (!refreshToken) {
            console.log("No refresh token found.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                refresh: refreshToken
            });

            if (response.status === 200) {
                const data = response.data;
                const newTokenData = { ...storedToken, ...data };

                setAuthToken(newTokenData);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authToken", JSON.stringify(newTokenData));
                console.log("Refreshed access token successfully");
            } else {
                console.log("Failed to refresh token, logging out.");
                logoutUser();
            }

        } catch (error) {
            console.error("An error occurred while refreshing token:", error);
            logoutUser();
        }
    }

    const contextData = {
        userEmail: user ? user.email : null,
        userName: user ? user.name : null,
        userId: user ? user.user_id : null,
        token: authToken,
        loginUser: loginUser,
        logoutUser: logoutUser // Fixed typo: LogoutUser -> logoutUser
    };

    console.log(contextData);

    useEffect(() => {
        const interval = setInterval(() => {
            if (authToken) {
                updateToken();
            }
        }, 270_000);
        return () => clearInterval(interval);

    }, [authToken, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}
