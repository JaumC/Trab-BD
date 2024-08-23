import { useState } from 'react';
import './Sidebar.css';
import { Sidecontent } from '../SideContent/Sidecontent';

export function Sidebar() {
    const [isSide, setIsSide] = useState(false);

    const openSideContent = () => {
        setIsSide(true);
    };

    const closeSideContent = () => {
        setIsSide(false);
    };

    return (
        <>
            <div className='sidebar' onClick={openSideContent}>
                <img src="src/assets/bars-solid.svg" alt="Menu" />
            </div>
            {isSide && (
                <>
                    <div className='overlay' onClick={closeSideContent}></div>
                    <Sidecontent />
                </>
            )}
            
        </>
        
    );
}