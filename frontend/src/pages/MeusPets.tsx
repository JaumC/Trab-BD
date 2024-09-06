import React, { useCallback, useState, useEffect } from "react";
import ModalLoading from "../components/ModalLoading/ModalLoading";
import { useAuth } from "../AuthContext"; // Contexto de autenticação
import { api } from "../axiosConfig";


export default function MeusPets() {

    const { userId } = useAuth();
    const [meusPets, setMeusPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState([]);  // Armazena as imagens dos pets


    const fetchMyPets = async (userId) => {
        try {
            const response = await api.get(`/meus-pets/${userId}`);
            const data = await response.data;
            console.log('Meus pets:', data.pets);  // Assumindo que a resposta é um objeto com uma chave 'pets'
            setMeusPets(data.pets); // Assumindo que a resposta é um objeto com uma chave 'pets'
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar pets:', error);
            setLoading(false);
        }
    };

    // Função para processar as imagens recebidas em Base64
    const processImages = (pets) => {
        pets.forEach((pet, index) => {
            if (pet.animalFoto) {
                setImageSrc((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[index] = `data:image/jpeg;base64,${pet.animalFoto}`;
                    return newImages;
                });
            }
        });
    };

    useEffect(() =>{
        // Faz a requisição somente se o `userId` estiver definido
        if (userId) {
            fetchMyPets(userId);
        } else {
            console.log('userId não definido');
            setLoading(false);
        }
    }, [userId]);  // Reexecuta quando o userId for atualizado

    // useEffect para processar as imagens após receber os pets
    useEffect(() => {
        if (meusPets.length > 0) {
            processImages(meusPets);
        }
    }, [meusPets]);

    // Função para processar a imagem base64 e armazená-la na lista de imageSrc
    const handleFileReceive = (base64String, petIndex) => {
        setImageSrc(prevState => {
            const updatedImages = [...prevState];
            updatedImages[petIndex] = `data:image/jpeg;base64,${base64String}`;
            return updatedImages;
        });
    };

    if (loading) {
        return (
            <ModalLoading spinner={loading} color='#cfe9e5' />
        );
    } else {
        return (
            <div style={{ backgroundColor: '#fafafa', padding: 20 }}>
                {meusPets.length > 0 ? (
                    meusPets.map((pet, index) => (
                        <div key={pet.id}>
                            <p><strong>Nome: </strong>{pet.nome}</p>
                            {imageSrc[index] && (
                                <img src={imageSrc[index]} alt="Pet" style={{ width: '200px', height: 'auto' }} />
                            )}
                        </div>
                    ))
                ): (<p>Nenhum</p>)}
                <p><strong>Nome: </strong>{'algo'}</p>
            </div>
        );
    }
}
