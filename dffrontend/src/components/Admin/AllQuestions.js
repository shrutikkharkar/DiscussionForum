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
    // const [allQuestionDetails, setAllQuestionDetails] = useState([])
    const [rows, setAllQuestionDetails] = useState()
    const [getToggleState, setToggleState] = useState('') 

    async function getAllQuestionDetails() {
        try {
            await axios.get('http://localhost:3001/question/getAllQuestionDetails')
            .then((res) => {
                setToggleState('allQuestions')
                setAllQuestionDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    async function getAllBlockedQuestionDetails() {
        try {
            await axios.get('http://localhost:3001/question/getAllBlockedQuestionDetails')
            .then((res) => {
                setToggleState('blockedQuestions')
                setAllQuestionDetails(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllMeBlockedQuestionDetails() {
        try {
            await axios.get('http://localhost:3001/question/getAllMeBlockedQuestionDetails')
            .then((res) => {
                setToggleState('meBlockedQuestions')
                setAllQuestionDetails(res.data)
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

    async function unblockAnyQuestionByAdmin1(quesId) {

        try {
            const questionId = quesId

            await axios.post(`http://localhost:3001/question/unblockAnyQuestionByAdmin/${questionId}`)
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

    async function unblockMeBlockedQuestionByAdmin(quesId) {

        try {
            const questionId = quesId

            await axios.post(`http://localhost:3001/question/unblockMeBlockedQuestionByAdmin/${questionId}`)
            .then(res => {
                getAllMeBlockedQuestionDetails();
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

        {/* {getToggleState == "allQuestions" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllQuestionDetails()} >
                All Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedQuestionDetails()} >
                Blocked Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedQuestionDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "blockedQuestions" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllQuestionDetails()} >
                All Questions
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllBlockedQuestionDetails()} >
                Blocked Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedQuestionDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "meBlockedQuestions" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllQuestionDetails()} >
                All Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedQuestionDetails()} >
                Blocked Questions
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllMeBlockedQuestionDetails()} >
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
                <th scope="col">Question</th>
                <th scope="col">Email</th>
                <th scope="col">Question by.</th>
                <th scope="col">Answers</th>
                {getToggleState == "allQuestions" && (
                    <th scope="col">Block Question</th>
                )}
                {getToggleState == "blockedQuestions" && (
                <>
                    <th scope="col">Blocked by</th>
                    <th scope="col">Unblock Question</th>
                </>
                )}
                {getToggleState == "meBlockedQuestions" && (
                    <th scope="col">Unblock Question</th>
                )}
              </tr>
            </thead>

        {
        allQuestionDetails.map( (question, index) => 
        (
            <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{question.question}</td>
                    <td>{question.email}</td>
                    <td>{question.fullName} ({question.class}-{question.branch})</td>
                    <td>{question.answerCount}</td>

                    {getToggleState == "allQuestions" && question.removed == 0 && (
                    <td><button type="button" onClick={() => removeQuestionByAdmin(question._id)} class="btn btn-secondary">
                        Block Question
                    </button></td>
                    )}

                    {getToggleState == "allQuestions" && question.removed != 0 && (
                    <td><button type="button" onClick={() => unblockAnyQuestionByAdmin1(question._id)} class="btn btn-danger">
                        Unblock Question
                    </button></td>
                    )}
                    

                    {getToggleState == "blockedQuestions" && (
                    <>

                    <td>{question.nameOfRemover} ({question.Class}-{question.branch})</td>    
                    <td><button type="button" onClick={() => unblockAnyQuestionByAdmin(question._id)} class="btn btn-danger">
                        Unblock Question
                    </button></td>

                    </>
                    )}

                    {getToggleState == "meBlockedQuestions" && (
                    <td><button type="button" onClick={() => unblockMeBlockedQuestionByAdmin(question._id)} class="btn btn-danger">
                        Unblock Question
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

export default AllQuestions
