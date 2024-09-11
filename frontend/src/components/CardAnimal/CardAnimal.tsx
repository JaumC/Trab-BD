import { useAuth } from '../../AuthContext';
import './CardAnimal.css'
import React,{ useState,useEffect } from 'react';
import { useNavigate } from'react-router-dom';
import { FaHeart } from'react-icons/fa';
import { FiHeart } from'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { api } from '../../axiosConfig';
import { ModalInfo } from '../ModalInfo/ModalInfo';


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
    const [curtida, setCurtida] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false); 
    const [petId, setPetId] = useState<number | null>(null);
    const navigate = useNavigate()


    const navigateToDetails = () => {
        navigate (`/DetalhesAnimal/${id}`);
    };

    const modalInfoPet = () => {
        setPetId(id);
        setShowInfoModal(true);
    };

    const handleCloseModal = () => {
        setShowInfoModal(false);
    };

    useEffect(() => {

        const checkFavorito = async () => {
            try{
                const response = await api.get(`/favs/favoritos/${userId}/${id}`);
                setCurtida(response.data.isFavorite);
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
                    await api.post('/favs/favoritos', { usuarioId: userId, animalId: id });
                } else {
                    await api.delete(`/favs/favoritos/${userId}/${id}`);
                    window.location.reload()
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
    
    return (
      <>
        <div key={key} className='cardStyle' style={{ backgroundColor: color }}>
          <div className='headerStyle'>
            <p onClick={navigateToDetails}>{nomeAnimal}</p>
            <button onClick={curtir} className='curtirButton'>
              {curtida ? <FaHeart color="red" /> : <FiHeart color="gray" />}
            </button>
          </div>
          <div className='imageContainerStyle' onClick={navigateToDetails}>
            {animalFoto && (
              <img
                src={animalFoto}
                alt={nomeAnimal}
                className='imageStyle'
              />
            )}
          </div>
          <div className='borderBottomStyle' style={{ backgroundColor: color }}>
            <span className='disponibilidadeEmoji'>
              <p>
                Disponibilidade:
                {disponivel ? emojis[1].icon : emojis[0].icon}
              </p>
            <div onClick={modalInfoPet} className='infoIcon'>
              <AiOutlineInfoCircle />
            </div>
            </span>
          </div>
        </div>
        {showInfoModal && <ModalInfo show={showInfoModal} onClose={handleCloseModal} petId={petId} />}
        </>
    );
}