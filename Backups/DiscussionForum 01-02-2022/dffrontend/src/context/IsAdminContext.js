import React, {useState, useEffect, createContext} from 'react';
import axios from 'axios';

const IsAdminContext = createContext();

function IsAdminContextProvider(props) {

    const [isAdmin, setIsAdmin] = useState(undefined);

    async function getIsAdmin() {
        const isAdminRes = await axios.get("http://localhost:3001/user/isAdmin");
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

