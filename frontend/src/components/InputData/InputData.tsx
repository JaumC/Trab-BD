import './InputData.css'

interface InputDataProps {
    name: string;
    type: string;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>; 
    value?: string; 
}

export function InputData({name, type, placeholder, onChange, value}: InputDataProps){
    return(
        <input 
            className='inputs-forms'
            name={name} 
            type={type} 
            placeholder={placeholder} 
            onChange={onChange} 
            value={value}
        />
    );
}