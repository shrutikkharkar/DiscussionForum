import React, {useState, useEffect, createContext} from 'react';
import axios from 'axios';

const AuthContext = createContext();

function AuthContextProvider(props) {

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST

    const [loggedIn, setLoggedIn] = useState(undefined);

    async function getLoggedIn() {
        const loggedInRes = await axios.get(`${BEHOST}:${BEPORT}/user/loggedIn`);
        console.log(loggedInRes);
        setLoggedIn(loggedInRes.data);
    }

    useEffect(() => {
        getLoggedIn()
    }, []);

    return (

        <AuthContext.Provider value={{loggedIn, getLoggedIn}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext
export {AuthContextProvider}

