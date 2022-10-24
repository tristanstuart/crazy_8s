import React from "react";
import io from 'socket.io-client';

class Dashboard extends React.Component {
    state = {
        socketData: "",
        socketStatus:"On"
    }
    componentWillUnmount() {
        this.socket.close()
        console.log("component unmounted")
    }
    componentDidMount() {
        var sensorEndpoint = "http://127.0.0.1:5000/"
            this.socket = io.connect(sensorEndpoint, {
            // reconnection: true,
            // transports: ['websocket']
        });
        console.log("component mounted")
            this.socket.on("responseMessage", message => {
                this.setState({'socketData': message.connection})
                
                console.log("responseMessage", message)
            })
            
    }
    handleEmit=()=>{
        if(this.state.socketStatus==="On"){
        this.socket.emit("disconnected", {'data': 'Stop Sending', 'status':'Off'})
        this.setState({'socketStatus':"Off"})
    }
    else{        
        this.socket.emit("connection", {'data':'Start Sending', 'status':'On'})
        this.setState({'socketStatus':"On"})
        }
        console.log("Emit Clicked")
    }
    render() {
        return (
            <React.Fragment >
            <div className="grid items-center justify-center">
                <div>Data: {this.state.socketData}</div>
                <div>Status: {this.state.socketStatus}</div>
                <div onClick={this.handleEmit}> Start/Stop</div>
            </div>
            </React.Fragment>
        )
    }
}
export default Dashboard;