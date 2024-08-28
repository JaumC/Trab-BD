import React, { useState } from 'react';
import './BotaoRedondo.css';

function RadioButtons({ options, setParentState }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setParentState(event.target.value);
  };

  const renderRadioButtons = () => {
    return options.map((option, index) => (
      <label key={index}>
        <input
          type="radio"
          value={option}
          checked={selectedValue === option}
          onChange={handleChange}
        />
        {option}
      </label>
    ));
  };

  return (
    <div>
      {renderRadioButtons()}
    </div>
  );
}

export default RadioButtons;