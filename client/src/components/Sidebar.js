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
            inputRef.current.selectionStart = props.searchSelectionStart
            inputRef.current.selectionEnd = props.searchSelectionEnd
        }
        // eslint-disable-next-line
    }, [props.tempSearchText])

    // useEffect(() => {
    //     if (props.tempSearchText || props.searchBarFocus) {
    //         inputRef.current.focus()
    //     }
    //     // eslint-disable-next-line
    // }, [props.tempSearchText])

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
    // onChange={(event) => props.setTempSearchText(event.target.value)} 
    return (
        <section className="pane sidebar">
            <div className="sidebar-header">
                <div className="search-box">
                    <input ref={inputRef} type="text" value={props.tempSearchText} placeholder="Search..." onChange={() => ""}
                        onClick={() => {
                            props.setSearchBarFocus(true)
                            props.setTextAreaFocus(false)
                        }}
                        onKeyUp={(e) => {
                            const { selectionStart, selectionEnd } = e.target
                            if (!e.ctrlKey && String.fromCharCode(e.key).toLowerCase() === "a") {
                                if (e.key.length == 1) {
                                    e.preventDefault()
                                    props.setSearchSelectionStart(selectionStart + 1)
                                    props.setSearchSelectionEnd(selectionEnd + 1)
                                    props.setTempSearchText(props.tempSearchText.substring(0, selectionStart) + e.key + props.tempSearchText.substring(selectionEnd))
                                } else if (e.key == "Backspace") {
                                    e.preventDefault()
                                    props.setSearchSelectionStart(selectionStart - 1)
                                    props.setSearchSelectionEnd(selectionEnd - 1)
                                    props.setTempSearchText(props.tempSearchText.substring(0, selectionStart - 1) + props.tempSearchText.substring(selectionEnd))
                                } else if (e.key == "Tab") {
                                    e.preventDefault()
                                    props.setSearchSelectionStart(selectionStart + 5)
                                    props.setSearchSelectionEnd(selectionEnd + 5)
                                    props.setTempSearchText(props.tempSearchText.substring(0, selectionStart) + "     " + props.tempSearchText.substring(selectionEnd))
                                } else if (e.key == "Enter") {
                                    e.preventDefault()
                                    props.setTempSearchText(props.tempSearchText.substring(0, selectionStart) + props.tempSearchText.substring(selectionEnd))
                                }
                            }
                        }}
                    />
                </div>
                <div className="filter-button">
                    <img src="filter-button.png" alt="filter" />
                    <div className="filter-options">
                        <fieldset>
                            <div id="line"></div>
                            <legend>Sort:</legend>
                            <input type="radio" name="Sort" id="asc" onClick={(event) => processFilter(event)} checked={props.filterChecked} onChange={() => ""} />
                            <label htmlFor="asc"> Oldest First</label>
                            <br />
                            <input type="radio" name="Sort" id="desc" onClick={(event) => processFilter(event)} checked={!props.filterChecked} onChange={() => ""} />
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