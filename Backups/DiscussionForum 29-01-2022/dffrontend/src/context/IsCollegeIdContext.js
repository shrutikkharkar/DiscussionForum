import React, {useState, useEffect, createContext} from 'react';
import axios from 'axios';

const IsCollegeIdContext = createContext();

function IsCollegeIdContextProvider(props) {

    const [isCollegeId, setIsCollegeId] = useState(undefined);

    async function getIsCollegeId() {
        const isCollegeIdRes = await axios.get("http://localhost:3001/user/isCollegeId");
        setIsCollegeId(isCollegeIdRes.data);
    }

    useEffect(() => {
        getIsCollegeId()
    }, []);

    return (

        <IsCollegeIdContext.Provider value={{isCollegeId, getIsCollegeId}}>
            {props.children}
        </IsCollegeIdContext.Provider>
    );
}

export default IsCollegeIdContext
export {IsCollegeIdContextProvider}

