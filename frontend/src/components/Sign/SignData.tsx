import { useState } from 'react';
import { GreenButton } from '../GreenButton/GreenButton';
import { InputData } from '../InputData/InputData';
import './SignData.css';
import api from '../../axiosConfig';
import { ModalMsg } from '../ModalMsg/ModalMsg';
import axios from 'axios';

type signData = {
    nome_completo: string;
    idade: string;
    email: string;
    estado: string;
    cidade: string;
    endereco: string;
    telefone: string;
    nome_usuario: string;
    senha: string;
    confirmacao_senha: string;
};

export function SignData() {
    const [signData, setsignData] = useState<signData>({
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
        setsignData({
            ...signData,
            [e.target.name]: e.target.value
        });
    };

    const [msgSign, setMsgSign] = useState<string>('')
    const [stateSign , setStateSign] = useState<boolean>(false)
    
    const handleSubmit = async () => {
        const requiredFields: (keyof signData)[] = [
            'nome_completo',
            'idade',
            'email',
            'estado',
            'cidade',
            'endereco',
            'telefone',
            'nome_usuario',
            'senha',
            'confirmacao_senha'
        ];



        const hasEmptyFields = requiredFields.some(field => !signData[field]);
    
        if (hasEmptyFields) {
            setMsgSign("Existem campos não preenchidos, por favor preencha todos");
            return;
        }

        if (signData.senha !== signData.confirmacao_senha) {
            setMsgSign("As senhas não coincidem!");
            return;
        }

        try {
            const response = await api.post('/sign-data', signData)
            setMsgSign(response.data.OK)
            setStateSign(true)
        }catch(error){
            if (axios.isAxiosError(error)){
                if (error.response) {
                    setMsgSign(error.response.data?.DENY || "Erro ao Cadastrar. Tente novamente.");
                } else {
                    setMsgSign("Erro de rede ou servidor. Tente novamente.");
                }
            }
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
            { msgSign && (
                <ModalMsg msg={msgSign} state={stateSign}/>
            )}
        </>
    );
}
