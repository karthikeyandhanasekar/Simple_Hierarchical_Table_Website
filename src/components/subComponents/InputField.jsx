import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation

const InputField = ({ type, placeholder, onChange, inputValue, className }) => {

  return (
    <input
      type="number"
      className={`form-control interactive-input ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      value={inputValue}
      inputMode="numeric"
    />
  );
};

// 🛠️ PropTypes Validation
InputField.propTypes = {
  type: PropTypes.string, // e.g., "text", "email", "password"
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired, // Function required to handle input change
  inputValue: PropTypes.number, // Controlled input value
  className: PropTypes.string, // Optional additional styling
};

// 🏷️ Default Props
InputField.defaultProps = {
  type: "number",
  placeholder: "Enter number...",
  inputValue: 0,
  className: "",
};

export default InputField;
