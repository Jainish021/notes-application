import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Split from "react-split"
import Sidebar from "../components/Sidebar"
import Editor from "../components/Editor"
import Header from "../components/Header"
import "../css/style.css"


export default function Home() {
    let token = ""
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState("")
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [newNote, setNewNote] = useState("")
    const [updNote, setUpdNote] = useState(false)
    const [delNote, setDelNote] = useState("")

    useEffect(() => {
        // eslint-disable-next-line
        token = localStorage.getItem('token')
        if (!token) {
            navigate("/login", { replace: true })
        }

        const fetchUserDetails = async () => {
            const userData = await fetch("/users/me", {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(response => response.json())
            if (userData.error) {
                navigate("/login", { replace: true })
            }
            setUserDetails(userData)
        }
        fetchUserDetails()

        const fetchData = async () => {
            const tasksData = await fetch("/tasks?sortBy=createdAt:desc", {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(response => response.json())
            if (tasksData.error) {
                navigate("/login", { replace: true })
            }
            setNotes(tasksData)
            setCurrentNoteId(tasksData[0]?._id)
        }
        fetchData()
    }, [])

    function createNewNote() {
        setNewNote({
            description: "# Type your note title here. Followed by the note.",
            completed: false
        })
    }

    useEffect(() => {
        const postData = async () => {
            console.log(newNote)
            const resData = await fetch("/tasks", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
                "body": JSON.stringify(newNote)
            }).then(response => response.json())
            if (resData.error) {

            }
            if (resData._id) {
                setCurrentNoteId(resData._id)
                setNotes(prevNotes => [resData, ...prevNotes])
            }
        }
        if (newNote) {
            postData()
        }
    }, [newNote])

    function updateNote(text) {
        setNotes(oldNotes => {
            const newNotesArray = []
            for (let i = 0; i < oldNotes.length; i++) {
                const note = oldNotes[i]
                if (note._id === currentNoteId) {
                    newNotesArray.unshift({ ...note, description: text })
                } else {
                    newNotesArray.push(note)
                }
            }
            return newNotesArray
        })
        setUpdNote(true)
        setCurrentNoteId(findCurrentNote()._id)
    }

    useEffect(() => {
        const updateData = async () => {
            const resData = await fetch(`/tasks/${currentNoteId}`, {
                "method": "PATCH",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
                "body": JSON.stringify({
                    description: findCurrentNote().description
                })
            }).then(response => response.json())
            //Add eror handling
            if (resData.error) {

            }
            // console.log(resData)
        }
        if (findCurrentNote() && updNote) {
            updateData()
        }
        // eslint-disable-next-line
    }, [updNote])

    function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter(note => note._id !== noteId))
        setDelNote(noteId)
    }

    useEffect(() => {
        const updateData = async () => {
            const resData = await fetch(`/tasks/${delNote}`, {
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            }).then(response => response.json())
            //Add eror handling
            if (resData.error) {

            }
            // console.log(resData)
        }
        if (findCurrentNote()) {
            updateData()
        }
        // eslint-disable-next-line
    }, [delNote])

    function findCurrentNote() {
        return notes.find(note => {
            return note._id === currentNoteId
        }) || notes[0]
    }

    return (
        <>
            <Header userDetails={userDetails} />
            <main>
                {
                    notes.length > 0
                        ?
                        <Split
                            sizes={[20, 80]}
                            direction="horizontal"
                            className="split">
                            <Sidebar
                                notes={notes}
                                currentNote={findCurrentNote()}
                                setCurrentNoteId={setCurrentNoteId}
                                newNote={createNewNote}
                                deleteNote={deleteNote}
                            />
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote}
                            />
                        </Split>
                        :
                        <div className="no-notes">
                            <h1>You have no notes</h1>
                            <button
                                className="first-note"
                                onClick={createNewNote}
                            >
                                Create one now
                            </button>
                        </div>
                }
            </main>
        </>
    )
}