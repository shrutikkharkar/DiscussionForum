import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {useHistory} from 'react-router-dom'
import AdminPanel from './AdminPanel'
import 'react-toastify/dist/ReactToastify.css';
import './AllAnswers.css'
import GridTable from '@nadavshaar/react-grid-table'
import '@nadavshaar/react-grid-table/dist/index.css'

function AllAnswers() {

    useEffect(() => {
        getAllAnswerDetails()
    }, []);

    const history = useHistory();
    // const [allAnswerDetails, setAllAnswerDetails] = useState([])
    const [rows, setAllAnswerDetails] = useState()
    const [getToggleState, setToggleState] = useState('') 

    async function getAllAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('allAnswers')
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllBlockedAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllBlockedAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('blockedAnswers')
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllMeBlockedAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllMeBlockedAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('meBlockedAnswers')
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function removeAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/removeAnswerByAdmin/${answerId}`)
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

            await axios.post(`http://localhost:3001/answer/unblockAnyAnswerByAdmin/${answerId}`)
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

    async function unblockAnyAnswerByAdmin1(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/unblockAnyAnswerByAdmin/${answerId}`)
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

    async function unblockMyBlockedAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/unblockMyBlockedAnswerByAdmin/${answerId}`)
            .then(res => {
                getAllMeBlockedAnswerDetails();
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

    const columns = [
        {
            id: 1, 
            field: 'answer', 
            label: 'Answers',
        },
        {
            id: 2, 
            field: 'fullName', 
            label: 'Class'
            
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
        />
        
        {/* {getToggleState == "allAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllAnswerDetails()} >
                All Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "blockedAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllAnswerDetails()} >
                All Answers
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "meBlockedAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllAnswerDetails()} >
                All Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Answers
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}

        

        <br />
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Sr.no</th>
                    <th scope="col">Answers</th>
                    <th scope="col">Email</th>
                    {getToggleState == "allAnswers" && (
                        <th scope="col">Block Answer</th>
                    )}
                    {getToggleState == "blockedAnswers" && (
                    <>
                        <th scope="col">Blocked by</th>
                        <th scope="col">Unblock Answer</th>
                    </>
                    )}
                    {getToggleState == "meBlockedAnswers" && (
                        <th scope="col">Unblock Answer</th>
                    )}

                </tr>
            </thead>
        {
        allAnswerDetails.map( (answer, index) => 
        (
            <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td onClick={() => goToAnswerPage(answer.questionID)} style={{cursor: 'pointer'}} >{answer.answer}</td>
                    <td>{answer.email}</td>

                    {getToggleState == "allAnswers" && answer.removed == 0 && (
                    <td><button type="button" onClick={() => removeAnswerByAdmin(answer._id)} class="btn btn-secondary">
                        Block Answer
                    </button></td>
                    )}

                    {getToggleState == "allAnswers" && answer.removed != 0 && (
                    <td><button type="button" onClick={() => unblockAnyAnswerByAdmin1(answer._id)} class="btn btn-danger">
                        Unblock Answer
                    </button></td>
                    )}

                    {getToggleState == "blockedAnswers" && (
                    <>

                    <td>{answer.nameOfRemover} ({answer.Class}-{answer.branch})</td>    
                    <td><button type="button" onClick={() => unblockAnyAnswerByAdmin(answer._id)} class="btn btn-danger">
                        Unblock Answer
                    </button></td>

                    </>
                    )}

                    {getToggleState == "meBlockedAnswers" && (
                    <td><button type="button" onClick={() => unblockMyBlockedAnswerByAdmin(answer._id)} class="btn btn-danger">
                        Unblock Answer
                    </button></td>
                    )}
                    
                  </tr>
            </tbody>
        ))
        }
    
    </table>  */}
    <ToastContainer />   
    </div>
    </>
    )
}

export default AllAnswers
