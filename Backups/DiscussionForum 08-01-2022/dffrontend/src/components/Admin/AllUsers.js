import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import './AllUsers.css'
import './AllAnswers.css'
import 'react-toastify/dist/ReactToastify.css';

function AllUsers() {

    const [allUserDetails, setAllUserDetails] = useState([])
    const [getToggleState, setToggleState] = useState('') 

    useEffect(() => {
        getAllUserDetails()
    }, []);

    async function getAllUserDetails() {
        try {
            await axios.get('http://localhost:3001/user/getAllUserDetails')
            .then((res) => {
                setToggleState('allUsers')
                setAllUserDetails(res.data)
                // console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllBlockedUserDetails() {
      try {
          await axios.get('http://localhost:3001/user/getAllBlockedUserDetails')
          .then((res) => {
              setAllUserDetails(res.data)
              setToggleState('blockedUsers')
          })
      }
      catch (err) {
          console.error(err);
      }
  }

  async function getAllMeBlockedUserDetails() {
      try {
          await axios.get('http://localhost:3001/user/getAllMeBlockedUserDetails')
          .then((res) => {
              setAllUserDetails(res.data)
              setToggleState('meBlockedUsers')
          })
      }
      catch (err) {
          console.error(err);
      }
  }

  async function blockUserByAdmin(usrId) {

    try {
        const userId = usrId

        await axios.post(`http://localhost:3001/user/blockUserByAdmin/${userId}`)
        .then(res => {
            getAllUserDetails()
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


async function unblockAnyUserByAdmin(usrId) {

    try {
        const userId = usrId

        await axios.post(`http://localhost:3001/user/unblockAnyUserByAdmin/${userId}`)
        .then(res => {

            getAllBlockedUserDetails();
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

async function unblockAnyUserByAdmin1(usrId) {

    try {
        const userId = usrId

        await axios.post(`http://localhost:3001/user/unblockAnyUserByAdmin/${userId}`)
        .then(res => {
            getAllUserDetails();
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

async function unblockMyBlockedUserByAdmin(usrId) {

    try {
        const userId = usrId

        await axios.post(`http://localhost:3001/user/unblockMyBlockedUserByAdmin/${userId}`)
        .then(res => {
            getAllMeBlockedUserDetails();
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

     {getToggleState == "allUsers" && (
            <div className="allAnswersToggleBar">
            <button className="allUsersToggleButtons selectedToggleButton" onClick={() => getAllUserDetails()} >
                All Users
            </button>
            <button className="allUsersToggleButtons" onClick={() => getAllBlockedUserDetails()} >
                Blocked Users
            </button>
            <button className="allUsersToggleButtons" onClick={() => getAllMeBlockedUserDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "blockedUsers" && (
            <div className="allAnswersToggleBar">
            <button className="allUsersToggleButtons" onClick={() => getAllUserDetails()} >
                All Users
            </button>
            <button className="allUsersToggleButtons selectedToggleButton" onClick={() => getAllBlockedUserDetails()} >
                Blocked Users
            </button>
            <button className="allUsersToggleButtons" onClick={() => getAllMeBlockedUserDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "meBlockedUsers" && (
            <div className="allAnswersToggleBar">
            <button className="allUsersToggleButtons" onClick={() => getAllUserDetails()} >
                All Users
            </button>
            <button className="allUsersToggleButtons" onClick={() => getAllBlockedUserDetails()} >
                Blocked Users
            </button>
            <button className="allUsersToggleButtons selectedToggleButton" onClick={() => getAllMeBlockedUserDetails()} >
                Blocked by me
            </button>
        </div>
        )}

        
        <br />


    <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Sr.no</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Class</th>
            <th scope="col">Branch</th>

            {getToggleState == "allUsers" && (
                <th scope="col">Block User</th>
            )}
            {getToggleState == "blockedUsers" && (
            <>
                <th scope="col">Blocked by</th>
                <th scope="col">Unblock User</th>
            </>
            )}
            {getToggleState == "meBlockedUsers" && (
                <th scope="col">Unblock User</th>
            )}
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

                    {getToggleState == "allUsers" && user.blocked == 0 && (

                    <td><button type="button" onClick={() => blockUserByAdmin(user._id)} class="btn btn-secondary">
                        Block User
                    </button></td>
                    
                    )}
                    
                    {getToggleState == "allUsers" && user.blocked != 0 && (
                    
                    <td><button type="button" onClick={() => unblockAnyUserByAdmin1(user._id)} class="btn btn-danger">
                        Unblock User
                    </button></td>
                    
                    )}

                    {getToggleState == "blockedUsers" && (
                    <>

                    <td>{user.nameOfBlocker} ({user.blockerClass}-{user.blockerBranch})</td>    
                    <td><button type="button" onClick={() => unblockAnyUserByAdmin(user._id)} class="btn btn-danger">
                        Unblock User
                    </button></td>

                    </>
                    )}

                    {getToggleState == "meBlockedUsers" && (
                    <td><button type="button" onClick={() => unblockMyBlockedUserByAdmin(user._id)} class="btn btn-danger">
                        Unblock User
                    </button></td>
                    )}

                  </tr>
                </tbody>
            
        ))
    }    
    </table>  
    <ToastContainer />  
    </div>
    )

}

export default AllUsers
