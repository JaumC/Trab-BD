import React, { useState } from 'react';
import './Botao.css';

// Definição dos tipos para os props do componente
interface RadioButtonsProps {
  options: string[];
  setParentState: (value: string) => void;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ options, setParentState }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    setParentState(value);
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
};

export default RadioButtons;
