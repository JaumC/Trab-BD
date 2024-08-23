import { InputData } from '../InputData/InputData'
import { GreenButton } from '../GreenButton/GreenButton'
import './LoginData.css'
import { useState } from 'react';
import api from '../../axiosConfig';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

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
            alert(response.data.message);
            login();
            navigate('/')

        }catch(error){
            console.error("Erro ao logar", error);
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