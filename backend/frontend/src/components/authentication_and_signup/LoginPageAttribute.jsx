import React, {useState, useContext} from "react";
import "./sign_up_form.css";
import {useMediaQuery} from "react-responsive";
import AuthenticationImage from "./authentication_components/AuthenticationImage";
import LoginForm from "./authentication_components/LoginForm"
import {loginUser} from "../../services/slices/UserAthenticationSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

function LoginPageAttribute(){
    const dispatch = useDispatch();
    const isMobile = useMediaQuery({query: '(max-width: 767px)'});
    let navigate = useNavigate();

    const [userForm, setUserForm] = useState({
        email: "",
        password: "",
    })


    function updateForm(event){
        const {name, value} = event.target
        setUserForm((existing) => {
            return {...existing, [name]: value}})

    }

   function submitForm(event){
        event.preventDefault()
        console.log(userForm)
        dispatch(loginUser(userForm))
        navigate("/")

    }

    return(
        <div className={"container-fluid d-flex justify-content-center align-items-center"} style={{"height": "80vh"}}>
            <div className={"row justify-content-center"}>
                <AuthenticationImage isMobile={isMobile} />
                <LoginForm isMobile={isMobile} updateForm={updateForm} submitForm={submitForm}/>
            </div>
        </div>
    )
}

export default LoginPageAttribute