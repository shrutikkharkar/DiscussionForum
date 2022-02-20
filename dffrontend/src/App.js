import React from 'react';
import Router from './Router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './context/AuthContext';
import { IsAdminContextProvider } from './context/IsAdminContext';
import { SocketContextProvider } from './context/SocketContext';

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

axios.defaults.withCredentials = true;


function App() {


  return (
    <AuthContextProvider>
      <IsAdminContextProvider>
        <SocketContextProvider>
          <Router />
        </SocketContextProvider>
      </IsAdminContextProvider>
    </AuthContextProvider>
  ); 

}



export default App;
