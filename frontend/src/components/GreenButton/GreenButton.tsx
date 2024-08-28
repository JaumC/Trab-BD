import './GreenButton.css'

interface GreenButtonProps {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>; 
    color: string; //Add a color prop
}

export function GreenButton({label, onClick, color}: GreenButtonProps){
    return(
        <button className="greenButton" onClick={onClick}>
            {label}
        </button>
    );
}