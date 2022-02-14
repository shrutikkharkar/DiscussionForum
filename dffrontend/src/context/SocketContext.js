import React, {useState, useEffect, createContext} from 'react';
import io from "socket.io-client";

const SocketContext = createContext();

function SocketContextProvider(props) {

    const BEPORT = process.env.REACT_APP_BEPORT
    const BEHOST = process.env.REACT_APP_BEHOST
    
    var socket = io.connect(`${BEHOST}:${BEPORT}`);
    
        return (
    
            <SocketContext.Provider value={{socket}}>
                {props.children}
            </SocketContext.Provider>
        );
}
    
export default SocketContext
export {SocketContextProvider}
    


