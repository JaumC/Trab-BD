import { Sidebar } from "../routes/Sidebar/Sidebar";
import { useAuth } from '../AuthContext';
import '../styles/Footer.css';
import '../styles/Home.css';

export function Home(){

    const { isLogged } = useAuth()

    return(
        <>
            <Sidebar/>
            <div>
                <div className='title'>
                    <h1>Olá!</h1>
                    <p>Bem vindo ao Meau! <br/> Aqui você pode adotar, doar e ajudar <br/> cães e gatos com facilidade. <br/> Qual o seu interesse?</p>
                </div>
                {isLogged ? 
                <div className='buttonField'>
                    <a href="/adotar" className='actionButton'>ADOTAR</a>
                    <a href="/ajudar" className='actionButton'>AJUDAR</a>
                    <a href="/PreencherCadastroPets" className='actionButton'>CADASTRAR ANIMAL</a>
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
            </div>
            <div className='footer'>
                <img src="src/assets/Meau_marca_2.png" alt="" />
            </div>
        </>
    )
}