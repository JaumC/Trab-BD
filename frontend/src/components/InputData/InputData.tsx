import './InputData.css'

interface InputDataProps {
    name: string;
    type: string;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>; 
    value?: string;
    style?: React.CSSProperties;  // Estilo customizável do input
}

export function InputData({name, type, placeholder, onChange, value,style}: InputDataProps){
    return(
        <input 
            className='inputs-forms'
            name={name} 
            type={type} 
            placeholder={placeholder} 
            onChange={onChange} 
            value={value}
            style={style} 
        />
    );
}