import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import './AllUsers.css'
import './AllAnswers.css'
import 'react-toastify/dist/ReactToastify.css';

import GridTable from '@nadavshaar/react-grid-table'
import '@nadavshaar/react-grid-table/dist/index.css'

function AllUsers() {

    const [rows, setAllUserDetails] = useState()
    

    useEffect(() => {
        getAllUserDetails()

    }, []);

    async function getAllUserDetails() {

        try {
            await axios.get('http://localhost:3001/user/getAllUserDetails')
            .then((res) => {
                setAllUserDetails(res.data)
                console.log(res.data)
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
            //   setToggleState('blockedUsers')
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


async function removeUserFromAdmin(userId) {
    try {
      await axios.post(`http://localhost:3001/user/removeUserFromAdmin/${userId}`)
      .then( (res) => {
        
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

async function makeUserAdmin(userId) {
    try {
      await axios.post(`http://localhost:3001/user/makeUserAdmin/${userId}`)
      .then( (res) => {
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

const StatusToggler = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    
    return (
        <>
        <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        
            {value==0 && (
                <div onClick={() => blockUserByAdmin(data._id)} className="activeUserCell">Active</div>
            )}
            {value==1 && (
                <div onClick={() => unblockAnyUserByAdmin(data._id)} className="blockedUserCell">Blocked</div>
            )}
        </div>
        </>
    )
}

// custom cell component
const RoleToggler = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    return (
        <>
        <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
    
            {value == 'true' && (
                <div onClick={() => removeUserFromAdmin(data._id)} className="adminCell">Admin</div>
            )}
            {value != 'true' && (
                <div onClick={() => makeUserAdmin(data._id)} className="userCell">User</div>
            )}
        </div>
        </>
    )
}

const BlockedBy = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    return (
        <>
        {data.blocked == 1 && (
            <div>{value} ({data.blockerClass}-{data.blockerBranch})</div>
        )}
        {data.blocked == 0 && (
            <div>{value}</div>
        )}
        
        </>
    )
}

const columns = [
    {
        id: 2, 
        field: 'fullName', 
        label: 'Name',
    },
    {
        id: 3, 
        field: 'email', 
        label: 'Email',
        
    },
    {
        id: 4, 
        field: 'Class', 
        label: 'Class',
        width: "150px"
        
    },
    {
        id: 5, 
        field: 'branch', 
        label: 'Branch',
        width: "100px"
        
    },
    {
        id: 6, 
        field: 'blocked', 
        label: 'Status',

        cellRenderer: StatusToggler
        
    },
    {
        id: 7, 
        field: 'nameOfBlocker', 
        label: 'Blocked by',
        searchable: true,
        cellRenderer: BlockedBy
        
    },
    {
        id: 8, 
        field: 'isAdmin', 
        label: 'Role',
        searchable: true,
        cellRenderer: RoleToggler
        
    }
];



    return (
    <div className="container">

        <GridTable 
            columns={columns}
            rows={rows}
            isLoading={true}
        />

    <ToastContainer />  
    </div>
    )

}

export default AllUsers
