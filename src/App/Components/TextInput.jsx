const TextInput = ({ label = "", placeholder=label, value, onChange, required = false, password = false, error="", type = "text", isTextArea = false, rows=5, ref = null, hint = "" }) => {
    return (
        <div className="fv-row mb-1">
            {label && <label className={`fw-semibold fs-6 mb-2 ${required ? 'required' : ''}`}>{label} <small>{hint}</small></label>}
            {
                isTextArea ? 
                <textarea className="form-control form-control-solid mb-3 mb-lg-0" rows={rows} placeholder={placeholder} value={value} onChange={onChange}></textarea> : 
                <input ref={ref} type={password ? "password" : type} className="form-control form-control-solid mb-3 mb-lg-0" placeholder={placeholder} value={value} onChange={onChange} />
            }
            <small className="error">{error}</small>
        </div>
    )
}

export default TextInput;