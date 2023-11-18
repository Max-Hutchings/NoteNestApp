import React, {useContext} from "react";
import "./sign_up_form.css";
import {useMediaQuery} from "react-responsive";
import AuthenticationImage from "./authentication_components/AuthenticationImage";
import SignUpForm from "./authentication_components/SignUpForm";
import {CreateAccount} from "../../services/CreateAccountApi";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import { loginUser } from "../../services/slices/UserAthenticationSlice"


function SignUpPageAttribute(){

    const isMobile = useMediaQuery({query: '(max-width: 767px)'});

    const dispatch = useDispatch()

    const navigate = useNavigate()

    async function submitForm(data){
        console.log(data)
        const userForm = await CreateAccount(data, navigate)
        dispatch(loginUser(userForm))
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