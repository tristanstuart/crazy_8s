import {useEffect, useState} from 'react'

function AlertBox(props){

    return(
        <div role="alert">
            <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2 text-center" >
                {props.room} is not available
            </div>
            <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 text-center">
                <p>Please choose another room name</p>
            </div>
        </div>
    )

}

export default AlertBox;