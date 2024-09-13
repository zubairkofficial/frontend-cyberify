import { useState, useRef } from 'react';

const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  }

  return (
    <>
      <button className="btn-dropdown" onClick={toggleDropdown}><i className="fa-light fa-bars"></i></button>
      {isOpen && (
        <div className="card dropdown" ref={dropdownRef} onMouseLeave={hideDropdown} style={{ zIndex: 999 }}>
          {children}
        </div>
      )}
    </>
  );
};

export default Dropdown;