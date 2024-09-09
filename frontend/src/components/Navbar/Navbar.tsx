import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import leftArrow from '../../assets/left-arrow.svg';

interface NavbarProps{
    title: string;
    color?: string;
    navigateTo?: string;
}

export function Navbar({title, color="#88c9bf", navigateTo }: NavbarProps){

    const navigate = useNavigate();

    const handleNavigation = () => {
        if (navigateTo) {
            navigate(navigateTo);
        } else {
            window.history.back();
        }
    }

    return(
        <div className='navbar' style={{ backgroundColor: color}}>
            <img onClick={handleNavigation} src={leftArrow} alt="Left Arrow" />
            <p>{title}</p>
        </div>
    )
}