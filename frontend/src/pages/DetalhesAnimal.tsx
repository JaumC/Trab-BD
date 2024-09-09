import { useEffect, useState, useRef } from 'react';
import '../styles/DetalhesAnimal.css';
import { Navbar } from "../components/Navbar/Navbar";
import { api } from '../axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { InputData } from '../components/InputData/InputData';
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { ModalConfirm } from '../components/ModalConfirm/ModalConfirm';
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
    let { pet_id } = useParams();
    const petId = Number(pet_id)
    const [pet, setPet] = useState<AnimalData | null>(null);
    const [loading, setLoading] = useState(true);

    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosEditaveis, setDadosEditaveis] = useState(null);

    const [modalConfirm, setModalConfirm] = useState(false);  

    const [msgDel, setMsgDel] = useState<string>('');
    const [stateDel, setStateDel] = useState<boolean>(false);

    const [msgEdit, setMsgEdit] = useState<string>('');
    const [stateEdit, setStateEdit] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await api.get(`/animals/pet-details/${petId}`,)
                
                setPet({
                    animalFoto: response.data.animalFoto,
                    nomeAnimal: response.data.nomeAnimal.replace(/{|}/g, ''),
                    especie: response.data.especie.replace(/{|}/g, ''),
                    sexo: response.data.sexo.replace(/{|}/g, ''),
                    porte: response.data.porte.replace(/{|}/g, ''),
                    idade: response.data.idade.replace(/{|}/g, ''),
                    temperamento: response.data.temperamento.replace(/{|}/g, ''),
                    saude: response.data.saude.replace(/{|}/g, ''),
                    sobreAnimal: response.data.sobreAnimal.replace(/{|}/g, ''),
                    userId: response.data.userId,
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

    const openDeleteConfirm = () => {
        setModalConfirm(true);
    };

    const handleDelete = async () => {
        setModalConfirm(false);
        const response = await api.delete(`/animals/pet-delete/${petId}`)

        setMsgDel(response.data.OK);
        setStateDel(true);

        setTimeout(() => {
            navigate('/MeusPets'); 
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosEditaveis(prev => ({ ...prev, [name]: value }));
        console.log(name,value);
    };

    const handleSave = async () => {
        try {
            console.log(dadosEditaveis)
            const response = await api.put(`/animals/pet-update/${petId}`, dadosEditaveis);
            setMsgEdit(response.data.OK);
            setStateEdit(true);

            setPet(dadosEditaveis);
            toggleEditMode();
            setTimeout(() => {
                window.location.reload()
            }, 100)
        } catch (error) {
            console.error('Erro ao atualizar pet: ', error);
            toggleEditMode();
        }
    };

    if (loading) {
        return <ModalLoading spinner={loading} color="#cfe9e5" />;
    }

    return (
        <>
            <Navbar title={pet.nomeAnimal} />
            <div style={{ backgroundColor: '#fafafa', overflowY: 'auto', minHeight: '100vh' }}>
                <div className='container'>
                    <div className='image-container-d'>
                        <img className='image-in'
                            src={pet.animalFoto}
                            alt={pet.nomeAnimal}
                        />
                    </div>
                    <EditButton onClick={toggleEditMode} modoEdicao={modoEdicao} />
                    <div className='view_geral'>
                        {modoEdicao ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <h2 className='nomeAnimal'>{pet.nomeAnimal}</h2>
                                <div className='linha'></div>
    
                                <div className='infoContainer'>
                                    <div className='row'>
                                        <div className='column'>
                                            <p className='label'>SEXO</p>
                                            <InputData type='text' name='sexo' placeholder={pet.sexo} onChange={handleChange} />
                                        </div>
                                        <div className='column'>
                                            <p className='label'>PORTE</p>
                                            <InputData type='text' name='porte' placeholder={pet.porte} onChange={handleChange} />
                                        </div>
                                        <div className='column'>
                                            <p className='label'>IDADE</p>
                                            <InputData type='text' name='idade' placeholder={pet.idade} onChange={handleChange} />
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
                                    <span className='label'>Mais sobre {pet.nomeAnimal}</span>
                                    <p>{pet.sobreAnimal}</p>
                                </p>
                            </form>
                        ) : (
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
                                    <span className='label'>Mais sobre {pet.nomeAnimal}</span>
                                    <p>{pet.sobreAnimal}</p>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className='delete-btn'>
                <button className="delete-pet" onClick={openDeleteConfirm}>DELETAR</button>
            </div>
            <ModalConfirm
                show={modalConfirm}
                onConfirm={handleDelete}
                onCancel={() => setModalConfirm(false)}
                label="Deletar Pet?"
            />
            {msgDel && (
                <ModalMsg msg={msgDel} state={stateDel} />
            )}
            {msgEdit && (
                <ModalMsg msg={msgEdit} state={stateEdit} />
            )}
        </>
    );    
}    