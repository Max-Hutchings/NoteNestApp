import React, { useEffect, useState} from "react";
import "./standard_note_section.css"
import NoteTextArea from "./note_text_area/NoteTextArea";
import DeleteIcon from '@mui/icons-material/Delete';
import {closestCenter, DndContext, useDroppable} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy, arrayMove} from "@dnd-kit/sortable";






function StandardNoteSection(props){

    // const {token} = useContext(AuthContext)
    const token = "123";
    const sectionId = props.sectionData.id
    // console.log(props.sectionData)
    //
    const [title, setTitle] = useState(props.sectionData.title)
    const [addNoteText, setAddNoteText] = useState("")
    const [notes, setNotes] = useState(props.sectionData.notes)


    useEffect(() => {
        setNotes(props.sectionData.notes.sort((a, b) => a.position - b.position))
        console.log("=====SETNOTES==========")
        console.log(notes)
    }, [props.sectionData.notes]);


    const array = notes.map(note => String(note.id)); // Convert each note.id to a string


    function handleNoteDrag(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setNotes((prevNotes) => {
                // Find the index of the active and over items based on their position
                const activeIndex = prevNotes.findIndex(note => note.position === parseInt(active.id, 10));
                const overIndex = prevNotes.findIndex(note => note.position === parseInt(over.id, 10));

                // Ensure both indices are found
                if (activeIndex === -1 || overIndex === -1) {
                    return prevNotes;
                }

                // Reorder the notes array
                const newNotes = arrayMove(prevNotes, activeIndex, overIndex);


                // After moving, reassign positions based on the new order
                const positionCorrectedNotes = newNotes.map((note, index) => ({...note, position: index + 1}))
                const noteIdAndPosition = {}
                positionCorrectedNotes.forEach(note => noteIdAndPosition[note.id] = note.position)
                console.log(noteIdAndPosition)
                // AssignNewNotePosition(token, noteIdAndPosition)
                return positionCorrectedNotes
            });
        }
    }





    return(
        <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleNoteDrag}
            >
        <div className={"container standard-note-section"}>
            <div className={"row justify-content-center"}>
                <div className="col d-flex align-items-center note-section-title-container">
                    <input
                        onBlur={() => props.saveTitle(title)}
                        className={"note-section-title"}
                        name={"title"}
                        placeholder={"Enter Title"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}

                    />
                    <DeleteIcon
                        sx={{
                            color:"lightGrey"
                        }}
                        onClick={()=> props.deleteSection(sectionId)}
                    />
                </div>
            </div>

                <SortableContext
                    items={notes.map(note => note.position)}
                    strategy={verticalListSortingStrategy}
                >

                    {notes.map((note, index) => {
                        return (
                            <NoteTextArea
                                key={note.id}
                                id={note.id}
                                position={note.position}
                                noteData={note}
                                saveNote={(textValue, noteId) => props.saveNote(textValue, noteId, sectionId)}
                                deleteNote={props.deleteNote}
                                toggleCompleteNote={props.toggleCompleteNote}

                                />
                        )
                    })}
                </SortableContext>

            <div className={"row"}>

                <div className="col d-flex justify-content-center align-items-center note-section-container">
                    {/*<input className={"note-section-note"} name={"add-note"} placeholder={"Add Note"}/>*/}
                    <textarea
                        className={"note-section-note"}
                        name={"add-note"}
                        placeholder={"Add Note"}
                        value={addNoteText}
                        onChange={e => setAddNoteText(e.target.value)}
                        onBlur={() => {
                            if (addNoteText.length > 0){
                                props.addNote(addNoteText);
                                setAddNoteText("");
                                }
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevents the default action of the enter key in a textarea
                                if (addNoteText.length > 0){
                                    props.addNote(addNoteText);
                                    setAddNoteText("");
                                }
                            }
                        }}
                        maxLength={200}
                />
                </div>
            </div>
        </div>
        </DndContext>

    )
}

export default StandardNoteSection