import React from "react";
import {Route, Redirect } from "react-router-dom"


import NotesDashboard from "../components/notes_dashboard/NotesDashboard";

function UserDashboardPage(){
    return(
        <div>
            <NotesDashboard />
        </div>
    )
}

export default UserDashboardPage