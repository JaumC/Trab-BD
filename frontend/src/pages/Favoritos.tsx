import React, { useState, useEffect } from "react";
import ModalLoading from "../components/ModalLoading/ModalLoading";
import { useAuth } from "../AuthContext"; 
import { api } from "../axiosConfig";
import { Navbar } from "../components/Navbar/Navbar";
import { CardAnimal } from "../components/CardAnimal/CardAnimal";
import '../styles/Favoritos.css';
import { NavLink } from 'react-router-dom';

export function Favoritos() {
    const { userId } = useAuth();
    const [favoritePets, setFavoritePets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavoritePets = async (userId) => {
        try {
            const response = await api.get(`/favs/favoritos/${userId}`);
            const data = response.data;

            // Clean the pet data by removing curly braces
            const cleanedPets = data.pets.map(pet => {
                return {
                    ...pet,
                    nomeAnimal: pet.nomeAnimal?.replace(/{|}/g, ''),
                    animalFoto: pet.animalFoto,
                    // Adicione aqui o mesmo tratamento para outras propriedades, se necessário
                };
            });

            setFavoritePets(cleanedPets);
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar favoritos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchFavoritePets(userId);
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
                <Navbar title="Meus Favoritos" />
                <div className='container-pets'>
                    {favoritePets.length > 0 ? (
                        favoritePets.map((pet) => (
                            <CardAnimal 
                                key={pet.id} 
                                id={pet.id} 
                                nomeAnimal={pet.nomeAnimal} 
                                animalFoto={pet.animalFoto}
                            />
                        ))
                    ) : (
                        <div className='no-fav-message'>
                            <NavLink to="/MeusPets">Você ainda não tem pets favoritos! Clique para cadastrar um!</NavLink>
                        </div>
                    )}
                </div>
            </>
        );
    }
}