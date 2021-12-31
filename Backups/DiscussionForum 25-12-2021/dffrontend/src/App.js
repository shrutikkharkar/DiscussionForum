import React from 'react';
import Router from './Router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './context/AuthContext';
import { IsAdminContextProvider } from './context/IsAdminContext';

axios.defaults.withCredentials = true;


function App() {
  return (
    <AuthContextProvider>
      <IsAdminContextProvider>
        <Router />
      </IsAdminContextProvider>
    </AuthContextProvider>
  );
}

export default App;
