import ReactSelect from "react-select";


const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? '#FFFFFF' : '#000000',
        backgroundColor: state.isSelected ? '#F57C00' : state.isFocused ? '#F9F9F9' : 'transparent',
        ':active': {
            ...provided[':active'],
            backgroundColor: state.isSelected ? '#F57C00' : '#F9F9F9',
        },
    }),
};

const SearchSelect = ({ label = "", placeholder=label, value, onChange, required = false, error="", options = [], iscustom, style = {} }) => {
    return (
        <div class={`fv-row ${iscustom ? "" : "mb-3"}`}>
            {label && <label class={`fw-semibold fs-6 mb-2 ${required ? 'required' : ''}`}>{label}</label>}
            <ReactSelect styles={customStyles} placeholder={placeholder} value={value} options={options} onChange={onChange} />
            {/* <select class="form-control form-control-solid mb-3 mb-lg-0" value={value} onChange={onChange}>
                <option value={''} selected disabled>Choose {placeholder}</option>
                {options.map((option, index) => isObject ? <option key={index} value={option[optionValue]}>{option[optionLabel]}</option> : <option key={index} value={option}>{Helper.convertOption(option)}</option>)}
            </select> */}
            <small className="error">{error}</small>
        </div>
    )
}

export default SearchSelect;