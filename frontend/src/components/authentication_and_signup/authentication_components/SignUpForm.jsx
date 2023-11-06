import React from "react";
import {useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../sign_up_form.css"


function SignUpForm(props){

    const validationSchema = yup.object().shape({
          fName: yup.string().required('First name is required'),
          lName: yup.string().required('Last name is required'),
          email: yup.string().email('Invalid email address').required('Email is required'),
          dOB: yup.string().required('Date of birth is required'),
          password1: yup.string().required('Password is required'),
          password2: yup.string().oneOf([yup.ref('password1'), null], 'Passwords must match')
        });

    const { handleSubmit, control, formState: {errors} } = useForm({
        resolver: yupResolver(validationSchema)
    });



    return (
        <div className={`${props.isMobile? "col-10": "col-sm-4 col-md-4"}`}>
                    <form className={"authenticate-form"} onSubmit={handleSubmit(props.submitForm)}>
                        <h2 className={"authenticate-form-title"}>Create Account</h2>
                        <Controller
                            name={"fName"}
                            control={control}
                            defaultValue={""}
                            render={({field}) => {
                                return <input placeholder={"First Name"} className={"authenticate-form-field"} {...field} />}}
                                />
                        { errors.fName && <p>{errors.fName.message}</p> }
                        <Controller
                            name={"lName"}
                            control={control}
                            defaultValue={""}
                            render={({field}) => {
                                return <input placeholder={"Last Name"} className={"authenticate-form-field"} {...field} />}}
                                />
                        { errors.lName && <p>{errors.lName.message}</p> }
                        <Controller
                            name={"email"}
                            control={control}
                            defaultValue={""}
                            render={({field}) => {
                                return <input placeholder={"Email"} className={"authenticate-form-field"} {...field} />}}
                                />
                        { errors.email && <p>{errors.email.message}</p> }
                        <Controller
                            name={"dOB"}
                            control={control}
                            defaultValue={""}
                            render={({field}) => {
                                return <input placeholder={"Date of Birth"} type="date" className={"authenticate-form-field"} {...field} />}}
                                />
                        { errors.dOB && <p>{errors.dOB.message}</p> }
                        <Controller
                            name={"password1"}
                            control={control}
                            defaultValue={""}
                            render={({field}) => {
                                return <input placeholder={"Password"} className={"authenticate-form-field"} {...field} />}}
                                />
                        { errors.password1 && <p>{errors.password1.message}</p> }
                        <Controller
                            name={"password2"}
                            control={control}
                            defaultValue={""}
                            render={({field}) => {
                                return <input placeholder={"Confirm Password"} className={"authenticate-form-field"} {...field} />}}
                                />
                        { errors.password2 && <p>{errors.password2.message}</p> }

                        <button className={"btn authenticate-form-button"} type={"submit"}>Sign Up</button>
                    </form>
                    <div className={"row authenticate-form-login-link"}>
                        <p>Already have an account? <a href={"/login"}>Login</a></p>
                    </div>
                </div>
    )
}

export default SignUpForm