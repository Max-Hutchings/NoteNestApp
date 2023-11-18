import React, { useRef, useEffect, useState } from "react";
import "../standard_note_section.css"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import EditNotePage from "./edit_note_page/EditNotePage"
import {useSortable} from "@dnd-kit/sortable";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';


function NoteTextArea(props) {
    const note = props.noteData;
    const noteId = props.id;
    const textareaRef = useRef(null);
    const [textValue, setTextValue] = useState(note.text)
    const [dragging, setDragging] = useState(false);
    const [editIconEnabled, setEdit] = useState(false)
    const [editNotePage, setEditNotePage] = useState(false)
    // const [noteComplete, setNoteComplete] = useState(note.complete)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({
        id: props.position,
        attributes: {
            tabIndex: 0
        }
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${parseFloat(getComputedStyle(textareaRef.current).lineHeight)}px`;
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [textValue]); // Dependency on the note's content


    function showEdit(){
        setEdit(true)
    }

    function hideEdit(){
        setEdit(false)
    }

    function showNoteEdit(){
        setEditNotePage(true)
    }

    function hideNoteEdit(){
        setEditNotePage(false)
    }


    return (
        <div className={"row"} onMouseEnter={showEdit}  onMouseLeave={hideEdit}>
            <div ref={setNodeRef} style={style} {...attributes} className="col d-flex align-items-center note-section-container">
                {note.completed ? (
                    <del {...listeners} className={"note-section-note"}>{textValue}</del>
                ):
                    <div
                        key={noteId}
                        ref={textareaRef}
                        className={"note-section-note"}
                        name="note"

                        // onChange={e => setTextValue(e.target.value)}
                        {...listeners}
                        maxLength={200}
                    >{note.complete ? `<del> ${textValue} </del>`: textValue}</div>
                }
                {editIconEnabled ?
                    <EditIcon
                        sx={{
                        color: "grey",
                        fontSize: "1.3rem",
                        }}
                        onClick={showNoteEdit}
                    />
                    : null}
                {editNotePage ?
                    <EditNotePage
                        noteId={noteId}
                        note = {note}
                        deleteNote={props.deleteNote}
                        saveNote={props.saveNote}
                        setTextValue={setTextValue}
                        close={hideNoteEdit}
                    />
                    : null}
                {note.completed ?
                    <UndoIcon
                        sx={{
                            color: "green",
                            fontSize: "1.3rem",
                            }}
                        onClick={() => props.toggleCompleteNote(noteId)}
                    />
                    :
                    <DoneIcon
                        sx={{
                            color: "green",
                            fontSize: "1.3rem",
                            }}
                        onClick={() => {
                            props.toggleCompleteNote(noteId);

                        }}
                    />
                }


            </div>
        </div>
    );
}

export default NoteTextArea;
