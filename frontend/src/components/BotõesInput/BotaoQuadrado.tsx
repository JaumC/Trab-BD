import { useState } from 'react';
import './Botao.css';

// Definição dos tipos para os props do componente
interface BotaoQuadradoProps {
  options: string[];
  setParentState: (values: string[]) => void;
  columns: number;
}

function BotaoQuadrado({ options, setParentState, columns }: BotaoQuadradoProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    let updatedValues: string[];

    if (selectedValues.includes(newValue)) {
      // Se a opção já está selecionada, removê-la da lista
      updatedValues = selectedValues.filter(value => value !== newValue);
    } else {
      // Se a opção não está selecionada, adicioná-la à lista
      updatedValues = [...selectedValues, newValue];
    }

    setSelectedValues(updatedValues); // Atualiza o estado interno com os valores selecionados
    setParentState(updatedValues); // Atualiza o estado no componente pai com os valores selecionados
  };

  const renderCheckboxes = () => {
    return options.map((option, index) => (
      <label key={index} className="radioLabel" style={{ '--columns': columns } as React.CSSProperties}>
        <input
          type="checkbox"
          value={option}
          checked={selectedValues.includes(option)}
          onChange={handleChange}
          className="radioInput square"
        />
        {option}
      </label>
    ));
  };

  return (
    <div
      className='radioGroup'
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '7px' } as React.CSSProperties}
    >
      {renderCheckboxes()}
    </div>
  );
}

export default BotaoQuadrado;
