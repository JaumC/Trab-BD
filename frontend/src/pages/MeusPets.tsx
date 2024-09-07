import React, { useState, useEffect } from "react";
import ModalLoading from "../components/ModalLoading/ModalLoading";
import { useAuth } from "../AuthContext"; 
import { api } from "../axiosConfig";
import { Navbar } from "../components/Navbar/Navbar";
import { CardAnimal } from "../components/CardAnimal/CardAnimal";
import '../styles/MeuPets.css';

export default function MeusPets() {
    const { userId } = useAuth();
    const [meusPets, setMeusPets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPets = async (userId) => {
        try {
            const response = await api.get(`/meus-pets/${userId}`);
            const data = response.data;

            // Limpar os dados dos pets removendo as chaves
            const cleanedPets = data.pets.map(pet => {
                return {
                    ...pet,
                    nomeAnimal: pet.nomeAnimal?.replace(/{|}/g, ''),
                    animalFoto: pet.animalFoto,
                    // Adicione aqui o mesmo tratamento para outras propriedades, se necessário
                };
            });

            setMeusPets(cleanedPets);
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar pets:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchMyPets(userId);
        } else {
            console.log('userId não definido');
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <ModalLoading spinner={loading} color="#cfe9e5" />;
    } else {
        return (
            <>
                <Navbar title="Meus Pets" />
                <div className='container-pets'>
                    {meusPets.map((pet, index) => (
                        <CardAnimal key={index} nomeAnimal={pet.nomeAnimal} animalFoto={pet.animalFoto} />
                    ))}
                </div>
            </>
        );
    }
}
