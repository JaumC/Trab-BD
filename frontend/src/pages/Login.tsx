import '../styles/Footer.css';
import { Navbar } from "../components/Navbar/Navbar";
import { LoginData } from "../components/Login/LoginData";


export function Login(){
    return(
        <>
            <Navbar title='Login'/>
            <LoginData/>
            <div className='footer'>
                <img src="src/assets/Meau_marca_2.png" alt="" />
            </div>
        </>
    )
}