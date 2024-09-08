import { useAuth } from '../../AuthContext';
import './CardAnimal.css'
import React,{ useState,useEffect } from 'react';
import { useNavigate } from'react-router-dom';
import { FaHeart } from'react-icons/fa';
import { FiHeart } from'react-icons/fi';
import { api } from '../../axiosConfig';



type CardAnimalProps = {
    key?: number;
    id: number;
    nomeAnimal?: string;
    animalFoto?: string;
    color?: string;
    disponivel: boolean;
}

export function CardAnimal({ key, id, nomeAnimal, animalFoto, color='#cfe9e5', disponivel }: CardAnimalProps){

    const { userId } = useAuth();
    const [curtida , setCurtida] = useState(false);
    const navigate = useNavigate();

    const navigateToDetails = () => {
        navigate (`/DetalhesAnimal`);
    };

    useEffect(() => {

        const checkFavorito = async () => {
            try{
                const response = await api.get(`favoritos/${userId}/${id}`);
                setCurtida(response.data.isFavorite);
                const data = response.data;
                //if (data.includes(nomeAnimal)) setCurtida(true)
            } catch (error) {
                console.log('Error checking favorito:', error);
            }
        };

        if (userId){
            checkFavorito();
        }
    },[userId, id]); 


    const curtir = async () => {
        if (userId){
            try{
                const newCurtidaStatus =! curtida;
                setCurtida(newCurtidaStatus);

                 if(newCurtidaStatus){
                    await api.post('/favoritos', { usuarioId: userId, animalId: id });
                } else {
                    await api.delete(`/favoritos/${userId}/${id}`);
                } 
 
            } catch (error){
                console.log('Error updating curtindo:', error);
                setCurtida(!curtida);
                }
            } 
        };
    

    const emojis = [ 
        { title: 'Indisponivel', icon: ' 🚫'},
        { title: 'Disponivel', icon: ' ✅'}
    ];

    return(
        <>
          <div key={key} className='cardStyle' style={{ backgroundColor: color}}>
                <div className='headerStyle'>
                    <p onClick={navigateToDetails}>{nomeAnimal}</p>
                    <button onClick={curtir} className='curtirButton'>
                        {curtida ? <FaHeart color="red" /> : <FiHeart color="gray" />}
                    </button>
                </div>
                <div className='imageContainerStyle'onClick={navigateToDetails} >
                    {animalFoto && (
                        <img 
                            src={animalFoto} 
                            alt={nomeAnimal} 
                            className='imageStyle'
                        />
                    )}
                </div>
                <div className='borderBottomStyle' style={{ backgroundColor: color}}>
                    <span className='disponibilidadeEmoji'>
                        <p>Disponibilidade:
                         {disponivel ? emojis[1].icon : emojis[0].icon}
                        </p>
                    </span>
                </div>
            </div>
        </>
    );
}