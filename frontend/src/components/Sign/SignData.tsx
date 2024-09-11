import { useState } from 'react';
import { GreenButton } from '../GreenButton/GreenButton';
import { InputData } from '../InputData/InputData';
import './SignData.css';
import { api } from '../../axiosConfig';
import { ModalMsg } from '../ModalMsg/ModalMsg';
import axios from 'axios';

type signData = {
    nome_completo: string;
    data: string;
    email: string;
    telefone: string;
    nome_usuario: string;
    senha: string;
    confirmacao_senha: string;
    endereco: {
        rua: string;
        quadra: string;
        cidade: string;
        estado: string;
        complemento: string;
    };
};

export function SignData() {
    const [signData, setsignData] = useState<signData>({
        nome_completo: '',
        data: '',
        email: '',
        telefone: '',
        nome_usuario: '',
        senha: '',
        confirmacao_senha: '',
        endereco: {
            rua: '',
            quadra: '',
            cidade: '',
            estado: '',
            complemento: '',
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name in signData.endereco) {
            // Atualiza o campo de endereço separadamente
            setsignData({
                ...signData,
                endereco: {
                    ...signData.endereco,
                    [name]: value
                }
            });
        } else {
            // Atualiza os outros campos do usuário
            setsignData({
                ...signData,
                [name]: value
            });
        }
    };

    const [msgSign, setMsgSign] = useState<string>('')
    const [stateSign , setStateSign] = useState<boolean>(false)
    
    const handleSubmit = async () => {
        const requiredFields: (keyof signData)[] = [
            'nome_completo',
            'data',
            'email',
            'telefone',
            'nome_usuario',
            'senha',
            'confirmacao_senha'
        ];

        const addressFields: (keyof signData['endereco'])[] = [
            'rua',
            'quadra',
            'cidade',
            'estado',
            'complemento'
        ]



        const hasEmptyFields = requiredFields.some(field => !signData[field]);
        const hasEmptyAddressFields = addressFields.some(field => !signData.endereco[field]);

    
        if (hasEmptyFields || hasEmptyAddressFields) {
            setMsgSign("Existem campos não preenchidos, por favor preencha todos");
            return;
        }

        if (signData.senha !== signData.confirmacao_senha) {
            setMsgSign("As senhas não coincidem!");
            return;
        }

        try {
            const response = await api.post('/user/sign-data', signData)
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
                <InputData type='date' name='data' placeholder='Idade' onChange={handleChange}/>
                <InputData type='text' name='email' placeholder='E-mail' onChange={handleChange}/>
                <InputData type='text' name='telefone' placeholder='Telefone' onChange={handleChange}/>
            </div>    

            <div className="inputsinfo">
                <p>INFORMAÇÕES DE ENDEREÇO</p>
                <InputData type='text' name='rua' placeholder='Rua' onChange={handleChange} />
                <InputData type='text' name='quadra' placeholder='Quadra' onChange={handleChange} />
                <InputData type='text' name='complemento' placeholder='Complemento' onChange={handleChange} />
                <InputData type='text' name='cidade' placeholder='Cidade' onChange={handleChange} />
                <InputData type='text' name='estado' placeholder='Estado' onChange={handleChange} />
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
