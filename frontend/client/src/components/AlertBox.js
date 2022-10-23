
function AlertBox(props){

    return(
        <div role="alert">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 text-center" >
                {props.title}
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 text-center">
                <p>{props.message}</p>
            </div>
        </div>
    )

}

export default AlertBox;