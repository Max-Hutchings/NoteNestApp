import React, { useRef, useEffect, useState } from "react";
import "../standard_note_section.css"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function NoteTextArea(props) {
    const note = props.noteData;
    const noteId = props.noteData.id;
    const textareaRef = useRef(null);

    const [textValue, setTextValue] = useState(note.text)


    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${parseFloat(getComputedStyle(textareaRef.current).lineHeight)}px`;
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [textValue]); // Dependency on the note's content

    // SAVING NOTES

    return (
        <div className={"row"}>
            <div className="col d-flex justify-content-center align-items-center note-section-container">
                <textarea
                    key={noteId}
                    ref={textareaRef}
                    className={"note-section-note"}
                    name={"note"}
                    value={textValue}
                    onChange={e => setTextValue(e.target.value)}
                    onBlur={() => props.saveNote(textValue, noteId)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevents the default action of the enter key in a textarea
                            props.saveNote(textValue, noteId);
                        }
                    }}
                    maxLength={200}
                />
                <DeleteOutlineIcon
                    sx={{
                        color:"grey",
                        fontSize: "1.3rem"
                    }}
                    onClick={() => props.deleteNote(noteId)}
                />
            </div>
        </div>
    );
}

export default NoteTextArea;
