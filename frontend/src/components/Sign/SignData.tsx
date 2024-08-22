import { useState } from 'react';
import { GreenButton } from '../GreenButton/GreenButton';
import { InputData } from '../InputData/InputData';
import './SignData.css';
import api from '../../axiosConfig';

export function SignData() {
    const [formData, setFormData] = useState({
        nome_completo: '',
        idade: '',
        email: '',
        estado: '',
        cidade: '',
        endereco: '',
        telefone: '',
        nome_usuario: '',
        senha: '',
        confirmacao_senha: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (formData.senha !== formData.confirmacao_senha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const response = await api.post('/sign-data', formData)
            alert(response.data.message);
        } catch (error) {
            console.error("Erro ao cadastrar os dados:", error);
        }
    };

    return (
        <>
            <div className='info-sign'>
                <p>
                As informações preenchidas serão divulgadas <br/>
                apenas para a pessoa com a qual você realizar <br />
                o processo de adoção e/ou apadrinhamento, <br />
                após a formalização do processo.
                </p>
            </div>

            <div className="inputsinfo">
                <p>INFORMAÇÕES PESSOAIS</p>
                <InputData type='text' name='nome_completo' placeholder='Nome Completo' onChange={handleChange}/>
                <InputData type='text' name='idade' placeholder='Idade' onChange={handleChange}/>
                <InputData type='text' name='email' placeholder='E-mail' onChange={handleChange}/>
                <InputData type='text' name='estado' placeholder='Estado' onChange={handleChange}/>
                <InputData type='text' name='cidade' placeholder='Cidade' onChange={handleChange}/>
                <InputData type='text' name='endereco' placeholder='Endereço' onChange={handleChange}/>
                <InputData type='text' name='telefone' placeholder='Telefone' onChange={handleChange}/>
            </div>
            <div className="inputsinfo">
                <p>INFORMAÇÕES DE PERFIL</p>
                <InputData type='text' name='nome_usuario' placeholder='Nome de Usuário' onChange={handleChange}/>
                <InputData type='password' name='senha' placeholder='Senha' onChange={handleChange}/>
                <InputData type='password' name='confirmacao_senha' placeholder='Confirmação da Senha' onChange={handleChange}/>
            </div>
            <div className="signField">
                <GreenButton label='FAZER CADASTRO' onClick={handleSubmit}/>
            </div>
        </>
    );
}
