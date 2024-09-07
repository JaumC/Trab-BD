import './ModalConfirm.css';

export function ModalConfirm({ show, onConfirm, onCancel, label }) {
    if (!show) {
        return null
    }

    return (
        <div className="modal-overlay">
            <div className="modal-confirm">
                <h2>{label}</h2>
                <p>Tem certeza de que deseja realizar esta ação?</p>
                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
                    <button className="btn-confirm" onClick={onConfirm}>Sim</button>
                </div>
            </div>
        </div>
    );
}
