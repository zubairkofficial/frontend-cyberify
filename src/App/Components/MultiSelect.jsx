import React, { useState } from 'react';

const MultiSelect = ({
  label = "",
  placeholder = label,
  value = [],
  onChange,
  required = false,
  error = "",
  options = [],
  isObject = false,
  optionValue = 'id',  // ID will be the value
  optionLabel = 'name', // Name will be displayed
  style = {},
  iscustom = false,
  isSmall = false,
  showError = true,
}) => {
  const [isOpen, setIsOpen] = useState(false); // For toggling dropdown visibility

  const handleSelectChange = (selectedValues) => {
    onChange(selectedValues); // Update the selected values
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the dropdown visibility
  };

  const containerStyle = {
    marginBottom: '1rem',
    position: 'relative',
    ...style, // Allow for any custom styles to be passed
  };

  const selectBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '5px',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    position: 'relative',
  };

  const selectedOptionsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
  };

  const selectedTagStyle = {
    backgroundColor: '#d3d3d3',  // Light grey for the selected tags
    padding: '3px 10px',
    marginRight: '5px',
    borderRadius: '20px',
    fontSize: '12px',
    marginBottom: '5px',
    opacity: 0.8,  // Slightly transparent to create the "off" effect
  };

  const dropdownIconStyle = {
    marginLeft: 'auto',
    cursor: 'pointer',
  };

  const dropdownListStyle = {
    position: 'relative',
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    marginTop: '5px',
    maxHeight: '300px', // Max height of dropdown to avoid overflowing
    overflowY: 'auto', // Allow scrolling if dropdown exceeds max height
  };

  const placeholderStyle = {
    color: '#aaa',
    fontStyle: 'italic',
  };

  return (
    <div className={`fv-row ${iscustom ? "" : "mb-3"}`} style={containerStyle}>
      {label && (
        <label
          className={`fw-semibold ${isSmall ? 'fs-10' : 'fs-6'} mb-2 ${required ? 'required' : ''}`}
        >
          {label}
        </label>
      )}

      {/* Display the selected options as tags inside the input field */}
      <div
        className={`custom-select-box ${isSmall ? 'fs10' : ''}`}
        onClick={toggleDropdown}
        style={selectBoxStyle}
      >
        <div style={selectedOptionsStyle}>
          {value.length > 0 ? (
            value.map((val, index) => {
              const selectedOption = options.find(option => option[optionValue] === val);
              return selectedOption ? (
                <span key={index} style={selectedTagStyle}>
                  {selectedOption[optionLabel]}
                </span>
              ) : null;  // Handle case where no option is found
            })
          ) : (
            <span style={placeholderStyle}>{placeholder}</span>
          )}
        </div>
        <span style={dropdownIconStyle}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown for options */}
      {isOpen && (
        <div style={dropdownListStyle}>
          <div style={dropdownListStyle}>
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={index}
                  className="dropdown-option"
                  onClick={() => {
                    const updatedValue = value.includes(option[optionValue])
                      ? value.filter(v => v !== option[optionValue])
                      : [...value, option[optionValue]];
                    handleSelectChange(updatedValue); // Update selected values
                  }}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  {option[optionLabel]}
                </div>
              ))
            ) : (
              <div style={{ padding: '8px', color: '#aaa' }}>No use cases available</div>
            )}
          </div>
        </div>
      )}

      {showError && <small className="error">{error}</small>}
    </div>
  );
};

export default MultiSelect;
