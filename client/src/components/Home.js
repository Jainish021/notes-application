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
    const [tempSearchText, setTempSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalNotes, setTotalNotes] = useState(0)
    const [sortBy, setSortBy] = useState("desc")
    const [searchText, setSearchText] = useState("")
    const [searchBarFocus, setSearchBarFocus] = useState(false)
    const [textAreaFocus, setTextAreaFocus] = useState(true)
    const [selectionStart, setSelectionStart] = useState("")
    const [selectionEnd, setSelectionEnd] = useState("")
    const [searchSelectionStart, setSearchSelectionStart] = useState("")
    const [searchSelectionEnd, setSearchSelectionEnd] = useState("")
    const [notesStatus, setNotesStatus] = useState(false)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [sidebarVisibility, setSidebarVisibility] = useState(false)
    const [filterChecked, setFilterChecked] = useState(false)
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
        function handleResize() {
            setScreenWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

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
            }, 1000)
            return () => clearTimeout(timeoutId)
        }
        // eslint-disable-next-line
    }, [tempNoteText])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchText(tempSearchText)
        }, 500)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line
    }, [tempSearchText])

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
            setNotesStatus(true)
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

    function HomePage() {
        if (notesStatus) {
            if (screenWidth > 1000) {
                return (
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
                            tempSearchText={tempSearchText}
                            setTempSearchText={setTempSearchText}
                            searchBarFocus={searchBarFocus}
                            setSearchBarFocus={setSearchBarFocus}
                            filterChecked={filterChecked}
                            setFilterChecked={setFilterChecked}
                            setTextAreaFocus={setTextAreaFocus}
                            searchSelectionStart={searchSelectionStart}
                            setSearchSelectionStart={setSearchSelectionStart}
                            searchSelectionEnd={searchSelectionEnd}
                            setSearchSelectionEnd={setSearchSelectionEnd}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                            textAreaFocus={textAreaFocus}
                            setTextAreaFocus={setTextAreaFocus}
                            setSearchBarFocus={setSearchBarFocus}
                            selectionStart={selectionStart}
                            setSelectionStart={setSelectionStart}
                            selectionEnd={selectionEnd}
                            setSelectionEnd={setSelectionEnd}
                        />
                    </Split>
                )
            } else {
                if (sidebarVisibility) {
                    return (
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
                            tempSearchText={tempSearchText}
                            setTempSearchText={setTempSearchText}
                            searchBarFocus={searchBarFocus}
                            setSearchBarFocus={setSearchBarFocus}
                            setSidebarVisibility={setSidebarVisibility}
                            filterChecked={filterChecked}
                            setFilterChecked={setFilterChecked}
                            setTextAreaFocus={setTextAreaFocus}
                            searchSelectionStart={searchSelectionStart}
                            setSearchSelectionStart={setSearchSelectionStart}
                            searchSelectionEnd={searchSelectionEnd}
                            setSearchSelectionEnd={setSearchSelectionEnd}
                        />
                    )
                } else {
                    return (
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                            textAreaFocus={textAreaFocus}
                            setTextAreaFocus={setTextAreaFocus}
                            setSearchBarFocus={setSearchBarFocus}
                            selectionEnd={selectionEnd}
                            setSelectionEnd={setSelectionEnd}
                        />
                    )
                }
            }
        } else {
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
    }

    return (
        <>
            <Header
                setSidebarVisibility={setSidebarVisibility} />
            <main>
                <HomePage />
            </main>
        </>
    )
}