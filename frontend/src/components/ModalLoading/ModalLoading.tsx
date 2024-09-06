import React from 'react';
import { ClipLoader } from 'react-spinners';  // Importando o Spinner
import './ModalLoading.css';  // Arquivo CSS para os estilos

interface ModalLoadingProps {
    spinner: boolean;
    color?: string;
}

export default function ModalLoading({ spinner, color="#ffd358" }: ModalLoadingProps) {
    if (!spinner) return null;  // Se o spinner for falso, retorna null

    return (
        <div className="modal-container">
            <div className="modal-content">
                <ClipLoader color={color} loading={spinner} size={50} />
            </div>
        </div>
    );
}