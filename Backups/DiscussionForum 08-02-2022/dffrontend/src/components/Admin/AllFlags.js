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


    const [useBgColor1, setBgColor1] = useState('')
    const [useFontColor1, setFontColor1] = useState('black')

    const [useBgColor2, setBgColor2] = useState('')
    const [useFontColor2, setFontColor2] = useState('black')

    const [useBgColor3, setBgColor3] = useState('')
    const [useFontColor3, setFontColor3] = useState('black')

    const [toggleState, setToggleState] = useState('answers')

    const [rows, setAllFlagDetails] = useState()

    const [gotDataFromDatabase, setGotDataFromDatabase] = useState(true);

    async function getAllFlaggedAnswers() {
        selected(1)
        setToggleState('answers')
        try {
            await axios.get('http://localhost:3001/answer/getAllFlaggedAnswers')
            .then((res) => {
                setGotDataFromDatabase(false)
                setAllFlagDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllFlaggedComments() {
       
        setToggleState('comments')
        selected(2)
        try {
            await axios.get('http://localhost:3001/comment/getAllFlaggedComments')
            .then((res) => {
                setGotDataFromDatabase(false)
                setAllFlagDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    async function getAllFlaggedQuestions() {
        
        selected(3)
        setToggleState('questions')
        try {
            await axios.get('http://localhost:3001/question/getAllFlaggedQuestions')
            .then((res) => {
                setGotDataFromDatabase(false)
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
            {data.comment && (
            <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                <div onClick={() => removeCommentByAdmin(value)} className="liveAnswerCell">Block Comment</div>   
            </div>
            )}

            {data.answer && (
            <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                <div onClick={() => removeAnswerByAdmin(value)} className="liveAnswerCell">Block Answer</div>   
            </div>
            )}

            {data.question && (
            <div className='rgt-cell-inner' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                <div onClick={() => removeQuestionByAdmin(value)} className="liveAnswerCell">Block Question</div>   
            </div>
            )}
            
            </>
        )
    }

    const reportedBy = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
            <>
            {data.reporterEmail.map( email => (
                <div>{email}<span>, </span></div>
            ))}
            
            {/* {data.detailOfReporter.map( (detail) => (
                <div>
                {detail.nameOfReporter}
                </div>
            ))} */}
                {/* <div>{value}</div> */}
                {/* <div>{value} ({data.reporterClass}-{data.reporterBranch})<br /></div> */}
                {/* {value.map((name, index) => {
                    <div key={index}>{name}</div>
                })} */}
                
            </>
        )
    }

    const fullNameWithClass = ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
            <div>{value} ({data.Class} - {data.branch})</div>
        )
    }

    let columnsAnswers = [
        {
            id: 1, 
            field: 'answer', 
            label: 'Answers'
        },
        {
            id: 11, 
            field: 'numberOfreports', 
            label: 'Reports'
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
            field: 'reporterEmail', 
            label: 'Reported by',
            searchable: true,
            cellRenderer: reportedBy
            
        },
        {
            id: 5, 
            field: '_id', 
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
            id: 11, 
            field: 'numberOfreports', 
            label: 'Reports'
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
            field: '_id', 
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
            id: 11, 
            field: 'numberOfreports', 
            label: 'Reports'
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
            field: '_id', 
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

        {toggleState === 'answers' && (
            <GridTable 
            columns={columnsAnswers}
            rows={rows}
            pageSize={10}
            isLoading={gotDataFromDatabase}
        />
        )}

        {toggleState === 'comments' && (
            <GridTable 
            columns={columnsComment}
            rows={rows}
            pageSize={10}
            isLoading={gotDataFromDatabase}
        />
        )}

        {toggleState === 'questions' && (
            <GridTable 
            columns={columnsQuestion}
            rows={rows}
            pageSize={10}
            isLoading={gotDataFromDatabase}
        />
        )}
        

    </div>
            
    <ToastContainer />
    </>
    )
}

export default AllFlags
