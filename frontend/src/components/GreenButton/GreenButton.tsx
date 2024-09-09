import './GreenButton.css'

interface GreenButtonProps {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
}

export function GreenButton({label, onClick, type = 'button'}: GreenButtonProps){
    return(
        <button className="greenButton" onClick={onClick} type={type}>
            {label}
        </button>
    );
}