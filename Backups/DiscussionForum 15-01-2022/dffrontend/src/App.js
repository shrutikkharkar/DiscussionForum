import React from 'react';
import Router from './Router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './context/AuthContext';
import { IsAdminContextProvider } from './context/IsAdminContext';

import io from 'socket.io-client'
let socket = io(`http://localhost:3001`)

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
