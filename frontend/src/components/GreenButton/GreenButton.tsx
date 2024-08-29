import './GreenButton.css'

interface GreenButtonProps {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>; 
}

export function GreenButton({label, onClick}: GreenButtonProps){
    return(
        <button className="greenButton" onClick={onClick}>
            {label}
        </button>
    );
}