import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({label = "", value, onChange, required = false, hint = "", error = ""}) => {
    return (
        <div style={{ marginBottom: 65 }}>
            <div style={{ marginBottom: 0 }}>
                {label && <label class={`fw-semibold fs-6 mb-2 ${required ? 'required' : ''}`}>{label} <small>{hint}</small></label>}
                <ReactQuill theme="snow" style={{ height: 300 }} value={value} onChange={onChange} />
            </div>
            <small className="error" style={{ marginTop: 45, position: 'absolute' }}>{error}</small>
        </div>
    )
}

export default QuillEditor;