import React, {useContext} from "react";
import Navbar from "../components/navbar/Navbar"
import { authSlice} from "../services/slices/UserAthenticationSlice";
import { useSelector} from "react-redux";

function HomePage (){

    const user = useSelector(state => state.auth.user)
    const name = user?.name
    console.log(user)
    return(
        <div>

            <p style={{color: "white"}}> Home page for {name? name : "You"}!</p>
        </div>
    )
}

export default HomePage