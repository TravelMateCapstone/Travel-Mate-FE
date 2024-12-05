import React, { useState } from "react";
import "../../assets/css/Shared/Switch.css";

const Switch = ({ isOn, handleToggle }) => {
  const [checked, setChecked] = useState(isOn);

  const handleChange = () => {
    setChecked(!checked);
    handleToggle(!checked);
  };

  return (
    <div className="switch-container">
      <input
        checked={checked}
        onChange={handleChange}
        className="switch-checkbox"
        id={`switch-new`}
        type="checkbox"
      />
      <label
        className="switch-label"
        htmlFor={`switch-new`}
      >
        <span className={`switch-button`} />
      </label>
    </div>
  );
};

export default Switch;
