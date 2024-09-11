import { Navbar } from "../components/Navbar/Navbar";
import '../styles/Ops.css'

export function Ops(){
    return(
        <>
            <Navbar title='Voltar'/>
            <div className="container">
                <div className="message">
                    <h1>Ops!</h1>
                    <h1>Página em Construção</h1>
                </div>
            </div>
            <div className='footer'>
                <img src="src/assets/Meau_marca_2.png" alt="" />
            </div>
        </>
    )
}