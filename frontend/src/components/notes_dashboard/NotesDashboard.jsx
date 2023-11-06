import React, { useState, useContext } from "react";
import StandardNoteSection from "./components/standard_note_section/StandardNoteSection";
import AddSectionComponent from "./components/add_section/AddSection";
import trailNotes from "./trial_notes";
import AuthContext from "../../context/AuthContext";
import { AddSectionAPI, AddUserSectionNoteAPI, AddSectionTitleAPI, GetSectionsAPI, SaveUserNoteAPI, deleteNoteAPI, deleteSectionAPI } from "../../services/AddSectionApi.jsx"
import trial_notes from "./trial_notes";


function NotesDashboard() {

    const {token} = useContext(AuthContext)

    // GATHERING NOTE SECTION DATA
    const [sections, setSections] = useState([{
        title: "Section Title",
        notes: ["Note 1", "Note2"]
    },
        ]);

    // ADDING A SECTION AND UPDATING SECTIONS
    async function AddSection(){
        try {
            const sections = await AddSectionAPI(token)
            console.log(sections)
            if (sections.data === "maximumSectionsReached") {
                return alert("Maximum Sections Reached")
            }

            setSections(sections)
        }catch(error){
            console.error("An error occurred while adding a section: ", error)
        }
    }

    async function GetSections(){
        try {
            const data = await GetSectionsAPI(token)
            console.log(data)
            setSections(data)
        }
        catch(error){
            console.error("Failed to get sections data: ", error)
        }
    }


    async function saveSectionTitle(newTitle, sectionId){
        try{
            const sections = await AddSectionTitleAPI(token, newTitle, sectionId)
            setSections(sections)
            console.log("Saved new title and updated sections")
        }catch(error){
            console.erorr("Unable to add section title and set sections: ", error)
        }
    }

    async function SaveNote(textValue, noteId, sectionId){
        try{
            const sections = await SaveUserNoteAPI(token, textValue,noteId, sectionId)
            setSections(sections)
            console.log("Saved Note")

        }catch(error){
            console.error("Note failed to save: ", error)
        }
    }

    async function AddNote(textValue, sectionId){
        try{
            console.log(sectionId)
            const sections = await AddUserSectionNoteAPI(token, textValue, sectionId)
            setSections(sections)
        }catch(error){
            console.error("Failed to add note: ", error)
        }
    }

    async function deleteNote(noteId){
        try{
            console.log("delete note called")
            const sections = await deleteNoteAPI(token, noteId)
            setSections(sections)
        }catch(error){
            console.error("Failed to delete note: ", error)
        }
    }

    async function deleteSection(sectionId){
        try{
            const sections = await deleteSectionAPI(token, sectionId)
            setSections(sections)
        }catch(error){
            console.error("Failed to delete Section: ", error)
        }
    }


    return (
        <div>
            <AddSectionComponent
                click={AddSection}/>
            <div className={"container"}>
                <div className={"row"}>
                    {sections.map((section, index) => (
                        <div className={"col"}>
                            <StandardNoteSection
                                key={section.id}
                                sectionData={section}
                                saveTitle={(newTitle) => saveSectionTitle(newTitle, section.id)}
                                saveNote={(textValue, noteId) => SaveNote(textValue, noteId, section.id)}
                                addNote={(textValue) => AddNote(textValue, section.id)}
                                deleteNote={deleteNote}
                                deleteSection={deleteSection}
                            />
                        </div>
                    ))}
                </div>

                    <button onClick={GetSections}>
                        Get sections
                    </button>

            </div>
        </div>
    );
}

export default NotesDashboard;
