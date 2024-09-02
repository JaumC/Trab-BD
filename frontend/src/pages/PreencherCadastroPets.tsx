import { GreenButton } from "../components/GreenButton/GreenButton";
import BotaoQuadrado from "../components/BotõesInput/BotaoQuadrado";
import RadioButtons from "../components/BotõesInput/BotaoRedondo";
import { InputData } from '../components/InputData/InputData';
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { Navbar } from "../components/Navbar/Navbar";
import { useState, ChangeEvent } from 'react';
import "../styles/PreencherCadastroPets.css"
import api from '../axiosConfig';
import axios from 'axios';

type AnimalData = {
    nomeAnimal: string;
    especie: string;
    sexo: string;
    porte: string;
    idade: string;
    temperamento: string;
    saude: string;
    sobreAnimal: string;
    animalFoto: string | File;
};

export function PreencherPet() {
    const [msgSign, setMsgSign] = useState<string>('');
    const [stateSign, setStateSign] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [animalData, setAnimalData] = useState<AnimalData>({
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

    const handleChange = (
        eventOrValue: ChangeEvent<HTMLInputElement> | string | string[],
        fieldName?: string
    ) => {
        let name: string;
        let value: string | string[];

        if (typeof eventOrValue === 'string' || Array.isArray(eventOrValue)) {
            value = eventOrValue;
            name = fieldName || '';
        } else {
            name = eventOrValue.target.name;
            value = eventOrValue.target.value;
        }

        setAnimalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageSrc(URL.createObjectURL(file));
            setAnimalData(prev => ({
                ...prev,
                animalFoto: file,
            }));
        }
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

        const hasEmptyFields = requiredFields.filter(field => !animalData[field]);

        if (hasEmptyFields.length > 0) {
            setMsgSign(`Existem campos não preenchidos: ${hasEmptyFields.join(', ')}`);
            setStateSign(true);
            return;
        }

        const formData = new FormData();
        Object.keys(animalData).forEach((key) => {
            const value = animalData[key as keyof AnimalData];
            if (key === 'animalFoto' && value instanceof File) {
                formData.append('animalFoto', value);
            } else {
                formData.append(key, value as string);
            }
        });

        try {
            const response = await api.post('/register-animal', formData);
            setMsgSign(response.data.OK || response.data.message);
            setStateSign(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setMsgSign(error.response.data?.DENY || "Erro ao Cadastrar. Tente novamente.");
                } else {
                    setMsgSign("Erro de rede ou servidor. Tente novamente.");
                }
            } else {
                setMsgSign("Ocorreu um erro inesperado. Tente novamente.");
            }
            setStateSign(true);
        }
    };

    const handleUploadClick = () => {
        const fileInput = document.getElementById('file-upload') as HTMLElement;
        fileInput.click();
    };


    return (
        <div className="mainSignAnimal"> 
            <Navbar title='Cadastro do Animal' color="#FFD358"/>

            <div className='titlesSignAnimal'>NOME DO ANIMAL
                <div style={{paddingTop: '10px'}}>
                <InputData type='text' name='nomeAnimal' placeholder='Digite o Nome' onChange={handleChange}/>
                </div>
            </div>
            <div className="photo-upload-container">
                { imageSrc ? (
                    <img src={imageSrc} alt="Uploaded" className="image-container" />
                ) : (
                    <div className="photo-upload-button" onClick={handleUploadClick}>
                        <div className="icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" fill="#757575">
                                <path d="M13 7h-2v3H8v2h3v3h2v-3h3v-2h-3V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                        </div>
                        <span className="upload-text">adicionar fotos</span>
                    </div>

                )}

                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>

            <div className="radiosInfo">
                <div className='titlesSignAnimal'>ESPÉCIE</div>
                <div className="containerBotao ">
                    <RadioButtons
                    options={['Cachorro', 'Gato']}
                    setParentState={(value: string) => handleChange(value, 'especie')}
                    />
                </div>

                <div className='titlesSignAnimal'>SEXO</div>
                <div className="containerBotao ">
                    <RadioButtons
                    options={['Macho', 'Femêa']}
                    setParentState={(value: string) => handleChange(value, 'sexo')}
                    />
                </div>

                <div className='titlesSignAnimal'>PORTE</div>
                <div className="containerBotao ">
                    <RadioButtons
                    options={['Pequeno', 'Médio', 'Grande']}
                    setParentState={(value: string) => handleChange(value, 'porte')}
                    />
                </div>

                <div className='titlesSignAnimal'>IDADE</div>
                <div className="containerBotao ">
                    <RadioButtons
                    options={['Filhote', 'Adulto', 'Idoso']}
                    setParentState={(value: string) => handleChange(value, 'idade')}
                    />
                </div>

                <div className='titlesSignAnimal'>TEMPERAMENTO</div>
                <div className="containerBotao ">
                    <BotaoQuadrado
                    options={['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso' ]}
                    setParentState={(value: string[]) => handleChange(value, 'temperamento')}
                    columns={3}
                    />
                </div>

                <div className='titlesSignAnimal'>SAUDE</div>
                <div className="containerBotao ">
                    <BotaoQuadrado
                    options={['Vacinado', 'Vermifugado', 'Castrado', 'Doente']}
                    setParentState={(value: string[]) => handleChange(value, 'saude')}
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
            </div>

            { msgSign && (
                <ModalMsg msg={msgSign} state={stateSign}/>
            )}
        </div>
    );
}