
function TableLayout(props){
    //referenced https://css-tricks.com/text-blocks-over-image/ for displaying text over the card image
    const avatar = <img alt='avatar icon' src='../../avatar.svg' className='rounded-lg w-20 mb-4' />
    const avatarAnimated = <img alt='avatar icon' src='../../avatar.svg' className='motion-safe:animate-bounce rounded-lg w-20 mb-4 ' />
    const deckImg = <img alt="1B" src="../../cards/1B.svg" className="w-15 h-20"/>

    
    let player_layout = 'flex pl-20 pr-20 items-center justify-center'
    let playerIcon = []
    props.opponents.forEach(person => {
        playerIcon.push(
            <div 
                key={person.name} 
                className={player_layout}
            >
                <div className='text-center'>
                    {props.turn === person.name ? avatarAnimated : avatar}
                    <h5 className="font-bold">
                        {props.turn === person.name ?  person['name']: person['name']}
                        
                    </h5>
                    <div 
                        className=' relative flex justify-center' >
                        {deckImg}

                        <div className='text-8xl absolute'>
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