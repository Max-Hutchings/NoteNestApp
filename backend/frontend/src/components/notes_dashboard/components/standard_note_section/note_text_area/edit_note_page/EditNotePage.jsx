import React, {useState} from "react"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import "./EditNotePage.css"

function EditNotePage(props){
    const noteId = props.noteId
    const [textValue, setTextValue] = useState(props.note.text)
    console.log(textValue)

    function closeEditPage(){
        props.close();
        props.saveNote(textValue, noteId);
        props.setTextValue(textValue);
    }

    return(
        <div className={"editNotePopout"}>
            <CloseIcon
                onClick={closeEditPage}


            />
            <textarea
                    key={noteId}
                    className={"note-section-note"}
                    name="note"
                    value={textValue}
                    onChange={e => setTextValue(e.target.value)}
                    maxLength={200}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey)
                        {e.preventDefault()
                            closeEditPage()
                        }}}

                />

            <DeleteOutlineIcon
                    sx={{
                        color:"grey",
                        fontSize: "1.3rem"
                    }}
                    onClick={() => props.deleteNote(noteId)}
                />
        </div>
    )
}

export default EditNotePage