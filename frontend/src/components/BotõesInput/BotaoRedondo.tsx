import React, { useState } from 'react';
import './Botao.css';

function RadioButtons({ options, setParentState }) {
  
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setParentState(event.target.value);
  };

  const renderRadioButtons = () => {
    return options.map((option, index) => (
      <label key={index} className="radioLabel">
        <input
          type="radio"
          value={option}
          checked={selectedValue === option}
          onChange={handleChange}
          className="radioInput circular"
          
        />
        {option}
      </label>
    ));
  };

  return (
    <div className='radioGroup'>
      {renderRadioButtons()}
    </div>
  );
}

export default RadioButtons;