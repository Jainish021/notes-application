import { useEffect, useState, useRef } from "react"

export default function Sidebar(props) {
    const [pageNum, setPageNum] = useState(1)
    const maxPages = Math.ceil(props.totalNotes / props.notesPerPage)
    const inputRef = useRef(null)

    useEffect(() => {
        setPageNum(props.currentPage)
    }, [props.currentPage])

    useEffect(() => {
        if (props.tempSearchText || props.searchBarFocus) {
            inputRef.current.focus()
        }
        // eslint-disable-next-line
    }, [props.tempSearchText])

    function processNoteSelection(id) {
        props.setCurrentNoteId(id)
        if (props.setSidebarVisibility) {
            props.setSidebarVisibility(false)
        }
    }

    const noteElements = props.notes.map((note, index) => (
        <div key={note._id}>
            <div
                className={`title ${note._id === props.currentNote._id ? "selected-note" : ""}`}
                onClick={() => { processNoteSelection(note._id) }}>
                <h4 className="text-snippet">{note.description.split("\n")[0]}</h4>
                <button
                    className="delete-btn"
                    onClick={(event) => props.deleteNote(event, note._id)}>
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    function Pagination() {
        return (
            <div className="pagination">
                <button className="pagination-button" onClick={() => (props.setCurrentPage(prevPage => prevPage - 1))} disabled={pageNum === 1} >
                    {"<"}
                </button>
                <div>
                    <input type="number" className="pagination-input" min="1" max={maxPages} value={pageNum} onChange={(event) => setPageNum(event.target.value)} onKeyUp={(event) => event.key === "Enter" && pageNum <= maxPages ? props.setCurrentPage(pageNum) : ""} /> / {maxPages}
                </div>
                <button className="pagination-button" onClick={() => (props.setCurrentPage(prevPage => prevPage + 1))} disabled={pageNum === maxPages}>
                    {">"}
                </button>
            </div>
        )
    }

    function processFilter(event) {
        if (event.target.id === "asc") {
            props.setSortBy("asc")
            props.setFilterChecked(true)
        } else {
            props.setSortBy("desc")
            props.setFilterChecked(false)
        }
    }

    return (
        <section className="pane sidebar">
            <div className="sidebar-header">
                <div className="search-box">
                    <input ref={inputRef} type="text" value={props.tempSearchText} placeholder="Search..." onChange={(event) => props.setTempSearchText(event.target.value)} onClick={() => { props.setSearchBarFocus(true) }} />
                </div>
                <div className="filter-button">
                    <img src="filter-button.png" alt="filter" />
                    <div className="filter-options">
                        <fieldset>
                            <div id="line"></div>
                            <legend>Sort:</legend>
                            <input type="radio" name="Sort" id="asc" onClick={(event) => processFilter(event)} checked={props.filterChecked} />
                            <label htmlFor="asc"> Oldest First</label>
                            <br />
                            <input type="radio" name="Sort" id="desc" onClick={(event) => processFilter(event)} checked={!props.filterChecked} />
                            <label htmlFor="desc"> Newest First</label>
                        </fieldset>
                    </div>
                </div>
                <button className="new-note" onClick={props.newNote}>+</button>
                {props.setSidebarVisibility && <button className="cancel-button" onClick={() => props.setSidebarVisibility(false)}>&#10539;</button>}
            </div>
            {noteElements.slice(0, props.notesPerPage)}
            {maxPages > 1 && <Pagination />}
        </section>
    )
}