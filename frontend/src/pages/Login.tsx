import '../styles/Footer.css';
import { Navbar } from "../components/Navbar/Navbar";
import { LoginData } from "../components/Login/LoginData";
import { Sidebar } from '../routes/Sidebar/Sidebar';


export function Login(){
    return(
        <>
            <Navbar title='Login'/>
            <Sidebar/>
            <LoginData/>
            <div className='footer'>
                <img src="src/assets/Meau_marca_2.png" alt="" />
            </div>
        </>
    )
}