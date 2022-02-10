import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {useHistory} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import './AllAnswers.css'
import GridTable from '@nadavshaar/react-grid-table'
import '@nadavshaar/react-grid-table/dist/index.css'

function AllAnswers() {

    const BEPORT = process.env.REACT_APP_BEPORT
    const BEHOST = process.env.REACT_APP_BEHOST
    const FEPORT = process.env.REACT_APP_FEPORT
    const FEHOST = process.env.REACT_APP_FEHOST

    useEffect(() => {
        getAllAnswerDetails()
    }, []);

    const history = useHistory();
    // const [allAnswerDetails, setAllAnswerDetails] = useState([])
    const [rows, setAllAnswerDetails] = useState()
    const [getToggleState, setToggleState] = useState('') 
    const [gotDataFromDatabase, setGotDataFromDatabase] = useState(true);

    async function getAllAnswerDetails() {
        try {
            await axios.get(`${BEHOST}:${BEPORT}/answer/getAllAnswerDetails`)
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('allAnswers')
                setGotDataFromDatabase(false)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

   

    async function removeAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/removeAnswerByAdmin/${answerId}`)
            .then(res => {
                getAllAnswerDetails()
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


    async function unblockAnyAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/unblockAnyAnswerByAdmin/${answerId}`)
            .then(res => {

                getAllAnswerDetails();
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

    
    function goToAnswerPage(questionId){
        history.push( `/topqans/?query=${questionId}` );
    }

    const StatusToggler = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
    
        return (
            <>
            <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                {value==0 && (
                    <div onClick={() => removeAnswerByAdmin(data._id)} className="liveAnswerCell">Live</div>
                )}
                {value==1 && (
                    <div onClick={() => unblockAnyAnswerByAdmin(data._id)} className="blockedAnswerCell">Blocked</div>
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

    const htmlAnswer = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
            <div dangerouslySetInnerHTML={{ __html: value }} />
        )
    }

    const columns = [
        {
            id: 1, 
            field: 'answer', 
            label: 'Answers',
            cellRenderer: htmlAnswer
        },
        {
            id: 2, 
            field: 'fullName', 
            label: 'Answer by',
            cellRenderer: fullNameWithClass
            
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
            id: 6, 
            field: 'removed', 
            label: 'Status',
            cellRenderer: StatusToggler   
        }
    ];


    return (
    <>
    <div className="allAnswers container">

        <GridTable 
            columns={columns}
            rows={rows}
            pageSize={10}
            isLoading={gotDataFromDatabase}
        />
        
        
    <ToastContainer />   
    </div>
    </>
    )
}

export default AllAnswers
