import { useState } from 'react';
import './Botao.css';

function BotaoQuadrado({ options, setParentState, columns }) {
  const [selectedValue, setSelectedValue] = useState([]);

  const handleChange = (event) => {
    const newValue = event.target.value;
        setSelectedValue(newValue); // Atualiza o estado interno com o novo valor selecionado
        setParentState(newValue); // Atualiza o estado no componente pai
  };

  const renderRadioButtons = () => {
    return options.map((option, index) => (
      <label key={index} className="radioLabel" style={{ '--columns': columns }}>
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