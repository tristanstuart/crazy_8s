import React from 'react'
import Navigation from './Navigation';

function Header(){
    return (
        <header 
            className='bg-gradient-to-b from-slate-500 to-slate-300  p-3 flex justify-between items-center'>
            <span className='font-bold text-2xl'>
                Crazy 8's
            </span>

            <Navigation />
        </header>
    )
}

export default Header;