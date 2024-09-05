import { useEffect, useState } from 'react';
import '../styles/MeuPerfil.css';
import defaultImage from '../assets/b.jpeg';
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from '../AuthContext';
import { api } from '../axiosConfig';
import { InfoTexts } from '../components/InfoTexts/InfoTexts';
import { InputData } from '../components/InputData/InputData';
import { FaPencilAlt, FaCheck } from 'react-icons/fa'; // Ícones para edição e confirmação


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
    const { isLogged, userId } = useAuth();
    const [dadosUser, setDadosUser] = useState<UserData | null>(null);
    const [dadosEditaveis, setDadosEditaveis] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [esperando, setEsperando] = useState(true);

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
        } finally {
            setEsperando(false);
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
            // Adicione uma mensagem de confirmação ou lógica similar aqui
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
            <img src={dadosUser.image} alt="Profile" className="profile-image"/>
            <div className="profile-details">
                { modoEdicao ? (
                    <>
                    <p>NOME COMPLETO</p>
                    <InputData type='text' name='nome_usuario' placeholder={dadosUser.nome_completo} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    <p>IDADE</p>
                    <InputData type='text' name='idade' placeholder={dadosUser.idade} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    <p>EMAIL</p>
                    <InputData type='text' name='email' placeholder={dadosUser.email} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    <p>ESTADO</p>
                    <InputData type='text' name='estado' placeholder={dadosUser.estado} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    <p>CIDADE</p>
                    <InputData type='text' name='cidade' placeholder={dadosUser.cidade} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    <p>ENDEREÇO</p>
                    <InputData type='text' name='endereco' placeholder={dadosUser.endereco} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    <p>TELEFONE</p>
                    <InputData type='text' name='telefone' placeholder={dadosUser.telefone} onChange={handleChange} style={{ marginLeft: '-20px' }}/>
                    
                    
                    </>

                ) :(
                    <>
                    <div>
                            <InfoTexts label='NOME COMPLETO' text={dadosUser.nome_completo}/>
                            <InfoTexts label='IDADE' text={dadosUser.idade.toString()}/>
                            <InfoTexts label='EMAIL' text={dadosUser.email}/>
                        
                        </div>
                        <div>
                            <InfoTexts label='ESTADO' text={dadosUser.estado}/>
                            <InfoTexts label='CIDADE' text={dadosUser.cidade}/>
                            <InfoTexts label='ENDEREÇO' text={dadosUser.endereco}/>

                        </div>
                        <div>
                            <InfoTexts label='TELEFONE' text={dadosUser.telefone}/>

                        </div>
                        <div>

                            <InfoTexts label='NOME DO USUÁRIO' text={dadosUser.nome_usuario}/>
                            <InfoTexts label='Histórico' text='Adotou 1 gato'/>
                        </div>
                    </> 
                )
            }
            </div>
        </div>
        <div className="icon-wrapper" onClick={modoEdicao ? handleSave : toggleEditMode}>
            {modoEdicao ? <FaCheck /> : <FaPencilAlt />}
        </div>
    </>
    );
}
