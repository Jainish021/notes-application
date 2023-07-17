import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Split from "react-split"
import Sidebar from "../components/Sidebar"
import Editor from "../components/Editor"
import Header from "../components/Header"
import "../css/style.css"
import axios from "axios"


export default function Home() {
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = token
    const navigate = useNavigate()
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNoteText, setTempNoteText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalNotes, setTotalNotes] = useState(0)
    const [sortBy, setSortBy] = useState("desc")
    const [searchText, setSearchText] = useState("")
    const [notesStatus, setNotesStatus] = useState(false)
    const notesPerPage = 13

    useEffect(() => {
        function RedirectToLogin() {
            navigate("/login", { replace: false })
            return
        }

        if (!token) {
            RedirectToLogin()
        }

        const fetchData = async () => {
            try {
                const tasksData = await axios.get(`/tasks?sortBy=updatedAt:${sortBy}&limit=${notesPerPage}&skip=${(currentPage - 1) * notesPerPage}&search=${searchText}`).then(res => res.data)
                setNotes(tasksData.tasks)
                setCurrentNoteId(tasksData.tasks[0]?._id)
                setTotalNotes(tasksData.totalTasks)
                if (tasksData.totalTasks > 0) {
                    setNotesStatus(true)
                }
            } catch (e) {
                RedirectToLogin()
            }
        }
        token && fetchData()
        // eslint-disable-next-line
    }, [navigate, currentPage, sortBy, searchText])

    useEffect(() => {
        if (currentNoteId) {
            setTempNoteText(findCurrentNote().description)
        }
        // eslint-disable-next-line
    }, [currentNoteId])

    useEffect(() => {
        if (currentNoteId) {
            const timeoutId = setTimeout(() => {
                updateNote(tempNoteText)
            }, 500)
            return () => clearTimeout(timeoutId)
        }
        // eslint-disable-next-line
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            description: "# Type your note title here. Followed by the note.",
            completed: false
        }
        try {
            const resData = await axios.post("/tasks", newNote).then(res => res.data)
            setCurrentNoteId(resData._id)
            setNotes(prevNotes => [resData, ...prevNotes])
            setTotalNotes(prevTotal => prevTotal + 1)
        } catch (e) {
            console.log("error")
        }
    }

    async function updateNote(text) {
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
        setCurrentNoteId(findCurrentNote()._id)
        try {
            await axios.patch(`/tasks/${currentNoteId}`, {
                description: text
            })
            // console.log("Update successful!")
        } catch (e) {
            // console.log("Update failed!")
        }
    }

    async function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter(note => note._id !== noteId))
        try {
            await axios.delete(`/tasks/${noteId}`)
            setTotalNotes(prevTotal => prevTotal - 1)
            // console.log("Deletion successful!")
        } catch (e) {
            // console.log("Deletion failed!")
        } finally {
            setCurrentNoteId(findCurrentNote()?._id)
        }
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note._id === currentNoteId
        }) || notes[0]
    }

    return (
        <>
            <Header />
            <main>
                {
                    notesStatus
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
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalNotes={totalNotes}
                                notesPerPage={notesPerPage}
                                setSortBy={setSortBy}
                                setSearchText={setSearchText}
                            />
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
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