import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {useHistory} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import './AllAnswers.css'
import GridTable from '@nadavshaar/react-grid-table'

function AllComments() {

    useEffect(() => {
        getAllCommentDetails()
    }, []);

    const history = useHistory();
    // const [allCommentDetails, setAllCommentDetails] = useState([])
    const [rows, setAllCommentDetails] = useState()
    const [getToggleState, setToggleState] = useState('')

    async function getAllCommentDetails() {
        try {
            await axios.get('http://localhost:3001/comment/getAllCommentDetails')
            .then((res) => {
                setToggleState('allComments')
                setAllCommentDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllBlockedCommentDetails() {
        try {
            await axios.get('http://localhost:3001/comment/getAllBlockedCommentDetails')
            .then((res) => {
                setToggleState('blockedComments')
                setAllCommentDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllMeBlockedCommentDetails() {
        try {
            await axios.get('http://localhost:3001/comment/getAllMeBlockedCommentDetails')
            .then((res) => {
                setToggleState('meBlockedComments')
                setAllCommentDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function removeCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/removeCommentByAdmin/${commentId}`)
            .then(res => {
                getAllCommentDetails()
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

    async function unblockAnyCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/unblockAnyCommentByAdmin/${commentId}`)
            .then(res => {

                getAllCommentDetails()
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

    async function unblockAnyCommentByAdmin1(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/unblockAnyCommentByAdmin/${commentId}`)
            .then(res => {

                getAllCommentDetails()
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

    async function unblockMyBlockedCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/unblockMyBlockedCommentByAdmin/${commentId}`)
            .then(res => {
                getAllMeBlockedCommentDetails();
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
                    <div onClick={() => removeCommentByAdmin(data._id)} className="liveAnswerCell">Live</div>
                )}
                {value==1 && (
                    <div onClick={() => unblockAnyCommentByAdmin(data._id)} className="blockedAnswerCell">Blocked</div>
                )}
            </div>
            </>
        )
    }

    const removedBy = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
            <>
            {data.removed == 1 && (
                <div>{value} ({data.removerClass}-{data.removerBranch})</div>
            )}
            {data.removed == 0 && (
                <div>{value}</div>
            )}
            
            </>
        )
    }

    const fullNameWithClass = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
            <div>{value} ({data.Class} - {data.branch})</div>
        )
    }

    const columns = [
        {
            id: 1, 
            field: 'comment', 
            label: 'Comments',
        },
        {
            id: 2, 
            field: 'fullName', 
            label: 'Comment by',
            cellRenderer:fullNameWithClass
            
        },
        {
            id: 3, 
            field: 'email', 
            label: 'Email',
            
        },
        {
            id: 4, 
            field: 'nameOfRemover', 
            label: 'Removed by',
            searchable: true,
            cellRenderer: removedBy
            
        },
        {
            id: 5, 
            field: 'removed', 
            label: 'Status',
            cellRenderer: StatusToggler   
        }
    ];


    return (
        <div className="container">

        {/* {getToggleState == "allComments" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllCommentDetails()} >
                All Comments
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedCommentDetails()} >
                Blocked Comments
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedCommentDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "blockedComments" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllCommentDetails()} >
                All Comments
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllBlockedCommentDetails()} >
                Blocked Comments
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedCommentDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "meBlockedComments" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllCommentDetails()} >
                All Comments
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedCommentDetails()} >
                Blocked Comments
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllMeBlockedCommentDetails()} >
                Blocked by me
            </button>
        </div>
        )} */}

        <br />

        <GridTable 
            columns={columns}
            rows={rows}
            pageSize={10}
            isLoading={true}
        />


        {/* <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Comment</th>
                <th scope="col">Email</th>
                {getToggleState == "allComments" && (
                    <th scope="col">Block status</th>
                )}
                {getToggleState == "blockedComments" && (
                <>
                    <th scope="col">Blocked by</th>
                    <th scope="col">Unblock Comment</th>
                </>
                )}
                {getToggleState == "meBlockedComments" && (
                    <th scope="col">Unblock Comment</th>
                )}
                
              </tr>
            </thead>
        {
        allCommentDetails.map( (comment, index) => 
        (
            <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{comment.comment}</td>
                    <td>{comment.email}</td>


                    {getToggleState == "allComments" && comment.removed == 0 && (
                    <td><button type="button" onClick={() => removeCommentByAdmin(comment._id)} class="btn btn-secondary">
                        Block Comment
                    </button></td>
                    )}

                    {getToggleState == "allComments" && comment.removed != 0 && (
                    <td><button type="button" onClick={() => unblockAnyCommentByAdmin(comment._id)} class="btn btn-danger">
                        Unblock Comment
                    </button></td>
                    )}


                    {getToggleState == "blockedComments" && (
                    <>

                        <td>{comment.nameOfRemover} ({comment.Class}-{comment.branch})</td>    
                        <td><button type="button" onClick={() => unblockAnyCommentByAdmin(comment._id)} class="btn btn-danger">
                            Unblock Comment
                        </button></td>

                    </>
                    )}

                    {getToggleState == "meBlockedComments" && (
                    <td>
                        <button type="button" onClick={() => unblockMyBlockedCommentByAdmin(comment._id)} class="btn btn-danger">
                            Unblock Comment
                        </button></td>
                    )}


                  </tr>
            </tbody>
        ))
        }
            
        </table> */}
        <ToastContainer />
        </div>
    )
}

export default AllComments
