import './ModalInfo.css';
import { useEffect, useState } from 'react';
import { api } from '../../axiosConfig';

type ModalConfirmProps = {
    show: boolean;
    onClose: () => void;
    petId: number | null;
};

export function ModalInfo({ show, onClose, petId }: ModalConfirmProps) {
    if (!show) {
        return null;
    }

    const [petData, setPetData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                if (petId !== null) {
                    const response = await api.get(`/animals/info-pets/${petId}`);
                    let petData = response.data.OK;
                    
                    // Itera sobre todas as chaves de petData
                    Object.keys(petData).forEach(key => {
                        // Verifica se o valor é uma string, então aplica a substituição
                        if (typeof petData[key] === 'string') {
                            petData[key] = petData[key].replace(/{|}/g, '');
                        }
                    });
                    
                    setPetData(petData);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching pet data:', err);
                setError(err.response ? err.response.data.DENY : 'Erro ao buscar dados do pet');
                setLoading(false);
            }
        };

        fetchPetData();
    }, [petId]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!petData) {
        return <div>Pet não encontrado</div>;
    }

    return (
        <div className="modal-overlay-info">
            <div className="modal-confirm-info">
                <div className='top-modal-info'>
                    <h1>Informações do Pet</h1>
                    <button onClick={onClose}>X</button>
                </div>
                <p><span className="infoLabel">Nome:</span> {petData.nomeAnimal}</p>
                <p><span className="infoLabel">Sexo:</span> {petData.sexo}</p>
                <p><span className="infoLabel">Espécie:</span> {petData.especie}</p>
                <p><span className="infoLabel">Porte:</span> {petData.porte}</p>
                <p><span className="infoLabel">Idade:</span> {petData.idade}</p>
                <p><span className="infoLabel">Temperamento:</span> {petData.temperamento}</p>
                <p><span className="infoLabel">Saúde:</span> {petData.saude}</p>
                <p><span className="infoLabel">Dono:</span> {petData.dono_nome}</p>
                <p><span className="infoLabel">Endereço:</span> {petData.dono_endereco}</p>
                <p>
                    <span className="infoLabel">Sobre: </span>
                    <span className="sobreAnimal">{petData.sobreAnimal}</span>
                </p>
                <p><span className="infoLabel">Status da Imagem:</span> {petData.animalFotoStatus}</p>
                <p><span className="infoLabel">Disponível:</span> {petData.disponivel ? 'Sim' : 'Não'}</p>
            </div>
        </div>

    );
}