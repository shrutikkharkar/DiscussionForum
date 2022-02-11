import React from 'react';
import Router from './Router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './context/AuthContext';
import { IsAdminContextProvider } from './context/IsAdminContext';
import io from 'socket.io-client'

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

let socket = io(`${BEHOST}:${BEPORT}`)

axios.defaults.withCredentials = true;


function App() {

  socket.on('connection')

  return (
    <AuthContextProvider>
      <IsAdminContextProvider>
          <Router />
      </IsAdminContextProvider>
    </AuthContextProvider>
  ); 

}



export default App;
