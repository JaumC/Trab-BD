import { useState } from "react";
import { useAuth } from '../AuthContext';
import axios from 'axios';
import RadioButtons from "../components/BotõesInput/BotaoRedondo";
import BotaoQuadrado from "../components/BotõesInput/BotaoQuadrado";
import { Navbar } from "../components/Navbar/Navbar";
import { InputData } from '../components/InputData/InputData';
import { ModalMsg } from '../components/ModalMsg/ModalMsg';
import { GreenButton } from "../components/GreenButton/GreenButton";
import "../styles/PreencherCadastroPets.css";

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
    usuario_id: string;
};

export function PreencherPet() {
    const { userId } = useAuth();
    const [msgSign, setMsgSign] = useState<string>('');
    const [stateSign, setStateSign] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState(''); // Estado para armazenar a URL da imagem

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
        usuario_id: userId,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string | string[], fieldName?: string) => {
        let value;
        let name;

        if (e && typeof e === 'object' && 'target' in e) {
            name = e.target.name;
            value = e.target.value;
        } else {
            name = fieldName;
            value = e;
        }

        const newValue = Array.isArray(value) ? value : [value];

        setAnimalData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields: (keyof AnimalData)[] = [
            'nomeAnimal',
            'especie',
            'sexo',
            'porte',
            'idade',
            'temperamento',
            'saude',
            'sobreAnimal',
        ];

        const hasEmptyFields = requiredFields.filter(field => !AnimalData[field]);

        if (hasEmptyFields.length > 0 || !imageSrc) {
            setMsgSign("Existem campos não preenchidos:\n" + hasEmptyFields.join(', '));
            return;
        }

        try {
            const response = await fetch('http://localhost:50/animals/register-animal', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(AnimalData),
            });

            const data = await response.json();
            setMsgSign(data.message || "Animal registrado com sucesso!")
            setStateSign(true)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log('Erro ao Cadastrar:', error);
                    setMsgSign(error.response.data?.DENY || "Erro ao Cadastrar. Tente novamente.");
                } else {
                    setMsgSign("Erro de rede ou servidor. Tente novamente.");
                }
            }
        }
    };

    // Função para acionar o clique do input do tipo file
    const handleUploadClick = () => {
        document.getElementById('file-upload').click();
    };

    // Função para lidar com o arquivo selecionado
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setAnimalData({ ...AnimalData, animalFoto: base64String });
                setImageSrc(URL.createObjectURL(file)); // Armazena o arquivo no estado
            }
            reader.readAsDataURL(file); // Lê o arquivo como URL de dados
        }
    };

    return (
        <div className="mainSignAnimal">
            <Navbar title='Cadastro do Animal' color="#FFD358" />

            <div className='titlesSignAnimal'>NOME DO ANIMAL
                <div style={{ paddingTop: '10px' }}>
                    <InputData type='text' name='nomeAnimal' placeholder='Digite o Nome' onChange={handleChange} />
                </div>
            </div>

            <div className="photo-upload-container">
                {imageSrc ? (
                    <img src={imageSrc} alt="Uploaded" className="image-container" onClick={handleUploadClick} />
                ) : (
                    <div className="photo-upload-button" onClick={handleUploadClick}>
                        <div className="icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" fill="#757575">
                                <path d="M13 7h-2v3H8v2h3v3h2v-3h3v-2h-3V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
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
                        options={['Brincalhão', 'Tímido', 'Calmo', 'Guarda', 'Amoroso', 'Preguiçoso']}
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
                    <InputData type='text' name='sobreAnimal' placeholder='Compartilhe a história do animal' onChange={handleChange} />
                    <GreenButton label='Cadastrar' onClick={handleSubmit} />
                </div>
            </div>

            { msgSign && (
                <ModalMsg msg={msgSign} state={stateSign}/>
            )}
        </div>
    )
}
