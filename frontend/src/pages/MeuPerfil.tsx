import { useEffect, useState } from 'react';
import '../styles/MeuPerfil.css';
import defaultImage from '../assets/b.jpeg';
import { Navbar } from "../components/Navbar/Navbar";
import { useAuth } from '../AuthContext';
import api from '../axiosConfig';
import { InfoTexts } from '../components/InfoTexts/InfoTexts';

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
    const [esperando, setEsperando] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLogged && userId) {
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
            }
        };

        fetchUserData();
    }, [isLogged, userId]);

    if (!dadosUser) {
        return <div className="modal-error">Erro ao carregar dados do usuário.</div>;
    }

    return (
        <>
            <Navbar title='Seu Perfil' />
            <div className="profile-container">
                <img src={dadosUser.image} alt="Profile" className="profile-image"/>
                <div className="profile-details">
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
                        <InfoTexts label='Histótico' text='Adotou 1 gato'/>
                    </div>
                </div>
            </div>
        </>
    );
}
