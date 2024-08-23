import { Footer } from '../Footer/Footer'
import './Main.css'
import { useAuth } from '../../AuthContext';

export function Main(){
    const { isLogged } = useAuth()

    return(
        <div>
            <div className='title'>
                <h1>Olá!</h1>
                <p>Bem vindo ao Meau! <br/> Aqui você pode adotar, doar e ajudar <br/> cães e gatos com facilidade. <br/> Qual o seu interesse?</p>
            </div>
            {isLogged ? 
            <div className='buttonField'>
                <a className='actionButton'>ADOTAR</a>
                <a className='actionButton'>AJUDAR</a>
                <a className='actionButton'>CADASTRAR ANIMAL</a>
            </div>
            :
            <>
                <div className='buttonField'>
                    <a href='/signed' className='actionButton'>ADOTAR</a>
                    <a href='/signed' className='actionButton'>AJUDAR</a>
                    <a href='/signed' className='actionButton'>CADASTRAR ANIMAL</a>
                </div>
                <p className='middleText'>
                    <a href='/login'>Login</a>
                </p>
            </>
            }

            <Footer/>
        </div>
    )
}