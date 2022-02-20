import React, {useState, useEffect, createContext} from 'react';
import io from "socket.io-client";

const SocketContext = createContext();

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST

// var socket = io.connect(`${BEHOST}:${BEPORT}`, { transports: ['websocket'] });
const socket = io.connect(`${BEHOST}:${BEPORT}`, {
    transports: ['websocket'], 
    upgrade: false
});

function SocketContextProvider(props) {
        return (
            <SocketContext.Provider value={{socket}}>
                {props.children}
            </SocketContext.Provider>
        );
}
    
export default SocketContext
export {SocketContextProvider}
    


