import { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';
import './Sidecontent.css';
import { NavLink } from 'react-router-dom';


export function Sidecontent() {
    const { isLogged, logout, userInfo, fetchUserInfo } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isInfoOpen, setInfoOpen] = useState(false);
    const [shouldRecheck, setShouldRecheck] = useState(false); // Controle de rechecagem

    
    // useEffect para monitorar mudanças no estado de autenticação
    useEffect(() => {
        // A função será chamada sempre que isLogged ou userInfo mudarem
        if (isLogged) {
            if(!userInfo|| shouldRecheck){
                console.log('Tentando buscar as informações recentes...');
                fetchUserInfo(); 
                setShouldRecheck(false); //Reset após buscar
            } else {
                console.log('Usuário está logado:', userInfo);
            }
        } else if (!isLogged && !shouldRecheck) {
            // Se o usuário não estiver logado, tenta revalidar a autenticação
            console.log('Usuário não está logado, tentando revalidar');
            setShouldRecheck(true); // Sinaliza que está rechecando
            setTimeout(()=>{
                fetchUserInfo(); // Tenta buscar as informações recentes novamente
            },1000);
        }
    }, [isMenuOpen]); // useEffect é disparado quando isMenuOpen é true

    console.log('isLogged: ',isLogged);
    console.log('isLogged: ',userInfo);


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
                            {userInfo ? <p>{userInfo.nome_usuario }</p> : <p>Carregando...</p>}
                        </div>
                    </div>

                    <div className="menuContainer">
                        <NavLink to="/MeuPerfil">Meu perfil</NavLink>
                        <NavLink to="/MeusPets">Meus Pets</NavLink>
                        <NavLink to="/Favoritos">Favoritos</NavLink>
                        <div className="drawerItem drawerItem-yellow" onClick={toggleMenus}>
                            Menus <span>{isMenuOpen ? '▲' : '▼'}</span>
                        </div>
                        {isMenuOpen && (
                            <div className="collapsibleMenu">
                                <NavLink to="/PreencherCadastroPets">Cadastrar um pet</NavLink>
                                <NavLink to="/Adotar">Adotar um Pet</NavLink>
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
                    </div>
                </>
            }
        </div>
    );
}