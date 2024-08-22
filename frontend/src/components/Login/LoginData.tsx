import { InputData } from '../InputData/InputData'
import { GreenButton } from '../GreenButton/GreenButton'
import './LoginData.css'
import { useState } from 'react';

export function LoginData(){
    const [formData, setFormData] = useState({
        nome_completo: '',
        senha: '',

    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async () => {
        if (formData.senha == '' || formData.nome_completo == '') {
            alert("Campos vazios!");
            return;
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