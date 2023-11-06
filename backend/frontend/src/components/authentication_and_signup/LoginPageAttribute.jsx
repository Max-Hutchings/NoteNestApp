import React, {useState, useContext} from "react";
import "./sign_up_form.css";
import {useMediaQuery} from "react-responsive";
import AuthenticationImage from "./authentication_components/AuthenticationImage";
import LoginForm from "./authentication_components/LoginForm"
import AuthContext from "../../context/AuthContext";


function LoginPageAttribute(){

    const isMobile = useMediaQuery({query: '(max-width: 767px)'});

    const [userForm, setUserForm] = useState({
        email: "",
        password: "",
    })

    let {loginUser} = useContext(AuthContext)

    function updateForm(event){
        const {name, value} = event.target
        setUserForm((existing) => {
            return {...existing, [name]: value}})

    }

   function submitForm(event){
        event.preventDefault()
       console.log(userForm)
        loginUser(userForm)
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