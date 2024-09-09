import { useEffect, useState, useRef } from 'react';
import '../styles/DetalhesAnimal.css';
import defaultImage from '../assets/b.jpeg';
import { Navbar } from "../components/Navbar/Navbar";

import { api } from '../axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

import { InputData } from '../components/InputData/InputData';

import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { ModalConfirm } from '../components/ModalConfirm/ModalConfirm';
import { GreenButton } from '../components/GreenButton/GreenButton';
import EditButton from '../components/EditButton/EditButton';
import ModalLoading from '../components/ModalLoading/ModalLoading';


interface AnimalData {
    id: number;
    nomeAnimal: string;
    especie: string;
    sexo: number;
    porte: string;
    idade: string;
    temperamento: string;
    saude: string;
    sobreAnimal: string;
    animalFoto: string;
    userId?: string;
    disponivel: boolean;
}

export function DetalhesAnimal() {
    let { petId } = useParams();
    const [pet, setPet] = useState<AnimalData | null>(null);
    const [loading, setLoading] = useState(true);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosEditaveis, setDadosEditaveis] = useState(null);

    const [msgEdit, setMsgEdit] = useState<string>('');
    const [stateEdit, setStateEdit] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await api.get(`/pet-details/${petId}`);
                setPet({
                    nomeAnimal: response.data.nomeAnimal,
                    especie: response.data.especie,
                    sexo: response.data.sexo,
                    porte: response.data.porte,
                    idade: response.data.idade,
                    temperamento: response.data.temperamento,
                    saude: response.data.nomeAnimal,
                    sobreAnimal: response.data.nomeAnimal,
                    animalFoto: response.data.animalFoto,
                    userId: response.data.nomeAnimal,
                    disponivel: response.data.disponivel,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pet details:', error);
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);


    const toggleEditMode = () => {
        if (modoEdicao) {
            setDadosEditaveis({ ...pet });
        }
        setModoEdicao(!modoEdicao);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosEditaveis(prev => ({ ...prev, [name]: value }));
        console.log(name,value);
    };

    const handleSave = async () => {
        try {
            console.log(dadosEditaveis)
            const response = await api.put(`/pet-update/${petId}`, dadosEditaveis);
            setMsgEdit(response.data.OK);
            setStateEdit(true);

            setPet(prevPet => {
                if (dadosEditaveis) {
                    return {
                        ...prevPet,
                        ...dadosEditaveis
                    };
                } else {
                    return prevPet;
                }
            });
            toggleEditMode();
            setTimeout(() => setStateEdit(false), 3000);
        } catch (error) {
            console.error('Error updating pet info:', error);
            toggleEditMode();
        }
    };

    if (loading) {
        return <ModalLoading spinner={loading} color="#cfe9e5" />;
    }

    return (
        <>
            <Navbar title={pet.nomeAnimal} />
            <div style={{ backgroundColor: '#fafafa', overflowY: 'auto', height: '100vh' }}>
                <div className='container'>
                    
                    <div className='image-container '>
                        <img
                            src={pet.animalFoto || defaultImage}
                            alt={pet.nomeAnimal}
                        />
                    </div>
                    <EditButton onClick={toggleEditMode} modoEdicao={modoEdicao}/>
                    <div className='view_geral'>
                        {modoEdicao ? (
                            <>
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                    <h2 className='nomeAnimal'>{pet.nomeAnimal}</h2>
                                    <div className='linha'></div>

                                    <div className='infoContainer'>
                                        <div className='row'>
                                            <div className='column'>
                                                <p className='label'>SEXO</p>
                                                <InputData type='text' name='sexo' placeholder={pet.sexo} onChange={handleChange} style={{ width: '55px'}}/>
                                            </div>
                                            <div className='column'>
                                                <p className='label'>PORTE</p>
                                                <InputData type='text' name='porte' placeholder='Porte' onChange={handleChange} style={{ width: '61px'}}/>
                                            </div>
                                            <div className='column'>
                                                <p className='label'>IDADE</p>
                                                <InputData type='text' name='idade' placeholder={pet.idade} onChange={handleChange} style={{ width: '55px'}}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='linha'></div>

                                    <p className='label'>LOCALIZAÇÃO</p>
                                    <p className='text'>{pet.cidade} - {pet.estado}</p>

                                    <div className='row'>
                                        <div className='column'>
                                            <p className='label'>DISPONIVEL</p>
                                            <p className='text'>{pet.disponivel}</p>
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

                                    <div className='linha'></div>
                                    <p className='label'>TEMPERAMENTO</p>
                                    <p className='text'>{pet.temperamento}</p>

                                    <div className='linha'></div>

                                    <p className='text'>
                                    <p className='label'>Mais sobre {pet.nomeAnimal}</p>
                                    {pet.sobreAnimal}
                                    </p>

                                    <div className='removeButton '>
                                        <GreenButton label='REMOVER PET' onClick={toggleEditMode} type='submit'/>
                                    </div>
                                </form>
                             </>
                        ):(
                            <>
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

                                <div className='linha'></div>

                                <p className='label'>LOCALIZAÇÃO</p>
                                <p className='text'>{pet.cidade} - {pet.estado}</p>

                                <div className='row'>
                                    <div className='column'>
                                        <p className='label'>DISPONIVEL</p>
                                        <p className='text'>{pet.disponivel}</p>
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

                                <div className='linha'></div>
                                <p className='label'>TEMPERAMENTO</p>
                                <p className='text'>{pet.temperamento}</p>

                                <div className='linha'></div>

                                <p className='text'>
                                <p className='label'>Mais sobre {pet.nomeAnimal}</p>
                                Pequi é um cão muito dócil e de fácil convivência. Adora caminhadas e se dá muito bem com crianças. Tem muito medo de raios e chuva. Está disponível para adoção pois eu e minha família o encontramos na rua e não podemos mantê-lo em nossa casa.
                                </p>
                            </>
                        )}

                    </div>
                </div>
            </div>
            {msgEdit && (
                <ModalMsg msg={msgEdit} state={stateEdit} />
            )}
        </>
    );
}

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Navbar } from '../components/Navbar/Navbar';

