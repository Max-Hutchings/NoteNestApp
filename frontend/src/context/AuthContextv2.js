import axios from 'axios';
import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {

    let [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Function to check authentication status
        async function checkAuth() {
            try {
                let response = await axios.get("http://127.0.0.1:8000/api/check-auth", {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data.isAuthenticated) {
                    setUser({ email: response.data.email });
                }
            } catch (error) {
                console.error("Something went wrong: ", error);
            }
        }

        // Call the function on component mount
        checkAuth();
    }, []);

    async function loginUser(userForm) {
        if (userForm && userForm.email && userForm.password) {
            try {
                let response = await axios.post("http://127.0.0.1:8000/api/token/", {
                    email: userForm.email,
                    password: userForm.password
                }, {
                    withCredentials: true,  // Ensure cookies are sent and received
                });
                console.log("data: ", response.data);

                if (response.status === 200) {
                    setUser({ email: userForm.email });  // Assuming you only need the email on the client-side
                    navigate('/');
                }
            } catch (error) {
                console.error("Something went wrong: ", error);
            }
        } else {
            console.error("Something went wrong");
        }
    }

    let contextData = {
        userEmail: user ? user.email : null,
        loginUser: loginUser
    }

    console.log(contextData);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
