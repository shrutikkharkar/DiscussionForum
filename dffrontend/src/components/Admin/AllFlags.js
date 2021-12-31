import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllFlags() {

    useEffect(() => {
        getAllFlagDetails()
    }, []);

    const [allFlagDetails, setAllFlagDetails] = useState([])

    async function getAllFlagDetails() {
        try {
            await axios.get('http://localhost:3001/flag/getAllFlagDetails')
            .then((res) => {
                setAllFlagDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div>
            
        </div>
    )
}

export default AllFlags
