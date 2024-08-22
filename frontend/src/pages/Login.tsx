import { Footer } from "../components/Footer/Footer";
import { Navbar } from "../components/Navbar/Navbar";
import { LoginData } from "../components/Login/LoginData";

export function Login(){
    return(
        <>
            <Navbar title='Login'/>
            <LoginData/>
            <Footer/>
        </>
    )
}