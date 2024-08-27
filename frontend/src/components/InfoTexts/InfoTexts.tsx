import './InfoTexts.css'

interface InputTextsProps{
    label: string;
    text: string;
}

export function InfoTexts({label, text}: InputTextsProps){
    return(
        <>
            <p className='label'>{label}</p>
            <p className='dado'>{text}</p>
        </>
    )
}