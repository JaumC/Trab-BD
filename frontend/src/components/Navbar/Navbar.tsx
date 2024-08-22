import './Navbar.css'

interface NavbarProps{
    title: string;
}

export function Navbar({title}: NavbarProps){
    const goBack = () => {
        window.history.back();
    };

    return(
        <div className='navbar'>
            <img onClick={goBack} src="src/assets/left-arrow.svg" alt="" />
            <p>{title}</p>
        </div>
    )
}