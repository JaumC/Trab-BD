import { Footer } from "../components/Footer/Footer";
import { Navbar } from "../components/Navbar/Navbar";
import { SignData } from "../components/Sign/SignData";

export function Sign(){
    return(
        <div>
            <Navbar title='Cadastro de Usuário'/>
            <SignData/>
            <Footer/>
        </div>
    )
}