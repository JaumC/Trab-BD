import './CardAnimal.css'

type CardAnimalProps = {
    key?: number;
    nomeAnimal?: string;
    animalFoto?: string;
    color?: string
}

export function CardAnimal({key, nomeAnimal, animalFoto, color='#cfe9e5'}: CardAnimalProps){
    return(
        <div key={key} className='cardStyle' style={{ backgroundColor: color}}>
            <div className='headerStyle'><p>{nomeAnimal}</p></div>
            <div className='imageContainerStyle'>
                {animalFoto && (
                    <img 
                        src={animalFoto} 
                        alt={nomeAnimal} 
                        className='imageStyle'
                    />
                )}
            </div>
            <div className='borderBottomStyle' style={{ backgroundColor: color}}></div>
        </div>
    )
}