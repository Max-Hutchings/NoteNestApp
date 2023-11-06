// CreateAccountApi.jsx

import axios from "axios";

export async function createAccount(filledForm, loginUser, navigate) {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/create-account/", {
            first_name: filledForm.fName,
            last_name: filledForm.lName,
            email: filledForm.email,
            date_of_birth: filledForm.dOB,
            password: filledForm.password1
        })

        console.log(response.data)

        if (response.status === 200) {
            const userForm = {
                email: filledForm.email,
                password: filledForm.password1
            }
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            await loginUser(userForm);
            navigate("/dashboard");
        }

    } catch (error) {
        console.log(error)
    }
}
