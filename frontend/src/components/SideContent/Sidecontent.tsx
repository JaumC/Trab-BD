import { useAuth } from '../../AuthContext';
import './Sidecontent.css'

export function Sidecontent(){
    const { isLogged } = useAuth()
    const { logout } = useAuth()

    const logouting = () => {
        logout()
    }

    return(
        <div className='side-content'>  
            {!isLogged ?
            <>
                <p>você não esta logado</p>
            </>
            :
            <>
                <button onClick={logouting}>Deslogar</button>
            </>
            }
        </div>
    )
}