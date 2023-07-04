import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import NoteItems from './NoteItems';
import { useNavigate} from 'react-router-dom';

const Notes = () => {
    let history = useNavigate();
    const context = useContext(noteContext);
    const { notes, getNote, editNote } = context;

    useEffect(() => {
        if(localStorage.getItem('token')){
            getNote();
        }
        else{
            history("/login");
        }
            // eslint-disable-next-line
    }, []);

    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setNote] = useState({ etitle: "", edescription: "", etag: "" });


    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
    }

    const handleClick = () => {
        refClose.current.click();
        editNote(note.id, note.etitle, note.edescription, note.etag)
      }
    
      const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
      }

    return (
        <>
            <AddNote />
            <button ref={ref} type="button" className="btn btn-primary mt-2 d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" value={note.etitle} id="etitle" name='etitle' minLength={3} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" value={note.edescription} id="edescription" name='edescription' minLength={5} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" value={note.etag} id="etag" name='etag' minLength={3} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<3 || note.edescription.length <5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row my-3'>
                <h1>Your notes</h1>
                {notes.map((note) => {
                    return <NoteItems key={note._id} updateNote={updateNote} note={note} />;
                })}
            </div>
        </>
    );
}

export default Notes;
