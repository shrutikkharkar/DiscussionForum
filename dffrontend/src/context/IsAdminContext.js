import React, {useState, useEffect, createContext} from 'react';
import axios from 'axios';

const IsAdminContext = createContext();

function IsAdminContextProvider(props) {

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

    const [isAdmin, setIsAdmin] = useState(undefined);

    async function getIsAdmin() {
        const isAdminRes = await axios.get(`${BEHOST}:${BEPORT}/user/isAdmin`);
        setIsAdmin(isAdminRes.data);
    }

    useEffect(() => {
        getIsAdmin()
    }, []);

    return (

        <IsAdminContext.Provider value={{isAdmin, getIsAdmin}}>
            {props.children}
        </IsAdminContext.Provider>
    );
}

export default IsAdminContext
export {IsAdminContextProvider}

