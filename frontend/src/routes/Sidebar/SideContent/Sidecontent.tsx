import { useAuth } from '../../../AuthContext';
import React, {useState} from 'react';
import './Sidecontent.css'
import { Home } from '../../../pages/Home';
import { NavLink} from'react-router-dom';
import { Sidebar } from '../../../components/Sidebar/Sidebar';

export function Sidecontent(){
    const { isLogged } = useAuth()
    const { logout } = useAuth()

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isInfoOpen, setInfoOpen] = useState(false);

    const toggleMenus = () => setMenuOpen(!isMenuOpen);
    const toggleInfo = () => setInfoOpen(!isInfoOpen);


    const logouting = () => {
        logout()
    }

    return(
        <div className='side-content'>  
            {!isLogged ?
            <>       {/* User section (parte verde) */}
                <div className="userSection">
                    <div className='imageContainer'>
                        <img src="src/assets/user.jpg" alt="User" />
                    </div>
                    <div className='userName'>
                        <p>Convidado</p> {/* user ? dadosUser.nome : Convidado */}
                    </div>                    
                </div>

                <div className="menuContainer">
                    <NavLink to ="/MeuPerfil">Meu perfil</NavLink>
                    <NavLink to ="/Login">Meus Pets</NavLink>
                    <NavLink to ="/Login">Favoritos</NavLink>
                    <NavLink to ="/Login">Organização</NavLink>
                    <div className="drawerItem drawerItem-yellow" onClick={toggleMenus}>
                        Menus <span>{isMenuOpen ? '▲' : '▼'}</span>
                    </div>
                    {isMenuOpen && (
                    <div className="collapsibleMenu">
                        <NavLink to="/Login">Cadastrar um pet</NavLink>
                        <NavLink to="/Home">Adotar um Pet</NavLink>
                        <NavLink to="/Home">Ajudar um pet</NavLink>
                        <NavLink to="/HOme">Apadrinhar um pet</NavLink>
                    </div>
                    )}
                    <div className='drawerItem drawerItem-blue' onClick={toggleInfo}>
                        Informações <span>{isInfoOpen? '▲' : '▼'}</span>
                    </div>
                    {isInfoOpen && (
                        <div className="collapsibleMenu" >
                            <NavLink to="/Login">Dicas</NavLink>
                            <NavLink to="/Login">Eventos</NavLink>
                            <NavLink to="/Login">Legislação</NavLink>
                            <NavLink to="/Login">Termos de Adoção</NavLink>
                            <NavLink to="/Login">Historias de Adoção</NavLink>
                        </div>
                    )}
                </div>
                    <footer className='btnSair'>
                        <NavLink to="/">
                            Sair
                        </NavLink>

                    </footer>
            </>
            :
            <>
                <button onClick={logouting}>Deslogar</button>
            </>
            }
        </div>
    )
}