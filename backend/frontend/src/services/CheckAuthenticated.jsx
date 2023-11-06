import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import AuthContext from "../context/AuthContext";

function CheckAuthenticated ( { children }){
    let {userEmail} = useContext(AuthContext)
    let isAuthenticated = !!userEmail;
    return (
        isAuthenticated ? children : <Navigate to={"/login"} replace />
    )
}

export default CheckAuthenticated