import {createSlice} from "@reduxjs/toolkit";
import {
    addSection,
    addSectionNote,
    addSectionTitle, assignNewNotePosition, clearCompletedNotes,
    deleteNote,
    deleteSection,
    getSections,
    saveNote, toggleCompleteNote
} from "../NoteSectionsAPI";


// Initial State of Note Sections
const initialState = {
    sections: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async Thunk actions related to note sections.
// They either pass data for all sections back to client or dont.
const asyncActionsReturnSections = [getSections, addSection, addSectionTitle, addSectionNote,saveNote,
                      deleteNote, deleteSection, toggleCompleteNote, clearCompletedNotes,
                     ]
const asyncActionsDontReturnSection = [assignNewNotePosition,]


const noteSectionsSlice = createSlice({
    name: "noteSections",
    initialState,
    reducers:{

    },
    extraReducers: (builder) =>{
        asyncActionsReturnSections.forEach(action => {
            builder
                .addCase(action.pending, (state) => {
                    state.status = "loading"
                })
                .addCase(action.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload
                })
                .addCase(action.fulfilled, (state, action) => {
                    state.status = "succeeded"
                    state.sections = action.payload.data.sort((a, b) => b.section_type.localeCompare(a.section_type))
                })
        })
        asyncActionsDontReturnSection.forEach(action => {
            builder
                .addCase(action.pending, (state) => {
                    state.status = "loading"
                })
                .addCase(action.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload
                })
                .addCase(action.fulfilled, (state, action) => {
                    state.status = "succeeded"
                })
        })
    }
})

export default noteSectionsSlice.reducer


