import Helper from "../Config/Helper";

const BasicSelect = ({ label = "", placeholder=label, value, onChange, required = false, error="", options = [], isObject = false, optionValue = '', optionLabel = '', style = {}, iscustom = false, isSmall = false, showError = true }) => {
    return (
        <div className={`fv-row ${iscustom ? "" : "mb-3"}`}>
            {label && <label className={`fw-semibold ${isSmall ? 'fs-10' : 'fs-6'} mb-2 ${required ? 'required' : ''}`}>{label}</label>}
            <select style={style} className={`form-control form-control-solid mb-3 mb-lg-0 ${isSmall ? 'fs10' : ''}`} value={value} onChange={onChange}>
                <option value={''} selected disabled>Choose {placeholder}</option>
                {options.map((option, index) => isObject ? <option key={index} value={option[optionValue]}>{option[optionLabel]}</option> : <option key={index} value={option}>{Helper.convertOption(option)}</option>)}
            </select>
            {showError && <small className="error">{error}</small>}
        </div>
    )
}

export default BasicSelect;