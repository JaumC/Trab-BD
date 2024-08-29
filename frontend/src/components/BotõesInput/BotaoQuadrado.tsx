import { useState } from 'react';
import './Botao.css';

function BotaoQuadrado({ options, setParentState, columns }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setParentState(event.target.value);
  };

  const renderRadioButtons = () => {
    return options.map((option, index) => (
      <label key={index} className="radioLabel"
      style={{ '--columns': columns }}>
        <input
          type="checkbox"
          value={option}
          checked={selectedValue === option}
          onChange={handleChange}
          className="radioInput square"
        />
        {option}
      </label>
    ));
  };

  return (
    <div className='radioGroup'
    style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '7px' }}
    >
      {renderRadioButtons()}
    </div>
  );
}

export default BotaoQuadrado;