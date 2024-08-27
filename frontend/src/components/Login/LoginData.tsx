import { GreenButton } from '../GreenButton/GreenButton'
import { InputData } from '../InputData/InputData'
import { ModalMsg } from '../ModalMsg/ModalMsg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import api from '../../axiosConfig';
import { useState } from 'react';
import axios from 'axios';
import './LoginData.css'

export function LoginData(){
    const [logData, setlogData] = useState({
        nome_completo: '',
        senha: '',

    });

    const [msgLog , setMsglog] = useState<string>('')
    const [stateLog , setStateLog] = useState<boolean>(false)

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
            setMsglog("Campos vazios! Preencha todos os campos.");
            return;
        }
        try{
            const response = await api.post('/login-data', logData)

            if (!response.data.OK) {
                setMsglog(response.data.DENY);
            } else {
                setMsglog(response.data.OK)
                setStateLog(true)
                setTimeout(() => {
                    login(response.data.user_id); 
                    navigate('/'); 
                }, 1000)
            }

        }catch(error){
            if (axios.isAxiosError(error)){
                if (error.response) {
                    setMsglog(error.response.data?.DENY || "Erro ao logar. Tente novamente.");
                } else {
                    setMsglog("Erro de rede ou servidor. Tente novamente.");
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
            { msgLog &&(
                <ModalMsg msg={msgLog} state={stateLog}/>
            )}
        </>
    )
} 