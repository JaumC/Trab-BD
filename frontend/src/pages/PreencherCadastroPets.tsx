import { Navbar } from "../components/Navbar/Navbar";
import { InputData } from '../components/InputData/InputData';
import { useState } from "react";
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { GreenButton } from "../components/GreenButton/GreenButton";
import "../styles/PreencherCadastroPets.css"

import api from '../axiosConfig';
import axios from 'axios';
import RadioButtons from "../components/BotõesInput/BotaoRedondo";
import BotaoQuadrado from "../components/BotõesInput/BotaoQuadrado";

type AnimalData = {
    nomeAnimal: string;
    especie: string;
    sexo: string;
    porte: string;
    idade: string;
    temperamento: string;
    saude: string;
    sobreAnimal: string;
    animalFoto: string;
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
        sobreAnimal: '',
        animalFoto: '',
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
            'sobreAnimal',
            'animalFoto',
        ];



        const hasEmptyFields = requiredFields.some(field => !AnimalData[field]);
    
        if (hasEmptyFields) {
            setMsgSign("Existem campos não preenchidos, por favor preencha todos");
            return;
        }
        try {
            const response = await api.post('/register-animal', AnimalData)
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
        <> <Navbar title='Cadastro do Animal' color="#FFD358"/>


            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginLeft: '24px' }}>
                NOME DO ANIMAL
                <div style={{paddingTop: '10px'}}>
                <InputData type='text' name='nomeAnimal' placeholder='Nome do Animal' onChange={handleChange}/>
                </div>
                </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                ESPÉCIE
            </div>
            <div className="containerBotao ">
                <RadioButtons
                options={['Cachorro', 'Gato']}
                setParentState={(value: string) => handleChange(value, 'especie')}
                />
            </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                SEXO
            </div>
            <div className="containerBotao ">
                <RadioButtons
                options={['Macho', 'Femêa']}
                setParentState={(value: string) => handleChange(value, 'sexo')}
                />
            </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                PORTE
            </div>
            <div className="containerBotao ">
                <RadioButtons
                options={['Pequeno', 'Médio', 'Grande']}
                setParentState={(value: string) => handleChange(value, 'porte')}
                />
            </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                IDADE
            </div>
            <div className="containerBotao ">
                <RadioButtons
                options={['Filhote', 'Adulto', 'Idoso']}
                setParentState={(value: string) => handleChange(value, 'idade')}
                />
            </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                TEMPERAMENTO
            </div>
            <div className="containerBotao ">
                <BotaoQuadrado
                options={['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso' ]}
                setParentState={(value: string) => handleChange(value, 'temperamento')}
                columns={3}
                />
            </div>
            <div style={{ fontSize: '16px', marginTop: '20px', color: '#f7a800', marginBottom: '8px', marginLeft: '24px' }}>
                SAUDE
            </div>
            <div className="containerBotao ">
                <BotaoQuadrado
                options={['Vacinado', 'Vermifugado', 'Castrado', 'Doente']}
                setParentState={(value: string) => handleChange(value, 'saude')}
                columns={2}
                />
            </div>
            <div className="inputsinfo">
                <p>SOBRE O ANIMAL</p>
                <InputData type='text' name='sobreAnimal' placeholder='Compartilhe a história do animal' onChange={handleChange}/>
            <div className="signField">
                <GreenButton label='REGISTRAR ANIMAL' onClick={handleSubmit}/>
            </div>
            </div>

            { msgSign && (
                <ModalMsg msg={msgSign} state={stateSign}/>
            )}
        </>
    );
}