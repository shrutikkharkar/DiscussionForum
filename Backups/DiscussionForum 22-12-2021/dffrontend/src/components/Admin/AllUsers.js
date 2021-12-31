import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import './AllUsers.css'
import 'react-toastify/dist/ReactToastify.css';

function AllUsers() {

    const [allUserDetails, setAllUserDetails] = useState([])
    let srno = 0;

    useEffect(() => {
        getAllUserDetails()
    }, []);

    async function getAllUserDetails() {
        try {
            await axios.get('http://localhost:3001/user/getAllUserDetails')
            .then((res) => {
                setAllUserDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
    <div className="container">
    <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Sr.no</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Class</th>
            <th scope="col">Branch</th>
          </tr>
        </thead>

    {
        allUserDetails.map( (user, index) => 
        (
            
            
                <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.Class}</td>
                    <td>{user.branch}</td>
                  </tr>
                </tbody>
            
        ))
    }    
    </table>    
    </div>
    )

}

export default AllUsers
