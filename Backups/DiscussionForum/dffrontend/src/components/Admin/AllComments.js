import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {useHistory} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import './AllAnswers.css'
import GridTable from '@nadavshaar/react-grid-table'

function AllComments() {

    const BEPORT = process.env.REACT_APP_BEPORT
    const BEHOST = process.env.REACT_APP_BEHOST
    const FEPORT = process.env.REACT_APP_FEPORT
    const FEHOST = process.env.REACT_APP_FEHOST

    useEffect(() => {
        getAllCommentDetails()
    }, []);

    const history = useHistory();
    const [rows, setAllCommentDetails] = useState()
    const [getToggleState, setToggleState] = useState('')

    const [gotDataFromDatabase, setGotDataFromDatabase] = useState(true);

    async function getAllCommentDetails() {
        try {
            await axios.get(`${BEHOST}:${BEPORT}/comment/getAllCommentDetails`)
            .then((res) => {
                setGotDataFromDatabase(false)
                setToggleState('allComments')
                setAllCommentDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }



    async function removeCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`${BEHOST}:${BEPORT}/comment/removeCommentByAdmin/${commentId}`)
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

            await axios.post(`${BEHOST}:${BEPORT}/comment/unblockAnyCommentByAdmin/${commentId}`)
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

        <br />

        <GridTable 
            columns={columns}
            rows={rows}
            pageSize={10}
            isLoading={gotDataFromDatabase}
        />

        <ToastContainer />
        </div>
    )
}

export default AllComments
