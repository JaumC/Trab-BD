import { Navbar } from "../components/Navbar/Navbar";
import { InputData } from '../components/InputData/InputData';
import { useState } from "react";
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { GreenButton } from "../components/GreenButton/GreenButton";
import api from '../axiosConfig';
import axios from 'axios';
import RadioButtons from "../components/BotaoRedondo/BotaoRedondo";

type AnimalData = {
    nomeAnimal: string;
    especie: string;
    sexo: string;
    porte: string;
    idade: string;
    temperamento: string;
    saude: string;
    doencasAnimal: string;
    sobreAnimal: string;
    termosAdocao: string;
    exigenciaFotosCasa: string;
    visitaPrevia: string;
    acompanhamento: string;
    tempoAcompanhamento: string;
};

export function PreencherPet(){

    const [msgSign, setMsgSign] = useState<string>('')
    const [stateSign , setStateSign] = useState<boolean>(false)

    const [AnimalData, setAnimalData] = useState<AnimalData>({
        nomeAnimal: '',
        especie: '',
        sexo: '',
        porte: '',
        idade: '',
        temperamento: '',
        saude: '',
        doencasAnimal: '',
        sobreAnimal: '',
        termosAdocao: '',
        exigenciaFotosCasa: '',
        visitaPrevia: '',
        acompanhamento: '',
        tempoAcompanhamento: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string[], fieldName?: string) => {
        const value = Array.isArray(e) ? e.join(', ') : e.target.value;
        const name = fieldName || e.target.name;
        
        setAnimalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const requiredFields: (keyof AnimalData)[] = [
            'nomeAnimal',
            'especie',
            'sexo',
            'porte',
            'idade',
            'temperamento',
            'saude',
            'doencasAnimal',
            'sobreAnimal',
            'termosAdocao',
            'exigenciaFotosCasa',
            'visitaPrevia',
            'acompanhamento',
            'tempoAcompanhamento'
        ];



        const hasEmptyFields = requiredFields.some(field => !AnimalData[field]);
    
        if (hasEmptyFields) {
            setMsgSign("Existem campos não preenchidos, por favor preencha todos");
            return;
        }
        try {
            const response = await api.post('/sign-data', AnimalData)
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
        <> <Navbar title='Cadastro do Animal'/>
            <div className='info-sign'>
                <p>
                As informações preenchidas serão divulgadas <br/>
    
                </p>
            </div>

            <div className="inputsinfo">
                <p>Ajudar</p>
                <InputData type='text' name='nomeAnimal' placeholder='Nome do Animal' onChange={handleChange}/>
                {/*<InputData type='text' name='especie' placeholder='Idade' onChange={handleChange}/>
                <InputData type='text' name='sexo' placeholder='E-mail' onChange={handleChange}/>
                <InputData type='text' name='porte' placeholder='Estado' onChange={handleChange}/>
                <InputData type='text' name='idade' placeholder='Cidade' onChange={handleChange}/>
                <InputData type='text' name='saude' placeholder='Cidade' onChange={handleChange}/>
                <InputData type='text' name='temperamento' placeholder='Endereço' onChange={handleChange}/>
                <InputData type='text' name='doencasAnimal' placeholder='Telefone' onChange={handleChange}/>
                <InputData type='text' name='sobreAnimal' placeholder='Telefone' onChange={handleChange}/>
                <InputData type='text' name='termosAdocao' placeholder='Telefone' onChange={handleChange}/>
                <InputData type='text' name='exigenciaFotosCasa' placeholder='Telefone' onChange={handleChange}/>
                <InputData type='text' name='visitaPrevia' placeholder='Telefone' onChange={handleChange}/>
                <InputData type='text' name='acompanhamento' placeholder='Telefone' onChange={handleChange}/>
                <InputData type='text' name='tempoAcompanhamento' placeholder='Telefone' onChange={handleChange}/> */}
            </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                ESPÉCIE
            </div>
            <RadioButtons
                options={['Male', 'Female', 'Unknown']}
                setParentState={(value: string) => handleChange(value, 'sexo')}
            />
            <div className="inputsinfo">
                <p>INFORMAÇÕES DE PERFIL</p>
                <InputData type='text' name='nomeAnimal' placeholder='Nome do Animal' onChange={handleChange}/>
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