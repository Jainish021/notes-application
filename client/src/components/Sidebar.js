import { useEffect, useState } from "react"

export default function Sidebar(props) {
    const [pageNum, setPageNum] = useState(1)
    const maxPages = Math.ceil(props.totalNotes / props.notesPerPage)

    useEffect(() => {
        setPageNum(props.currentPage)
    }, [props.currentPage])

    const noteElements = props.notes.map((note, index) => (
        <div key={note._id}>
            <div
                className={`title ${note._id === props.currentNote._id ? "selected-note" : ""}`}
                onClick={() => props.setCurrentNoteId(note._id)}>
                <h4 className="text-snippet">{note.description.split("\n")[0]}</h4>
                <button
                    className="delete-btn"
                    onClick={(event) => props.deleteNote(event, note._id)}>
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>All Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements.slice(0, props.notesPerPage)}
            <div className="pagination">
                <button className="pagination--button" onClick={() => (props.setCurrentPage(prevPage => prevPage - 1))} disabled={pageNum === 1} >
                    {"<"}
                </button>
                <div>
                    <input type="number" className="pagination--input" min="1" max={maxPages} value={pageNum} onChange={(event) => setPageNum(event.target.value)} onKeyUp={(event) => event.key === "Enter" && pageNum <= maxPages ? props.setCurrentPage(pageNum) : ""} /> / {maxPages}
                </div>
                <button className="pagination--button" onClick={() => (props.setCurrentPage(prevPage => prevPage + 1))} disabled={pageNum === maxPages}>
                    {">"}
                </button>
            </div>
        </section>
    )
}
