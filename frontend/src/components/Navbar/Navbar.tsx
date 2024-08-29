import './Navbar.css'

interface NavbarProps{
    title: string;
    color?: string;
}

export function Navbar({title, color="#88c9bf"}: NavbarProps){
    const goBack = () => {
        window.history.back();
    };

    return(
        <div className='navbar' style={{ backgroundColor: color}}>
            <img onClick={goBack} src="src/assets/left-arrow.svg" alt="" />
            <p>{title}</p>
        </div>
    )
}