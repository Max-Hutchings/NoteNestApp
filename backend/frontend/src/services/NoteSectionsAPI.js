import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import useToken from "../services/getToken";



function config(){
    return {
            headers: {
                'Authorization': `Bearer ${useToken()}`,
            }
        };
}


export const getSections = createAsyncThunk(
    "noteSections/getSections",
    async(_, { rejectWithValue }) => {
        try{
            const response = await axios.get("http://127.0.0.1:8000/api/get-sections/", config());
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)


// Define the thunk using createAsyncThunk
export const addSection = createAsyncThunk(
    "noteSections/addSection",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/add-section/",
                {},
                config()
            );
            return response.data;
        } catch (e) {
            return rejectWithValue(e.response.data);
        }
    }
);


export const addSectionTitle = createAsyncThunk(
    "noteSections/addSectionTitle",
    async ({newTitle, sectionId}, {rejectWithValue}) => {
        try{
            const response = await axios.post("http://127.0.0.1:8000/api/add-section-title/",{
            "section_title": newTitle,
            "section_id": sectionId
                }, config());
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

export const addSectionNote = createAsyncThunk(
    "noteSections/addSectionNote",
    async ({noteText, sectionId}, {rejectWithValue}) =>{
        try{
            const response = await axios.post("http://127.0.0.1:8000/api/add-section-note/", {
            "noteText": noteText,
            "sectionId": sectionId
                }, config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

export const saveNote = createAsyncThunk(
    "noteSections/saveNote",
    async({noteText, noteId, sectionId}, {rejectWithValue}) => {
        try{
            const response = await axios.put("http://127.0.0.1:8000/api/add-section-note/", {
                "sectionId": sectionId,
                "noteText": noteText,
                "noteId": noteId,
            }, config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
})

export const deleteNote = createAsyncThunk(
    "noteSections/deleteNote",
    async ({noteId}, {rejectWithValue}) => {
        try{
            const response = await axios.delete(`http://127.0.0.1:8000/api/delete-note/${noteId}`, config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

export const deleteSection = createAsyncThunk(
    "noteSections/deleteSection",
    async ({sectionId}, {rejectWithValue}) =>{
        try{
            const response = await axios.delete(`http://127.0.0.1:8000/api/delete-section/${sectionId}`, config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

export const toggleCompleteNote = createAsyncThunk(
    "noteSections/toggleCompleteNote",
    async ({noteId}, {rejectWithValue}) => {
        try{
            const response = await axios.put(`http://127.0.0.1:8000/api/complete-note/`,
            {"noteId": noteId}, config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

export const clearCompletedNotes = createAsyncThunk(
    "noteSections/clearCompletedNotes",
    async (_, {rejectWithValue}) => {
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/clear-completed-tasks/`, {}, config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

export const assignNewNotePosition = createAsyncThunk(
    "noteSections/assignNewNotePosition",
    async ({notePosition}, {rejectWithValue}) => {
        try{
            const response = await axios.put(
                `http://127.0.0.1:8000/api/assign-new-note-position/`,
                {"notePositions": notePosition},
                config())
            return response.data
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
)

