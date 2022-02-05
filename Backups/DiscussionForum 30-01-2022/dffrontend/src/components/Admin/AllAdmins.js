import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import SearchUsers from '../SearchUsers'
import './AllUsers.css'
import 'react-toastify/dist/ReactToastify.css';

function AllAdmins() {

    const [allAdminDetails, setAllAdminDetails] = useState([])
    const [allUserDetails, setAllUserDetails] = useState()

    useEffect(() => {
        getAllAdminDetails()
        getUsers()
    }, []);

    function getUsers(){
      try {
        axios.get('http://localhost:3001/user/getAllUserDetails')
        .then((res) => {
          setAllUserDetails(res.data);
        })
    
      }
      catch (e) {
        console.error(e)
      }
    }

    async function getAllAdminDetails() {
        try {
            await axios.get('http://localhost:3001/user/getAllAdminDetails')
            .then((res) => {
                setAllAdminDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function removeUserFromAdmin(userId) {
        try {
          await axios.post(`http://localhost:3001/user/removeUserFromAdmin/${userId}`)
          .then( (res) => {
            
            getAllAdminDetails();
            toast.dark(`${res.data}`, {
              position: "bottom-left",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
        }
        catch (err) {
          console.error(err);
        }
    }

    return (
    <div className="container">
    <SearchUsers placeholder="Search user" data={allUserDetails} />
    <br /><br />
    <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Sr.no</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Class</th>
            <th scope="col">Branch</th>
            <th scope="col">Operate</th>
          </tr>
        </thead>

    {
        allAdminDetails.map( (user, index) => 
        (
            
            
                <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.Class}</td>
                    <td>{user.branch}</td>
                    <td><button type="button" onClick={() => removeUserFromAdmin(user._id)} class="btn btn-secondary">Remove</button></td>
                  </tr>
                </tbody>
            
        ))
    }    
    </table>   
    <ToastContainer />  
    </div>
    )

}

export default AllAdmins