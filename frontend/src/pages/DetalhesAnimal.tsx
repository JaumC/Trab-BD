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
    const petId = Number(pet_id);
    const [pet, setPet] = useState<AnimalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosEditaveis, setDadosEditaveis] = useState<Partial<AnimalData> | null>(null);

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
                const response = await api.get(`/animals/pet-details/${petId}`);
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
                setDadosEditaveis(response.data); // Inicializa dadosEditaveis
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pet details:', error);
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);

    const toggleEditMode = () => {
        setModoEdicao(prev => !prev);
        if (!modoEdicao) {
            setDadosEditaveis(pet); // Atualiza dadosEditaveis ao ativar edição
        }
    };

    const openDeleteConfirm = () => {
        setModalConfirm(true);
    };

    const handleDelete = async () => {
        setModalConfirm(false);
        try {
            const response = await api.delete(`/animals/pet-delete/${petId}`);
            setMsgDel(response.data.OK);
            setStateDel(true);
            setTimeout(() => {
                navigate('/MeusPets');
            }, 500);
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDadosEditaveis(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (dadosEditaveis) {
            try {
                const response = await api.put(`/animals/pet-update/${petId}`, dadosEditaveis);
                setMsgEdit(response.data.OK);
                setStateEdit(true);
                setPet(dadosEditaveis as AnimalData);
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
                toggleEditMode();
            } catch (error) {
                console.error('Erro ao atualizar pet:', error);
                toggleEditMode();
            }
        }
    };

    if (loading) {
        return <ModalLoading spinner={loading} color="#cfe9e5" />;
    }

    return (
        <>
            <Navbar title={pet?.nomeAnimal || 'Detalhes do Pet'} />
            <div style={{ backgroundColor: '#fafafa', overflowY: 'auto', minHeight: '100vh' }}>
                <div className='container'>
                    <div className='image-container-d'>
                        <img className='image-in' src={pet?.animalFoto || ''} alt={pet?.nomeAnimal || 'Foto do Pet'} />
                    </div>
                    <EditButton onClick={toggleEditMode} modoEdicao={modoEdicao} />
                    <div className='view_geral'>
                        {modoEdicao ? (
                            <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <div className='form-group'>
                                    <label className='label'>Nome do Pet</label>
                                    <InputData type='text' name='nomeAnimal' value={dadosEditaveis?.nomeAnimal || ''} onChange={handleChange} />
                                </div>
                                <div className='linha'></div>
                                <div className='infoContainer'>
                                    <div className='row'>
                                        <div className='column'>
                                            <p className='label'>SEXO</p>
                                            <InputData type='text' name='sexo' value={dadosEditaveis?.sexo || ''} onChange={handleChange} />
                                        </div>
                                        <div className='column'>
                                            <p className='label'>PORTE</p>
                                            <InputData type='text' name='porte' value={dadosEditaveis?.porte || ''} onChange={handleChange} />
                                        </div>
                                        <div className='column'>
                                            <p className='label'>IDADE</p>
                                            <InputData type='text' name='idade' value={dadosEditaveis?.idade || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className='linha'></div>
                                <div className='row'>
                                    <div className='column'>
                                        <p className='label'>DISPONIVEL</p>
                                        <InputData type='text' name='disponivel' value={dadosEditaveis?.disponivel ? 'Sim' : 'Não'} onChange={handleChange} />
                                    </div>
                                    <div className='column'>
                                        <p className='label'>VERMIFUGADO</p>
                                        <InputData type='text' name='vermifugado' value='Sim' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='column'>
                                        <p className='label'>VACINADO</p>
                                        <InputData type='text' name='vacinado' value='Não' onChange={handleChange} />
                                    </div>
                                    <div className='column'>
                                        <p className='label'>DOENÇAS</p>
                                        <InputData type='text' name='doencas' value='Nenhuma' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='linha'></div>
                                <p className='label'>TEMPERAMENTO</p>
                                <InputData type='text' name='temperamento' value={dadosEditaveis?.temperamento || ''} onChange={handleChange} />
                                <div className='linha'></div>
                                <p className='text'>
                                    <span className='label'>Mais sobre {dadosEditaveis?.nomeAnimal}</span>
                                    <InputData type='text' name='sobreAnimal' value={dadosEditaveis?.sobreAnimal || ''} onChange={handleChange} />
                                </p>
                            </form>
                        ) : (
                            <>
                                <h2 className='nomeAnimal'>{pet?.nomeAnimal}</h2>
                                <div className='linha'></div>
                                <div className='infoContainer'>
                                    <div className='row'>
                                        <div className='column'>
                                            <p className='label'>SEXO</p>
                                            <p className='text'>{pet?.sexo}</p>
                                        </div>
                                        <div className='column'>
                                            <p className='label'>PORTE</p>
                                            <p className='text'>{pet?.porte}</p>
                                        </div>
                                        <div className='column'>
                                            <p className='label'>IDADE</p>
                                            <p className='text'>{pet?.idade}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='linha'></div>
                                <div className='row'>
                                    <div className='column'>
                                        <p className='label'>DISPONIVEL</p>
                                        <p className='text'>{pet?.disponivel ? 'Sim' : 'Não'}</p>
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
                                <p className='text'>{pet?.temperamento}</p>
                                <div className='linha'></div>
                                <p className='text'>
                                    <span className='label'>Mais sobre {pet?.nomeAnimal}</span>
                                    <p>{pet?.sobreAnimal}</p>
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
