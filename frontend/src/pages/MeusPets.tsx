import React, { useState, useEffect } from "react";
import ModalLoading from "../components/ModalLoading/ModalLoading";
import { useAuth } from "../AuthContext"; 
import { api } from "../axiosConfig";
import { Navbar } from "../components/Navbar/Navbar";
import { CardAnimal } from "../components/CardAnimal/CardAnimal";
import '../styles/MeuPets.css';
import { NavLink } from 'react-router-dom';


export default function MeusPets() {
    const { userId } = useAuth();
    const [meusPets, setMeusPets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPets = async (userId) => {
        try {
            const response = await api.get(`/animals/meus-pets/${userId}`);
    
            if (response.status === 200) {
                const data = response.data;
    
                const cleanedPets = data.pets.map(pet => {
                    return {
                        ...pet,
                        nomeAnimal: pet.nomeAnimal?.replace(/{|}/g, ''),
                        animalFoto: pet.animalFoto,
                    };
                });
    
                setMeusPets(cleanedPets);
            }
        } catch (error) {
            console.error('Erro ao buscar pets:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
        } finally {
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
                <div className='container-favs'>
                    {meusPets != '' ? (
                        meusPets.map((pet, index) => (
                            <CardAnimal key={index} 
                            id={pet.id} 
                            nomeAnimal={pet.nomeAnimal} 
                            animalFoto={pet.animalFoto} />
                        ))
                    ) : (
                        <div className='no-pets-message'>
                            <NavLink to="/PreencherCadastroPets">Você não tem nenhum pet cadastrado! Clique para cadastrar um!</NavLink>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
