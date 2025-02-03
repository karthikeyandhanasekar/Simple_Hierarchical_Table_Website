import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation

const Button = ({
  name,
  onClick,
  className = "btn-primary",
  disabled = false,
}) => {
  return (
    <button
      className={`btn ${className} interactive-btn`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

// 🛠️ PropTypes Validation
Button.propTypes = {
  name: PropTypes.string.isRequired, // Name is required and must be a string
  onClick: PropTypes.func.isRequired, // onClick must be a function
  className: PropTypes.string, // Optional: Custom Bootstrap class
  disabled: PropTypes.bool, // Optional: Disabled state
};

// 🏷️ Default Props
Button.defaultProps = {
  className: "btn-primary", // Default to primary button
  disabled: false,
};
export default Button;
