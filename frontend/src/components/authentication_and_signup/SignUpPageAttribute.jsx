import React, {useContext} from "react";
import "./sign_up_form.css";
import {useMediaQuery} from "react-responsive";
import AuthenticationImage from "./authentication_components/AuthenticationImage";
import SignUpForm from "./authentication_components/SignUpForm";
import {createAccount} from "../../services/CreateAccountApi";
import AuthContext from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";



function SignUpPageAttribute(){

    const isMobile = useMediaQuery({query: '(max-width: 767px)'});

    const {loginUser} = useContext(AuthContext)
    const navigate = useNavigate()

    function submitForm(data){
        console.log(data)
        createAccount(data, loginUser, navigate)
    }

    return(
        <div className={"container-fluid d-flex justify-content-center align-items-center"} style={{"height": "80vh"}}>
            <div className={"row justify-content-center"}>
                <AuthenticationImage isMobile={isMobile} />
                <SignUpForm isMobile={isMobile} submitForm={submitForm}/>
            </div>
        </div>
    )
}

export default SignUpPageAttribute