import { useState, useRef, useEffect } from "react"
import ReactMde from "react-mde"
import Showdown from "showdown"
import "react-mde/lib/styles/css/react-mde-all.css";


export default function Editor(props) {
    const [selectedTab, setSelectedTab] = useState("write")
    const inputRef = useRef(null)

    useEffect(() => {
        if (props.textAreaFocus) {
            if (!props.selectionStart) {
                inputRef.current.focus()
                var temp_value = inputRef.current.value
                inputRef.current.value = ''
                inputRef.current.value = temp_value
            }
            else {
                inputRef.current.focus()
                inputRef.current.selectionStart = props.selectionStart
                inputRef.current.selectionEnd = props.selectionEnd
            }
        }
        // eslint-disable-next-line
    }, [props.tempNoteText])

    // useEffect(() => {
    //     if (props.textAreaFocus) {
    //         inputRef.current.focus()
    //         inputRef.current.selectionStart = props.selectionStart
    //         inputRef.current.selectionEnd = props.selectionEnd
    //         // inputRef.current.selectionStart = inputRef.current.selectionEnd = selectionStart + 2
    //         // var temp_value = inputRef.current.value
    //         // inputRef.current.value = ''
    //         // inputRef.current.value = temp_value
    //     }
    //     // eslint-disable-next-line
    // }, [props.tempNoteText])

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    })

    return (
        <section className="pane editor">
            <ReactMde
                childProps={{
                    textArea: {
                        onClick: () => {
                            props.setSearchBarFocus(false)
                            props.setTextAreaFocus(true)
                        },
                        onKeyDown: (e) => {
                            const { selectionStart, selectionEnd } = e.target
                            if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
                                if (e.key.length == 1) {
                                    e.preventDefault()
                                    props.setSelectionStart(selectionStart + 1)
                                    props.setSelectionEnd(selectionEnd + 1)
                                    props.setTempNoteText(props.tempNoteText.substring(0, selectionStart) + e.key + props.tempNoteText.substring(selectionEnd))
                                } else if (e.key == "Backspace") {
                                    e.preventDefault()
                                    props.setSelectionStart(selectionStart - 1)
                                    props.setSelectionEnd(selectionEnd - 1)
                                    props.setTempNoteText(props.tempNoteText.substring(0, selectionStart - 1) + props.tempNoteText.substring(selectionEnd))
                                } else if (e.key == "Tab") {
                                    e.preventDefault()
                                    props.setSelectionStart(selectionStart + 5)
                                    props.setSelectionEnd(selectionEnd + 5)
                                    props.setTempNoteText(props.tempNoteText.substring(0, selectionStart) + "     " + props.tempNoteText.substring(selectionEnd))
                                } else if (e.key == "Enter") {
                                    e.preventDefault()
                                    props.setSelectionStart(selectionStart + 1)
                                    props.setSelectionEnd(selectionEnd + 1)
                                    props.setTempNoteText(props.tempNoteText.substring(0, selectionStart) + "\n" + props.tempNoteText.substring(selectionEnd))
                                }
                            }
                        }
                    }
                }}
                value={props.tempNoteText}
                onChange={props.setTempNoteText}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={81.5}
                heightUnits="vh"
                refs={{
                    textarea: inputRef
                }}
            />
        </section>
    )
}