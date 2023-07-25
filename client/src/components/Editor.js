import { useState, useRef, useEffect } from "react"
import ReactMde from "react-mde"
import Showdown from "showdown"
import "react-mde/lib/styles/css/react-mde-all.css";


export default function Editor(props) {
    const [selectedTab, setSelectedTab] = useState("write")
    const inputRef = useRef(null)

    useEffect(() => {
        if (props.textAreaFocus) {
            inputRef.current.focus()
            var temp_value = inputRef.current.value
            inputRef.current.value = ''
            inputRef.current.value = temp_value
        }
        // eslint-disable-next-line
    }, [props.tempNoteText])

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