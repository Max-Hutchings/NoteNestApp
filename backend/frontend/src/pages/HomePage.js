import React, {useContext} from "react";
import Navbar from "../components/navbar/Navbar"
import AuthContext from "../context/AuthContext";

function HomePage (){

    const authContext = useContext(AuthContext);
    let name = authContext.userEmail;

    return(
        <div>

            <p style={{color: "white"}}> Home page for {name? name : "You"}!</p>
        </div>
    )
}

export default HomePage