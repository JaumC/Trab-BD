import { useEffect, useState } from 'react';
import '../styles/MeuPerfil.css';
import defaultImage from '../assets/b.jpeg';
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from '../AuthContext';
import { api } from '../axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { InfoTexts } from '../components/InfoTexts/InfoTexts';
import { InputData } from '../components/InputData/InputData';
import { FaPencilAlt, FaCheck } from 'react-icons/fa'; // Ícones para edição e confirmação
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { ModalConfirm } from '../components/ModalConfirm/ModalConfirm';
import ModalLoading from '../components/ModalLoading/ModalLoading';


export function DetalhesAnimal() {
    let { petId } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosEditaveis, setDadosEditaveis] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await api.get(`/pet-details/${petId}`);
                setPet(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pet details:', error);
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);

    const toggleEditMode = () => {
        if (!modoEdicao) {
            setDadosEditaveis({ ...pet });
        }
        setModoEdicao(!modoEdicao);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosEditaveis(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <ModalLoading spinner={loading} color="#cfe9e5" />;
    }

    return (
        <>
            <Navbar title={pet.nomeAnimal} />
            <div style={{ backgroundColor: '#fafafa', overflowY: 'auto', height: '100vh' }}>
                <div className='container'>
                    
                    <div className='imageContainerStyle'>
                        <img
                            src={pet.animalFoto || defaultImage}
                            alt={pet.nomeAnimal}
                        />
                    </div>

                    <div className='view_geral'>
                        <h2 className='nomeAnimal'>{pet.nomeAnimal}</h2>
                        <div className='linha'></div>

                        <div className='infoContainer'>
                            <div className='row'>
                                <div className='column'>
                                    <p className='label'>SEXO</p>
                                    <p className='text'>{pet.sexo}</p>
                                </div>
                                <div className='column'>
                                    <p className='label'>PORTE</p>
                                    <p className='text'>{pet.porte}</p>
                                </div>
                                <div className='column'>
                                    <p className='label'>IDADE</p>
                                    <p className='text'>{pet.idade}</p>
                                </div>
                            </div>
                        </div>


                        <p className='label'>LOCALIZAÇÃO</p>
                        <p className='text'>{pet.cidade} - {pet.estado}</p>

                        <div className='row'>
                            <div className='column'>
                                <p className='label'>CASTRADO</p>
                                <p className='text'>Não</p>
                            </div>
                            <div className='column'>
                                <p className='label'>VERMIFUGADO</p>
                                <p className='text'>Sim</p>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='column'>
                                <p className='label'>VACINADO</p>
                                <p className='text'>Não</p>
                            </div>
                            <div className='column'>
                                <p className='label'>DOENÇAS</p>
                                <p className='text'>Nenhuma</p>
                            </div>
                        </div>

                        <p className='label'>TEMPERAMENTO</p>
                        <p className='text'>Brincalhão e Dócil</p>

                        <p className='text'>
                         Pequi é um cão muito dócil e de fácil convivência. Adora caminhadas e se dá muito bem com crianças. Tem muito medo de raios e chuva. Está disponível para adoção pois eu e minha família o encontramos na rua e não podemos mantê-lo em nossa casa.
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}
