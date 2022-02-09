import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GridTable from '@nadavshaar/react-grid-table'

function AllQuestions() {

    useEffect(() => {
        getAllQuestionDetails()
    }, []);

    const history = useHistory();
    const [rows, setAllQuestionDetails] = useState()
    const [gotDataFromDatabase, setGotDataFromDatabase] = useState(true);

    async function getAllQuestionDetails() {
        try {
            await axios.get('http://localhost:3001/question/getAllQuestionDetails')
            .then((res) => {
                setAllQuestionDetails(res.data)
                setGotDataFromDatabase(false)
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    async function removeQuestionByAdmin(quesId) {

        try {
            const questionId = quesId

            await axios.post(`http://localhost:3001/question/removeQuestionByAdmin/${questionId}`)
            .then(res => {
                getAllQuestionDetails()
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


    async function unblockAnyQuestionByAdmin(quesId) {

        try {
            const questionId = quesId

            await axios.post(`http://localhost:3001/question/unblockAnyQuestionByAdmin/${questionId}`)
            .then(res => {

                getAllQuestionDetails();
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
                    <div onClick={() => removeQuestionByAdmin(data._id)} className="liveAnswerCell">Live</div>
                )}
                {value==1 && (
                    <div onClick={() => unblockAnyQuestionByAdmin(data._id)} className="blockedAnswerCell">Blocked</div>
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
            field: 'question', 
            label: 'Questions'
        },
        {
            id: 2, 
            field: 'fullName', 
            label: 'Question by',
            cellRenderer:fullNameWithClass
            
        },
        {
            id: 1, 
            field: 'answerCount', 
            label: 'Answers'
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
        <div className="allAnswers container">

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

export default AllQuestions
