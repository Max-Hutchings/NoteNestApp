import React, {useContext} from "react";
import axios from "axios";

function config(token){
    const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };
    return  config
}


export async function AddSectionAPI(token){
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/add-section/",{}, config(token))
        const data = response.data
        return data
    }catch(error){console.log(error)}

}


export async function GetSectionsAPI(token){
    try{
        const response = await axios.get("http://127.0.0.1:8000/api/get-sections/", config(token));
        const data = response.data
        return data
    }catch(error){console.log(error)}
}


export async function AddSectionTitleAPI(token, newTitle, sectionId){
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/add-section-title/",{
           "section_title": newTitle,
           "section_id": sectionId
        }, config(token));
        const data = response.data;
        return data;
    } catch(error) {
        console.log(error);
    }
}


export async function AddUserSectionNoteAPI(token, text, sectionId){
    try{
        const response = await axios.post("http://127.0.0.1:8000/api/add-section-note/", {
            "noteText": text,
            "sectionId": sectionId
        }, config(token))
        const data = response.data
        return data
    }catch(error){console.log(error)}
}

export async function SaveUserNoteAPI(token, textValue, noteId, sectionId){
    try{
        const response = await axios.put("http://127.0.0.1:8000/api/add-section-note/", {
            "sectionId": sectionId,
            "noteText": textValue,
            "noteId": noteId,
        }, config(token))
        const data = response.data
        return data
    }catch(error){
        console.log("Error editing note: ", error)
    }
}


export async function deleteNoteAPI(token, noteId){
    try{
        const response = await axios.delete(`http://127.0.0.1:8000/api/delete-note/${noteId}`, config(token))
        const data = response.data
        return data
    }catch(error){console.error("Couldn't delete section: ", error)}
}

export async function deleteSectionAPI(token, sectionId){
    try{
        console.log(sectionId)
        const response = await axios.delete(`http://127.0.0.1:8000/api/delete-section/${sectionId}`, config(token))
        const data = response.data
        return data
    }catch(error){
        console.error("Coldnt delete section: ", error)
    }
}

export async function toggleCompleteNoteAPI(token, noteId){
    try{
        const response = await axios.put(`http://127.0.0.1:8000/api/complete-note/`,
            {
                "noteId": noteId
            }, config(token))
        const data = response.data
        return data
    }catch(error){
        console.log("Failed to send complete note: ", error)
    }
}


export async function clearCompletedTasksAPI(token){
    try{
        const response = await axios.post(`http://127.0.0.1:8000/api/clear-completed-tasks/`, {}, config(token))
        const data = response.data
        return data
    }catch(error){
        console.log("Failed to clear completed tasks: ", error)
    }
}



export async function AssignNewNotePosition(token, notePositions){
    try{
        const response = await axios.put(
            `http://127.0.0.1:8000/api/assign-new-note-position/`,
            {"notePositions": notePositions},
            config(token))
        return response.data
    }catch(error){
        console.log("Failed to save new note position: ", error)
    }
}