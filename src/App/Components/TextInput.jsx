const TextInput = ({ label = "", placeholder=label, value, onChange, required = false, password = false, error="", type = "text", isTextArea = false, rows=5, ref = null, hint = "" }) => {
    return (
        <div class="fv-row mb-1">
            {label && <label class={`fw-semibold fs-6 mb-2 ${required ? 'required' : ''}`}>{label} <small>{hint}</small></label>}
            {
                isTextArea ? 
                <textarea class="form-control form-control-solid mb-3 mb-lg-0" rows={rows} placeholder={placeholder} value={value} onChange={onChange}></textarea> : 
                <input ref={ref} type={password ? "password" : type} class="form-control form-control-solid mb-3 mb-lg-0" placeholder={placeholder} value={value} onChange={onChange} />
            }
            <small className="error">{error}</small>
        </div>
    )
}

export default TextInput;