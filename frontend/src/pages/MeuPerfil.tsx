import { useEffect, useState } from 'react';
import '../styles/MeuPerfil.css';
import defaultImage from '../assets/b.jpeg';
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from '../AuthContext';
import { api } from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { InfoTexts } from '../components/InfoTexts/InfoTexts';
import { InputData } from '../components/InputData/InputData';
import { FaPencilAlt, FaCheck } from 'react-icons/fa'; // Ícones para edição e confirmação
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { ModalConfirm } from '../components/ModalConfirm/ModalConfirm';


interface UserData {
    nome_completo: string;
    idade: number;
    email: string;
    estado: string;
    cidade: string;
    endereco: string;
    telefone: string;
    nome_usuario: string;
    image?: string;
}

export function MeuPerfil() {
    const { isLogged, userId, logout } = useAuth();
    const [dadosUser, setDadosUser] = useState<UserData | null>(null);
    const [dadosEditaveis, setDadosEditaveis] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);

    const [modalConfirm, setModalConfirm] = useState(false);  // Estado para controlar exibição do modal de confirmação
    const [msgDel, setMsgDel] = useState<string>('');
    const [stateDel, setStateDel] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setModalConfirm(false);
        const response = await api.delete(`/user-delete/${userId}`)

        setMsgDel(response.data.OK);
        setStateDel(true);

        setTimeout(() => {
            logout();
            navigate('/'); 
        }, 1500);
    };

    // Função para abrir o modal de confirmação
    const openDeleteConfirm = () => {
        setModalConfirm(true);
    };

    useEffect(() => {
        if (isLogged && userId) {
            fetchUserData();
        }
    }, [isLogged, userId]);

    const fetchUserData = async () => {
        try {
            const response = await api.get(`/user-info/${userId}`);
            setDadosUser({
                nome_completo: response.data.nome_completo,
                idade: response.data.idade,
                email: response.data.email,
                estado: response.data.estado,
                cidade: response.data.cidade,
                endereco: response.data.endereco,
                telefone: response.data.telefone,
                nome_usuario: response.data.nome_usuario,
                image: response.data.image || defaultImage  
            });
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const toggleEditMode = () => {
        setModoEdicao(!modoEdicao);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosEditaveis(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await api.put(`/user-update/${userId}`, dadosEditaveis);
            setDadosUser(dadosEditaveis);
            toggleEditMode();
        } catch (error) {
            console.error('Error updating user info:', error);
            toggleEditMode();
        }
    };

    if (!dadosUser) {
        return <div className="modal-error">Erro ao carregar dados do usuário.</div>;
    }

    return (
        <>
            <Navbar title='Seu Perfil' />
            <div className="profile-container">
                <img src={dadosUser.image} alt="Profile" className="profile-image" />
                <div className="profile-details">
                    {modoEdicao ? (
                        <div className="form-grid">
                            <div>
                                <p>NOME COMPLETO</p>
                                <InputData type="text" name="nome_usuario" placeholder={dadosUser.nome_completo} onChange={handleChange} />
                            </div>
                            <div>
                                <p>IDADE</p>
                                <InputData type="text" name="idade" placeholder={dadosUser.idade.toString()} onChange={handleChange} />
                            </div>
                            <div>
                                <p>EMAIL</p>
                                <InputData type="text" name="email" placeholder={dadosUser.email} onChange={handleChange} />
                            </div>
                            <div>
                                <p>ESTADO</p>
                                <InputData type="text" name="estado" placeholder={dadosUser.estado} onChange={handleChange} />
                            </div>
                            <div>
                                <p>CIDADE</p>
                                <InputData type="text" name="cidade" placeholder={dadosUser.cidade} onChange={handleChange} />
                            </div>
                            <div>
                                <p>ENDEREÇO</p>
                                <InputData type="text" name="endereco" placeholder={dadosUser.endereco} onChange={handleChange} />
                            </div>
                            <div>
                                <p>TELEFONE</p>
                                <InputData type="text" name="telefone" placeholder={dadosUser.telefone} onChange={handleChange} />
                            </div>
                        </div>

                    ) : (
                        <div className='form-grid'>
                            <div>
                                <InfoTexts label='USUÁRIO' text={dadosUser.nome_usuario} />
                                <InfoTexts label='NOME COMPLETO' text={dadosUser.nome_completo} />
                                <InfoTexts label='E-MAIL' text={dadosUser.email} />
                            </div>
                            <div>
                                <InfoTexts label='IDADE' text={dadosUser.idade.toString()} />
                                <InfoTexts label='ENDEREÇO' text={dadosUser.endereco} />
                                <InfoTexts label='TELEFONE' text={dadosUser.telefone} />
                            </div>
                            <div>
                                <InfoTexts label='CIDADE' text={dadosUser.cidade} />
                                <InfoTexts label='ESTADO' text={dadosUser.estado} />
                                <InfoTexts label='HISTÓRICO' text='Adotou 1 gato' />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='edit-delete-btn'>
                <div className="icon-wrapper" onClick={modoEdicao ? handleSave : toggleEditMode}>
                    {modoEdicao ? <FaCheck /> : 'EDITAR'}
                </div>
                <button className="delete-user" onClick={openDeleteConfirm}>DELETAR</button>
            </div>
            <ModalConfirm
                show={modalConfirm}
                onConfirm={handleDelete}
                onCancel={() => setModalConfirm(false)}
                label="Deletar Usuário?"
            />
            {msgDel && (
                <ModalMsg msg={msgDel} state={stateDel} />
            )}
        </>
    );
}
