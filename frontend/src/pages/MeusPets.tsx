import React, { useCallback, useState, useEffect } from "react";
import ModalLoading from "../components/ModalLoading/ModalLoading";
import { useAuth } from "../AuthContext"; // Contexto de autenticação
import { api } from "../axiosConfig";


export default function MeusPets() {

    const { userId } = useAuth();
    const [meusPets, setMeusPets] = useState([]);
    const [loading, setLoading] = useState(true);


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

    useEffect(() =>{
        // Faz a requisição somente se o `userId` estiver definido
        if (userId) {
            fetchMyPets(userId);
        } else {
            console.log('userId não definido');
            setLoading(false);
        }
    }, [userId]);  // Reexecuta quando o userId for atualizado

    if (loading) {
        return (
            <ModalLoading spinner={loading} color='#cfe9e5' />
        );
    } else {
        return (
            <div style={{ backgroundColor: '#fafafa', padding: 20 }}>
                {meusPets.length >0 ? (
                    meusPets.map(pet => (
                        <div key={pet.id}>
                            <p><strong>Nome: </strong>{pet.idade}</p>
                        </div>
                    ))
                ): (<p>Nenhum</p>)}
            </div>
        );
    }
}
