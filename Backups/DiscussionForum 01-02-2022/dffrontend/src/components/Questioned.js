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

function Questioned() {

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
      className="threeDotMenuIcon"
    >
      {children}
      <HiDotsVertical className="menuIcon" />
    </span>
));


async function questionList() {
    try 
    {
        await axios.get('http://localhost:3001/question/questioned')
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

async function deleteQuestion(quesId) {

    try {
        const questionId = quesId

        await axios.post(`http://localhost:3001/question/deleteQuestion/${questionId}`)
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

function getTagContents(tagName){
    history.push( `/tagPage/?tagName=${tagName}` );
}

function Search(){
    history.push('/searchResult');
}


    if(questions.length!=0){
    return (
        <>
        
        <div className="container questionListContainer col-xs-12">
        <p style={{fontSize: '1.5rem'}} ><b>My Questions</b></p> 
        
        {
        questions.map(question => 
        (
        <>
            <div className="questionBlock" key={question.id}>
               <div className="specialBlock"> 

                < div className="statsBlock">
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

              
              <Dropdown className="menuIconQuestionPageForPhone">
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                    <Dropdown.Item onClick={() => deleteQuestion(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Delete question</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>

          
          
                </div>

                
                {question.removed !=0 && (
                <p className="questionDiscussion">
                    <a style={{color: 'royalblue', cursor: 'default'}} >
                         {question.question}
                    </a>
                    {question.tagsForQuestion && (
                    <>
                        <p className="tagClassPTag">
                        {question.tagsForQuestion.map(tag => (
                            <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                        ))} 
                        </p>
                    </>
                    )}
                    <p style={{color: 'red', cursor: 'default', fontSize: '1rem'}}>Removed by moderators</p>
                </p>
                )}

                {question.removed == 0 && (
                <p className="questionDiscussion">
                    <a onClick={(e) => gotoAnswers(question._id)} style={{color: 'royalblue'}} >
                         {question.question}
                    </a>
                    {question.tagsForQuestion && (
                    <>
                        <p className="tagClassPTag">
                        {question.tagsForQuestion.map(tag => (
                            <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                        ))} 
                        </p>
                    </>
                    )}
                </p>
                )}
                

                </div>
                {/* End of special block */}

                <div className="specialBlockDate">            
                <div className="updateDate">
                    <p className="updatedOnText">Asked on: </p>
                    <span className="updatedOnDateforPhone">Asked on: {question.getDate}</span>
                    <p className="updatedOnDate updatedOnDateforPC">{question.getDate}</p> 
                </div>
              
                    <Dropdown className="menuIconQuestionPage">
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => deleteQuestion(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Delete question</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </div>

            </div>
            
            <hr />      
        </>  
        )

        )}

        </div>
        
        <ToastContainer />
        </>
    );
    }
    else{
    return <h1>Its not there</h1>;
    }
}

export default Questioned
