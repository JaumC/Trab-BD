import React, { useEffect, useState } from 'react';
import { Sidebar } from '../routes/Sidebar/Sidebar';
import '../styles/MeuPerfil.css';
import defaultImage from '../assets/b.jpeg'

import { Navbar } from "../components/Navbar/Navbar";


export function MeuPerfil(){
    const [dadosUser, setDadosUser] = useState(null);
    const [esperando, setEsperando] = useState(true);


    useEffect(() => {
        const fetchUserData = async () => {
            // Simulate fetching data
            await new Promise(resolve => setTimeout(resolve, 2000)); // Dummy delay
            setDadosUser({
                nome_completo: "John Doe",
                idade: 30,
                email: "john@example.com",
                estado: "State",
                cidade: "City",
                endereco: "1234 Street",
                telefone: "123-456-7890",
                nome_usuario: "john_doe"
            });
            setEsperando(false);
        };
        fetchUserData();
    }, []);

    if (esperando) {
        return <div className="modal-loading">Loading...</div>; // Simplified loading modal
    }

    return(
        <>
        <Navbar title={dadosUser.nome_completo}/>
        <div className="profile-container">
            <img src={dadosUser && dadosUser.image ? dadosUser.image : defaultImage} alt="Profile" className="profile-image"/>
            <div className="profile-details">
                <p className='label'> NOME COMPLETO</p>
                <p className='dado'>Name: {dadosUser.nome_completo}</p>

                <p className='label'>IDADE</p>
                <p className='dado'>Age: {dadosUser.idade} years</p>

                <p className='label'>EMAIL</p>
                <p className='dado'>Email: {dadosUser.email}</p>

                <p className='label'>ESTADO</p>
                <p className='dado'>State: {dadosUser.estado}</p>

                <p className='label'>CIDADE</p>
                <p className='dado'>City: {dadosUser.cidade}</p>

                <p className='label'>ENDEREÇO</p>
                <p className='dado'>Address: {dadosUser.endereco}</p>

                <p className='label'>TELEFONE</p>
                <p className='dado'>Phone: {dadosUser.telefone}</p>

                <p className='label'>NOME DO USUÁRIO</p>
                <p className='dado'>Username: {dadosUser.nome_usuario}</p>

                <p className='label'>Historico</p>
                <p className='dado'>Adotou 1 gato</p>
            </div>
        </div>
        </>
    )
}