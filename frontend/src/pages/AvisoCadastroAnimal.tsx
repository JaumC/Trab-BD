import '../styles/Home.css'
import { Navbar } from "../components/Navbar/Navbar";
import { InfoTexts } from '../components/InfoTexts/InfoTexts';



export function AvisoCadastroAnimal() {

    return (
        <>
            <Navbar title='Cadastro do Animal' navigateTo="/" color='#FFD358' />

            <div className='title'>
                <h1>Eba!</h1>
                <p>O cadastro do seu Pet foi realizado com sucesso !</p>
            </div>
        </>
    );
}
