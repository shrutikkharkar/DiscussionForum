import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllFlags.css'
import GridTable from '@nadavshaar/react-grid-table'

function AllFlags() {

    useEffect(() => {
        getAllFlaggedAnswers()
    }, []);

    // const [allFlagDetails, setAllFlagDetails] = useState([])

    const [useBgColor1, setBgColor1] = useState('')
    const [useFontColor1, setFontColor1] = useState('black')

    const [useBgColor2, setBgColor2] = useState('')
    const [useFontColor2, setFontColor2] = useState('black')

    const [useBgColor3, setBgColor3] = useState('')
    const [useFontColor3, setFontColor3] = useState('black')

    const [toggleState, setToggleState] = useState('answers')

    // let columns = []
    const [rows, setAllFlagDetails] = useState()

    async function getAllFlaggedAnswers() {
        selected(1)
        // columns = columnsAnswer
        setToggleState('answers')
        try {
            await axios.get('http://localhost:3001/answer/getAllFlaggedAnswers')
            .then((res) => {
                setAllFlagDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllFlaggedComments() {
        // setColumns(columnsComment)
        setToggleState('comments')
        selected(2)
        try {
            await axios.get('http://localhost:3001/comment/getAllFlaggedComments')
            .then((res) => {
                setAllFlagDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    async function getAllFlaggedQuestions() {
        // setColumns(columnsQuestion)
        selected(3)
        setToggleState('questions')
        try {
            await axios.get('http://localhost:3001/question/getAllFlaggedQuestions')
            .then((res) => {
                setAllFlagDetails(res.data)
                console.log(res.data)
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
                getAllFlaggedAnswers()
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

    async function removeCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/removeCommentByAdmin/${commentId}`)
            .then(res => {
                getAllFlaggedComments()
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


    async function removeQuestionByAdmin(quesId) {

        try {
            const questionId = quesId

            await axios.post(`http://localhost:3001/question/removeQuestionByAdmin/${questionId}`)
            .then(res => {
                getAllFlaggedQuestions()
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

                getAllFlaggedAnswers();
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

                getAllFlaggedComments()
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

                getAllFlaggedQuestions();
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

    const reportedBy = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
            <>
            {data.removed == 1 && (
                <div>{value} ({data.reporterClass}-{data.reporterBranch})</div>
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
            field: 'answer', 
            label: 'Answers',
            headerCellRenderer: ({tableManager, column, mode, ref, checked, disabled, indeterminate, onChange}) => 
                ( 
                <>
                {column.answer && (
                    <div>Answers</div>
                )}
                    
                </>
                )
        },
        {
            id: 2, 
            field: 'fullName', 
            label: 'Answer by',
            cellRenderer:fullNameWithClass
            
        },
        {
            id: 3, 
            field: 'email', 
            label: 'Email',
            
        },
        {
            id: 4, 
            field: 'nameOfReporter', 
            label: 'Reported by',
            searchable: true,
            cellRenderer: reportedBy
            
        },
        {
            id: 5, 
            field: 'removed', 
            label: 'Status',
            cellRenderer: StatusToggler   
        }
    ];

    const columnsQuestion = [
        {
            id: 1, 
            field: 'question', 
            label: 'Questions',
        },
        {
            id: 2, 
            field: 'fullName', 
            label: 'Question by',
            cellRenderer:fullNameWithClass
            
        },
        {
            id: 3, 
            field: 'email', 
            label: 'Email',
            
        },
        {
            id: 4, 
            field: 'nameOfReporter', 
            label: 'Reported by',
            searchable: true,
            cellRenderer: reportedBy
            
        },
        {
            id: 5, 
            field: 'removed', 
            label: 'Status',
            cellRenderer: StatusToggler   
        }
    ];

    const columnsComment = [
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
            field: 'nameOfReporter', 
            label: 'Reported by',
            searchable: true,
            cellRenderer: reportedBy
            
        },
        {
            id: 5, 
            field: 'removed', 
            label: 'Status',
            cellRenderer: StatusToggler   
        }
    ];

    return (
    <>
    <div className="container">

        <div className="buttonsContainer">

            <button className="toggleButtons" 
                style={{backgroundColor: useBgColor1, color: useFontColor1}} 
                onClick={() => getAllFlaggedAnswers()}
            >
                Flagged answers
            </button>

            <button className="toggleButtons" 
                style={{backgroundColor: useBgColor2, color: useFontColor2}} 
                onClick={() => getAllFlaggedComments()}
            >
                Flagged comments
            </button>

            <button className="toggleButtons" 
                style={{backgroundColor: useBgColor3, color: useFontColor3}} 
                onClick={() => getAllFlaggedQuestions()}
            >
                Flagged questions
            </button>

        </div>


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

                    {toggleState == "answers" && (
                        <th scope="col">Answers</th>
                    )}

                    {toggleState == "comments" && (
                        <th scope="col">Comments</th>
                    )}

                    {toggleState == "questions" && (
                        <th scope="col">Questions</th>
                    )}
                    
                    <th scope="col">Email</th>
                    <th scope="col">Name</th>
                    <th scope="col">Reported by</th>

                    {toggleState == "answers" && (
                    <>
                        <th scope="col">Block Answer</th>
                    </>
                    )}

                    {toggleState == "comments" && (
                    <>
                        <th scope="col">Block Comment</th>
                    </>
                    )}

                    {toggleState == "questions" && (
                    <>
                        <th scope="col">Block Question</th>
                    </>
                    )}

                </tr>
            </thead>

        {
            allFlagDetails.map( (flag, index) =>
            (
                <tbody>
                    <tr>
                        <th scope="row">{index+1}</th>

                        {toggleState == "answers" && (
                            <td>{flag.answer}</td>
                        )}
                        
                        {toggleState == "comments" && (
                            <td>{flag.comment}</td>
                        )}

                        {toggleState == "questions" && (
                            <td>{flag.question}</td>
                        )}

                        <td>{flag.email}</td>

                        <td>{flag.fullName} ({flag.Class} - {flag.branch})</td>

                        <td>{flag.nameOfReporter} ({flag.reporterClass} - {flag.reporterBranch})</td>

                        <td>

                        {toggleState == "answers" && flag.removed == 0 && (
                            <button onClick={() => removeAnswerByAdmin(flag._id)} type="button" class="btn btn-secondary">
                                Block Answer
                            </button>
                        )}
                        {toggleState == "answers" && flag.removed != 0 && (
                            <button onClick={() => unblockAnyAnswerByAdmin(flag._id)} type="button" class="btn btn-danger">
                                Unblock Answer
                            </button>
                        )}

 

                        {toggleState == "comments" && flag.removed == 0 && (
                            <button onClick={() => removeCommentByAdmin(flag._id)} type="button" class="btn btn-secondary">
                                Block Comment
                            </button>
                        )}
                        {toggleState == "comments" && flag.removed != 0 &&  (
                            <button onClick={() => unblockAnyCommentByAdmin(flag._id)} type="button" class="btn btn-danger">
                                Unblock Comment
                            </button>
                        )}


                        {toggleState == "questions" && flag.removed == 0 && (
                            <button onClick={() => removeQuestionByAdmin(flag._id)} type="button" class="btn btn-secondary">
                                Block Question
                            </button>
                        )}
                        {toggleState == "questions" && flag.removed != 0 && (
                            <button onClick={() => unblockAnyQuestionByAdmin(flag._id)} type="button" class="btn btn-danger">
                                Unblock Question
                            </button>
                        )}

                        </td>
                     

                    </tr>
                </tbody>
            ))
        }
        </table> */}





    </div>
            
        <ToastContainer />
    </>
    )
}

export default AllFlags
