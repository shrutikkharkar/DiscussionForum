import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Signup from './Signup'

function UpdateProfile() {

    useEffect(() => {
        getUserDetails()
    }, []);

    const [userDetails, setUserDetails] = useState([])

    async function getUserDetails() {
        try {
            await axios.get('http://localhost:3001/user/getUserDetailsForUpdate')
            .then(res => {
                console.log(res.data)
                setUserDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <>
           <Signup userDetails={userDetails} /> 
        </>
    )
}

export default UpdateProfile
