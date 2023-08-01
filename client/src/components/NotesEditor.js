import { useRef } from "react"
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from "draftjs-to-html"


export default function NotesEditor(props) {
    const editorRef = useRef(null)


    function handleEditorChange(newState) {
        props.setEditorState(newState)
        props.setTempNoteText(draftToHtml(convertToRaw(newState.getCurrentContent())))
        if (!props.textAreaFocus) {
            props.setTextAreaFocus(true)
            props.setSearchBarFocus(false)
        }
        if (!newState.getSelection().hasFocus) {
            props.setTextAreaFocus(false)
            props.setSearchBarFocus(true)
        }
    }


    return (
        <section className="pane editor">
            <Editor
                editorRef={(ref) => {
                    editorRef.current = ref
                }}
                editorState={props.editorState}
                toolbarClassName="editor-toolbar"
                onEditorStateChange={(newState) => handleEditorChange(newState)}
            />
        </section >
    )
}