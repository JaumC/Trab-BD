import React, { useState, useEffect } from "react";
import ModalLoading from "../components/ModalLoading/ModalLoading";
import { useAuth } from "../AuthContext"; // Contexto de autenticação
import { api } from "../axiosConfig";
import { Navbar } from "../components/Navbar/Navbar";

export default function MeusPets() {
    const { userId } = useAuth();
    const [meusPets, setMeusPets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPets = async (userId) => {
        try {
            const response = await api.get(`/meus-pets/${userId}`);
            const data = await response.data;
            data.pets.forEach(pet => {
                console.log('Foto:', pet.animalFoto);
            });
            setMeusPets(data.pets);
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
                {meusPets.map(pet => (
                    <div key={pet.id}>
                        <h2>{pet.nomeAnimal}</h2>
                        <p>Espécie: {pet.especie}</p>
                        <p>Sexo: {pet.sexo}</p>
                        <p>Porte: {pet.porte}</p>
                        <p>Idade: {pet.idade}</p>
                        <p>Temperamento: {pet.temperamento}</p>
                        <p>Saúde: {pet.saude}</p>
                        <p>Sobre o Animal: {pet.sobreAnimal}</p>
                        {pet.animalFoto && (
                            <img 
                                src={pet.animalFoto} 
                                alt={pet.nomeAnimal} 
                                style={{ width: '200px', height: 'auto' }} // Ajuste o estilo conforme necessário
                            />
                        )}
                    </div>
                ))}
            </>
        );
    }
}
