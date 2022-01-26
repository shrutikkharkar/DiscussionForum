import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import {Link, useHistory} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

function TagPage() {

    useEffect(() => {
        getTagDetails()
    }, []);

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);
    const tagName = queryParams.get('tagName')
    const [tagDetails, setTagDetails] = useState([])

    async function getTagDetails(){
        try{
            await axios.get(`http://localhost:3001/tag/getTagDetails/${tagName}`)
            .then(res => {
                setTagDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

  return (
      <div className="container">
          <h1>{tagName}</h1>
      </div>
  );
}

export default TagPage;
