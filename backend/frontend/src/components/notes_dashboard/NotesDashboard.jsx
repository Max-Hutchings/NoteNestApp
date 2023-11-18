import React, { useState, useContext, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove,  verticalListSortingStrategy } from "@dnd-kit/sortable"
import StandardNoteSection from "./components/standard_note_section/StandardNoteSection";
import AddSectionComponent from "./components/add_section/AddSection";
import "./notes_dashboard.css"
import {useDispatch, useSelector} from "react-redux";
import {
    addSection,
    addSectionNote,
    addSectionTitle, assignNewNotePosition, clearCompletedNotes,
    deleteNote,
    deleteSection,
    getSections,
    saveNote, toggleCompleteNote
} from "../../services/NoteSectionsAPI"



function NotesDashboard() {

    const dispatch = useDispatch()
    const { sections, status, error } = useSelector(state => state.noteSections)

    // GET SECTIONS
    const handleGetSections = () => {dispatch(getSections())}

    useEffect(() =>{
        handleGetSections()
    }, [])

    // ADD SECTION
    const handleAddSection = () => {dispatch(addSection())}

    // SAVE SECTION TITLE
    const handleAddSectionTitle = (newTitle, sectionId) => {dispatch(addSectionTitle({newTitle: newTitle, sectionId: sectionId}))}

    // SAVE NOTE
    const handleSaveNote = (noteText, noteId, sectionId) => {dispatch(saveNote({noteText: noteText, noteId: noteId, sectionId: sectionId}))}

    // ADD NOTE
    const handleAddNote = (noteText, sectionId) => {dispatch(addSectionNote({noteText: noteText, sectionId: sectionId}))}

    // DELETE NOTE
    const handleDeleteNote = (noteId) => {dispatch(deleteNote({noteId: noteId}))}

    // DELETE SECTION
    const handleDeleteSection = (sectionId) => {dispatch(deleteSection({sectionId: sectionId}))}

    // TOGGLE COMPLETE NOTE
    const handleToggleCompleteNote = (noteId) => {dispatch(toggleCompleteNote({noteId: noteId}))}

    // CLEAR COMPLETED NOTES
    const handleClearCompletedNotes = () => {dispatch(clearCompletedNotes())}





    return (
        <div>
            <AddSectionComponent
                click={handleAddSection}/>

                <div className={"container-fluid dashboard-sections-container"}>
                    <div className={"row"}>
                        {sections.map((section, index) => (
                            <div className={"col section_col d-flex justify-content-center"}
                                 key={section.id}
                            >
                                <StandardNoteSection
                                    sectionId={section.id}
                                    sectionData={section}
                                    saveTitle={(newTitle) => handleAddSectionTitle(newTitle, section.id)}
                                    saveNote={(textValue, noteId) => handleSaveNote(textValue, noteId, section.id)}
                                    addNote={(textValue) => handleAddNote(textValue, section.id)}
                                    deleteNote={handleDeleteNote}
                                    deleteSection={handleDeleteSection}
                                    toggleCompleteNote={handleToggleCompleteNote}

                                />
                            </div>
                        ))}
                    </div>

                        <button onClick={handleClearCompletedNotes}>
                            Clear Completed Tasks
                        </button>

                </div>

        </div>
    );
}

export default NotesDashboard;
