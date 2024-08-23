import { InputData } from '../InputData/InputData'
import { GreenButton } from '../GreenButton/GreenButton'
import './LoginData.css'
import { useState } from 'react';
import api from '../../axiosConfig';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function LoginData(){
    const [logData, setlogData] = useState({
        nome_completo: '',
        senha: '',

    });

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setlogData({
            ...logData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (logData.senha == '' || logData.nome_completo == '') {
            alert("Campos vazios! Preencha todos os campos.");
            return;
        }
        try{
            const response = await api.post('/login-data', logData)

            if (!response.data.OK) {
                alert(response.data.DENY);
            } else {
                login(); 
                navigate('/'); 
                alert(response.data.OK); 
            }

        }catch(error){
            if (axios.isAxiosError(error)){
                if (error.response) {
                    alert(error.response.data?.DENY || "Erro ao logar. Tente novamente.");
                } else {
                    alert("Erro de rede ou servidor. Tente novamente.");
                }
            }
        }
    }
    return(
        <>     
            <div className="inputs-login">
                <InputData type='text' name='nome_completo' placeholder='Nome Sobrenome' onChange={handleChange}/>
                <InputData type='password' name='senha' placeholder='*************' onChange={handleChange}/>
            </div>
            <div className="enterField">
                <GreenButton label='ENTRAR' onClick={handleSubmit}/>
                <a href='/sign'>Não tem conta? Cadastre-se clicando aqui!</a>
            </div>
        </>
    )
} 