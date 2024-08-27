import '../../styles/Footer.css';
import './Logoptions.css'

export function Logoptions(){
    return(
        <div>
            <div className='logsContainer'>
                <h1>Ops!</h1>
                <p>Você não pode realizar esta ação sem <br/> possuir um cadastro.</p>
            </div>
            
            <div className='buttonLog'>
                <a className='logButtons' href='/sign'>FAZER CADASTRO</a>
            </div>

            <div className='signin'>
                <p>Já possui cadastro?</p>
            </div>

            <div className='buttonLog'>
                <a className='logButtons' href='/login'>FAZER LOGIN</a>
            </div>
            <div className='footer'>
                <img src="src/assets/Meau_marca_2.png" alt="" />
            </div>
        </div>
    )
}