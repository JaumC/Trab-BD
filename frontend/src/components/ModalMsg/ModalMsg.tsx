import './ModalMsg.css'

interface ModalMsgProps{
    msg: string;
    state: boolean;
}

export function ModalMsg({ msg, state }: ModalMsgProps){
    return(
        <div className='modal-msg'>
            <img src={state ? "src/assets/check.svg" : "src/assets/wrong.svg"} alt="" />
            <p>{msg}</p>
        </div>
    )
}