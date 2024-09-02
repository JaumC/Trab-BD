import { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';
import './Sidecontent.css';
import { NavLink } from 'react-router-dom';
import api from '../../../axiosConfig';

export function Sidecontent() {
    const { isLogged, userId, logout } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isInfoOpen, setInfoOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<{ nome_completo: string; user_id: number | null }>({ nome_completo: '', user_id: null });

    const fetchUserInfo = async (userId: string) => {
        try {
            const response = await api.get(`/user-info/${userId}`);
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        if (isLogged && userId) {
            fetchUserInfo(userId);
        }
    }, [isLogged, userId]);

    const toggleMenus = () => setMenuOpen(!isMenuOpen);
    const toggleInfo = () => setInfoOpen(!isInfoOpen);

    const logouting = () => {
        logout();
        window.location.reload()
    };

    return (
        <div className='side-content'>
            {isLogged ?
                <>
                    <div className="userSection">
                        <div className='imageContainer'>
                            <img src="src/assets/user.jpg" alt="User" />
                        </div>
                        <div className='userName'>
                            <p>{userInfo.nome_completo || 'Carregando...'}</p>
                        </div>
                    </div>

                    <div className="menuContainer">
                        <NavLink to="/MeuPerfil">Meu perfil</NavLink>
                        <NavLink to="/Login">Meus Pets</NavLink>
                        <NavLink to="/Login">Favoritos</NavLink>
                        <NavLink to="/Login">Organização</NavLink>
                        <div className="drawerItem drawerItem-yellow" onClick={toggleMenus}>
                            Menus <span>{isMenuOpen ? '▲' : '▼'}</span>
                        </div>
                        {isMenuOpen && (
                            <div className="collapsibleMenu">
                                <NavLink to="/PreencherCadastroPets">Cadastrar um pet</NavLink>
                                <NavLink to="/Home">Adotar um Pet</NavLink>
                                <NavLink to="/Home">Ajudar um pet</NavLink>
                                <NavLink to="/Home">Apadrinhar um pet</NavLink>
                            </div>
                        )}
                        <div className='drawerItem drawerItem-blue' onClick={toggleInfo}>
                            Informações <span>{isInfoOpen ? '▲' : '▼'}</span>
                        </div>
                        {isInfoOpen && (
                            <div className="collapsibleMenu">
                                <NavLink to="/Login">Dicas</NavLink>
                                <NavLink to="/Login">Eventos</NavLink>
                                <NavLink to="/Login">Legislação</NavLink>
                                <NavLink to="/Login">Termos de Adoção</NavLink>
                                <NavLink to="/Login">Historias de Adoção</NavLink>
                            </div>
                        )}
                    </div>
                    <footer onClick={logouting} className='btnSair'>
                        <NavLink to="/">Sair</NavLink>
                    </footer>
                </>
                :
                <>
                    <div className="userSection">
                        <div className='imageContainer'>
                            <img src="src/assets/user.jpg" alt="User" />
                        </div>
                        <div className='userName'>
                            <p>Convidado</p>
                        </div>
                    </div>
                    <div className="menuContainer">
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/sign">Cadastre-se</NavLink>
                        <NavLink to="/PreencherCadastroPets">Cadastrar um pet</NavLink>
                    </div>
                </>
            }
        </div>
    );
}