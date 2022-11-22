import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGhost, faHippo, faPlane, faPoo, faUserAstronaut, faHandsHolding } from '@fortawesome/free-solid-svg-icons'

function TableLayout(props){
    //referenced https://css-tricks.com/text-blocks-over-image/ for displaying text over the card image
    const avatar = <img alt='avatar icon' src='../../avatar.svg' className='rounded-lg w-20 mb-4' />
    const avatarAnimated = <img alt='avatar icon' src='../../avatar.svg' className='motion-safe:animate-bounce rounded-lg w-20 mb-4 ' />
    const deckImg = <FontAwesomeIcon icon={faHandsHolding} size="3x" className='mt-3' />

    let playerCount = 0;
    const icons = [faUserAstronaut, faPoo ,faHippo, faPlane, faGhost]
    const icon_color = ['#d6d3d1', '#a16207', "#d8b4fe", "#c7d2fe", "#fafaf9",]
    



    let player_layout = 'flex flex-shrink max-w-screen px-8 items-center justify-center'
    let playerIcon = []
    props.opponents.forEach(person => {
        playerIcon.push(
            <div 
                key={person.name} 
                className={player_layout}
            >
                <div className='text-center font-bold text-lime-200 mt-5'>
                    <p className="">
                        {props.turn === person.name ?  person['name']: person['name']}    
                    </p>
                    {props.turn === person.name ? <FontAwesomeIcon size="3x" icon={icons[playerCount]} style={{animationDuration: '5s'}} color={icon_color[playerCount++]} bounce /> : <FontAwesomeIcon size="3x" icon={icons[playerCount]} color={icon_color[playerCount++]} />}
                    <div 
                        className=' relative flex justify-center' >
                        {deckImg}

                        <div className='text-5xl absolute'>
                            {person['count']}
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="inline-flex">
            {playerIcon}
        </div>
    )
}

export default TableLayout;