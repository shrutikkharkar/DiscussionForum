import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import './AllUsers.css'
import './AllAnswers.css'
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from "react-bootstrap/Dropdown";
import { HiDotsVertical } from "react-icons/hi";

import GridTable from '@nadavshaar/react-grid-table'
import '@nadavshaar/react-grid-table/dist/index.css'

function AllUsers() {

    // const [allUserDetails, setAllUserDetails] = useState([])

    const [rows, setAllUserDetails] = useState()
    
    const [useBgColor1, setBgColor1] = useState('')
    const [useFontColor1, setFontColor1] = useState('black')

    const [useBgColor2, setBgColor2] = useState('')
    const [useFontColor2, setFontColor2] = useState('black')

    const [useBgColor3, setBgColor3] = useState('')
    const [useFontColor3, setFontColor3] = useState('black')

    const [getToggleState, setToggleState] = useState('allUsers')

    // const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    //     <span
    //       ref={ref}
    //       onClick={e => {
    //         e.preventDefault();
    //         onClick(e);
    //       }}
    //     >
    //       {children}
    //       <HiDotsVertical className="menuIcon" />
    //       {/* <div className="activeUserCell">Active</div> */}
          
    //     </span>
    // ));

    useEffect(() => {
        getAllUserDetails()

    }, []);

    async function getAllUserDetails() {
        selected(1)
        setToggleState('allUsers')
        try {
            await axios.get('http://localhost:3001/user/getAllUserDetails')
            .then((res) => {
                // setToggleState('allUsers')
                setAllUserDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllBlockedUserDetails() {
    setToggleState('blockedUsers')
    selected(2)
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

  async function getAllMeBlockedUserDetails() {
    selected(3)
    setToggleState('meBlockedUsers')
      try {
          await axios.get('http://localhost:3001/user/getAllMeBlockedUserDetails')
          .then((res) => {
              setAllUserDetails(res.data)
            //   setToggleState('meBlockedUsers')
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
        // http://localhost:3001/user/blockUserByAdmin/61716d2bd703232c709b3fde
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

function selected(num){

    if (num == 1){
        setBgColor1('rgb(252, 90, 90)');
        setFontColor1('white');

        setBgColor2('');
        setFontColor2('black');

        setBgColor3('');
        setFontColor3('black');
    }
    
    else if(num == 2){
        setBgColor2('rgb(252, 90, 90)');
        setFontColor2('white');

        setBgColor1('');
        setFontColor1('black');

        setBgColor3('');
        setFontColor3('black');
    }

    else {
        setBgColor3('rgb(252, 90, 90)');
        setFontColor3('white');

        setBgColor1('');
        setFontColor1('black');

        setBgColor2('');
        setFontColor2('black');
    }
}

// const StatusToggleActive = React.forwardRef(({ children, onClick }, ref) => (
//     <span
//       ref={ref}
//       onClick={e => {
//         e.preventDefault();
//         onClick(e);
//       }}
//     >
//         <div className="activeUserCell">Active</div>
//       {children}
      
//     </span>
// ));
// const StatusToggleBlocked = React.forwardRef(({ children, onClick }, ref) => (
//     <span
//       ref={ref}
//       onClick={e => {
//         e.preventDefault();
//         onClick(e);
//       }}
//     >
//         <div className="activeUserCell">Blocked</div>
//       {children}
      
//     </span>
// ));


// let rows = allUserDetails;
// const [rows, setRows] = useState(allUserDetails);

// const [rowsData, setRows] = useState(allUserDetails);
// custom cell component
const StatusToggler = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    
    return (
        <>
        <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        
        {/* {value == 0 && (
        <Dropdown style={{display: 'inline'}}>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu className="dropdown-styling" size="sm" title="">

            <Dropdown.Item onClick={() => unblockAnyUserByAdmin(data._id)}>
                <div onClick={() => unblockAnyUserByAdmin(data._id)} className="activeUserCell">Active</div>
            </Dropdown.Item>

            <Dropdown.Item onClick={() => blockUserByAdmin(data._id)}>
            <div onClick={() => blockUserByAdmin(data._id)} className="blockedUserCell">Block</div>
            </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>
        )} */}
        {/* {value != 0 && (
        <Dropdown style={{display: 'inline'}}>
            <Dropdown.Toggle as={} />
            <Dropdown.Menu className="dropdown-styling" size="sm" title="">

            <Dropdown.Item onClick={() => unblockAnyUserByAdmin(data._id)}>
                <div onClick={() => unblockAnyUserByAdmin(data._id)} className="activeUserCell">Active</div>
            </Dropdown.Item>
            
            <Dropdown.Item onClick={() => blockUserByAdmin(data._id)}>
            <div onClick={() => blockUserByAdmin(data._id)} className="blockedUserCell">Block</div>
            </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>
        )} */}
            

            

            {value==0 && (
                <div onClick={() => blockUserByAdmin(data._id)} className="activeUserCell">Active</div>
            )}
            {value==1 && (
                <div onClick={() => unblockAnyUserByAdmin1(data._id)} className="blockedUserCell">Blocked</div>
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
    // {
    //     id: 1,
    //     field: 'checkbox',
    //     pinned: true,
    // }, 
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
    // {
    //     id: 6, 
    //     field: 'blocked', 
    //     label: 'Status',
    //     cellRenderer: ({value, row, column, rowIndex, searchText}) => (
    //         <>
    //             {value==0 && (
    //                 <div className="activeUserCell">Active</div>
    //             )}
    //             {value==1 && (
    //                 <div className="blockedUserCell">Blocked</div>
    //             )}
    //         </>
    //     )
        
    // },
    // {
    //     id: 6, 
    //     label: 'Status',
    //     field:'_id',
    //     getValue: ({value, column}) => value._id,
        
    //     cellRenderer: ({value, row, column, rowIndex, searchText}) => (
    //         <>
            
    //         <p>{column._id}</p>
    //         {/* {getToggleState == "allUsers" && value == 0 && (

    //         <td><button type="button" onClick={() => blockUserByAdmin()} class="btn btn-secondary">
    //             Block User
    //         </button></td>

    //         )}

    //         {getToggleState == "allUsers" && value != 0 && (
            
    //         <td><button type="button" onClick={() => unblockAnyUserByAdmin()} class="btn btn-danger">
    //             Unblock User
    //         </button></td>

    //         )} */}
    //         </>
    //     )
        
    // }
    // {
    //     id: 'my-buttons-column',
    //     width: 'max-content',
    //     pinned: true,
    //     sortable: false,
    //     resizable: false,
    //     cellRenderer: ({ tableManager, value, data, column, colIndex, rowIndex }) => (
    //         <button 
    //             style={{marginLeft: 20}} 
    //             onClick={e => tableManager.rowEditApi.setEditRowId(data.id)}
    //         >&#x270E;</button>
    //     ),
    //     editorCellRenderer: ({ tableManager, value, data, column, colIndex, rowIndex, onChange }) => (
    //         <div style={{display: 'inline-flex'}}>
    //             <button 
    //                 style={{marginLeft: 20}} 
    //                 onClick={e => tableManager.rowEditApi.setEditRowId(null)}
    //             >&#x2716;</button>
    //             <button 
    //                 style={{marginLeft: 10, marginRight: 20}} 
    //                 onClick={e => {
    //                     let rowsClone = [...rowsData];
    //                     let updatedRowIndex = rowsClone.findIndex(r => r.id === data.id);
    //                     rowsClone[updatedRowIndex] = data;

    //                     //setRowsData(rowsClone);
    //                     setRows(rowsClone);
    //                     tableManager.rowEditApi.setEditRowId(null);
    //                 }
    //             }>&#x2714;</button>
    //         </div>
    //     )
    // }
];

// update handler
// const updateRowData = (row) => {
//     let rowsClone = [...rows];
//     let rowIndex = rowsClone.findIndex(it => it.id === item.id);
//     rowsClone[rowIndex] = row;
//     setRows(rowsClone);
// }


    return (
    <div className="container">

     {/* {getToggleState == "allUsers" && (
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
        )} */}

        {/* <div className="buttonsContainer">

        <button className="toggleButtons" 
            style={{backgroundColor: useBgColor1, color: useFontColor1}} 
            onClick={() => getAllUserDetails()}
        >
            All Users
        </button>

        <button className="toggleButtons" 
            style={{backgroundColor: useBgColor2, color: useFontColor2}} 
            onClick={() => getAllBlockedUserDetails()}
        >
            Blocked Users
        </button>

        <button className="toggleButtons" 
            style={{backgroundColor: useBgColor3, color: useFontColor3}} 
            onClick={() => getAllMeBlockedUserDetails()}
        >
            Blocked by me
        </button>

        </div> */}


        {/* <br /> */}

        <GridTable 
            columns={columns}
            rows={rows}
        />


    {/* <table class="table table-hover">
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
    </table>   */}
    <ToastContainer />  
    </div>
    )

}

export default AllUsers