// export function DetalhesAnimal() {
//     const { pet_id } = useParams();
//     const petId = Number(pet_id);

//     const [petData, setPetData] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true); // Estado de carregamento

//     useEffect(() => {
//         const fetchPetData = async () => {
//             try {
               
//                 const response = await fetch(`http://localhost:50/info-pets/${petId}`, {
//                     method: 'GET',
//                 });
    
//                 const data = await response.json();

//                 setPetData(data.OK); // Ajuste para refletir a estrutura dos dados
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching pet data:', err);
//                 setError(err.response ? err.response.data.DENY : 'Erro ao buscar dados do pet');
//                 setLoading(false);
//             }
//         };

//         fetchPetData();
//     }, [petId]);

//     if (loading) {
//         return <div>Carregando...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     if (!petData) {
//         return <div>Pet não encontrado</div>;
//     }

//     return (
//         <div>
//             <Navbar title={petData.nomeAnimal} />
//             <p>Espécie: {petData.especie}</p>
//             <p>Sexo: {petData.sexo}</p>
//             <p>Porte: {petData.porte}</p>
//             <p>Idade: {petData.idade}</p>
//             <p>Temperamento: {petData.temperamento}</p>
//             <p>Saúde: {petData.saude}</p>
//             <p>Sobre: {petData.sobreAnimal}</p>
//             <p>Status da Imagem: {petData.animalFotoStatus}</p>
//             <p>Dono: {petData.dono_nome}</p>
//             <p>Disponível: {petData.disponivel ? 'Sim' : 'Não'}</p>
//         </div>
//     );
// }
