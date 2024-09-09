import React,{ useState } from 'react';
import './Button.css'; // Este é o arquivo CSS que contém os estilos

import { FaPencilAlt, FaCheck } from 'react-icons/fa'; // Ícones para edição e confirmação

interface EditButtonProps {
    onClick: () => void;
    modoEdicao: boolean;
}

function EditButton({onClick, modoEdicao}:EditButtonProps) {

    const handleClick = () => {
        if (modoEdicao) {
            const form = document.querySelector('form');
            if (form){
                form.requestSubmit();
            }
        }
        onClick();
    };

    return (
        <button className="edit-button" onClick={handleClick}>
           {modoEdicao ? <FaCheck size={16} /> : <FaPencilAlt size={16} />}
        </button>
    );
}

export default EditButton;