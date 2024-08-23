import { useAuth } from '../../AuthContext';
import './Sidecontent.css'

export function Sidecontent(){
    const { isLogged } = useAuth()

    return(
        <div className='side-content'>  
            {!isLogged ?
            <>
                <p>você não esta logado</p>
            </>
            :
            <>
                <p>Voce esta logado</p>
            </>
            }
        </div>
    )
}