import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import './QuestionList.css'
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import { MdBlock, MdOutlinedFlag } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";

function QuestionList() {

const history = useHistory();

const [questions, setQuestions] = useState([]); 
useEffect(() => {
    questionList()
}, []);

const {loggedIn} = useContext(AuthContext);
const {isAdmin} = useContext(IsAdminContext);

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <HiDotsVertical className="menuIconQuestionPage" />
      {/* <span className="threedots" /> */}
    </span>
));


async function questionList() {
    try 
    {
        await axios.get('http://localhost:3001/question/get/')
        .then(response => {
            console.log(response.data)
            setQuestions(response.data);
        })
    } 
    catch (err) {
        console.error(err);
    }
}

async function gotoAnswers(questionId) {
    history.push( `/topqans/?query=${questionId}` );
    try {
        await axios.post(`http://localhost:3001/question/addView/${questionId}`)
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
            questionList()
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

async function reportQuestionByUser(quesId) {

    try {
        const questionId = quesId

        await axios.post(`http://localhost:3001/question/reportQuestionByUser/${questionId}`)
        .then(res => {
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


    if(questions){
    return (
        <>
        <div className="container w-75 questionListContainer">
        {
        questions.map(question => 
        (
        <div>
            
            <div className="questionBlock" key={question.id}>
                <div className="answerCount">
                    <p>{question.answerCount}</p>
                    <p className="countStat">Answers</p>
                </div>
                <div className="viewCount">
                    <p>{question.viewCount}</p>
                    <p className="countStat">Views</p>
                </div>
                <div className="voteCount">
                    <p>{question.likeCount + question.dislikeCount}</p>
                    <p className="countStat">Votes</p>
                </div>
                <a onClick={(e) => gotoAnswers(question._id)} className="questionDiscussion">
                    <p>
                         {question.question}
                    </p>
                </a>

                <div className="updateDate">
                    <p>Updated on: </p>
                    <p>{question.getDate}</p> 
                </div>

                {loggedIn===true && isAdmin===true && (
              
                    <Dropdown className="menuIconQuestionPage">
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => removeQuestionByAdmin(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block question</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                )}

                {loggedIn===true && isAdmin===false && (

                    <Dropdown className="menuIconQuestionPage">
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => reportQuestionByUser(question._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} />  Report question</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                )}

                
                
            </div>

            {/* {loggedIn===true && isAdmin===true && (
              
                <Dropdown className="menuIconQuestionPage">
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu size="sm" title="">
                      <Dropdown.Item onClick={() => removeQuestionByAdmin(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block question</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                          
            )}

            {loggedIn===true && isAdmin===false && (
                    
                <Dropdown className="menuIconQuestionPage">
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu size="sm" title="">
                      <Dropdown.Item onClick={() => reportQuestionByUser(question._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} /> Report question</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                        
            )} */}
            
            <hr />      
        </div>  
        )

        )}

        </div>
        
        <ToastContainer />
        </>
    );
    }
    return <h1>Its not there</h1>; 

}

export default QuestionList
