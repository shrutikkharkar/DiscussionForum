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
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import SearchBar from './SearchBar'


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
      className="threeDotMenuIcon"
    >
      {children}
      <HiDotsVertical className="menuIcon" />
    </span>
));

const [gotQuestions, setGotQuestions] = useState(false);
const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff width="50" />
  });


async function questionList() {
    try 
    {
        await axios.get('http://localhost:3001/question/get/')
        .then(response => {
            setGotQuestions(true)
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

function getTagContents(tagName){
    history.push( `/tagPage/?tagName=${tagName}` );
}

function Search(){
    history.push('/searchResult');
}

    if(gotQuestions === false){
        return(
            <section className="classForLoader" {...containerProps}>
                {indicatorEl}
            </section>
        )
    }
    else{
    
    return (
        <>
        <div className="container questionListContainer col-xs-12">
            <div className="askQuestionBtnInQListDIV">  
         
            <button onClick={Search} className="btn btn-primary">
            Ask a Question
            </button>

            <span className="breakForAskBtn"><hr /></span>
            </div>
        {questions.length > 0 && (
        <>
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

                    {loggedIn===true && isAdmin===true && (
              
              <Dropdown className="menuIconQuestionPageForPhone">
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                    <Dropdown.Item onClick={() => removeQuestionByAdmin(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block question</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>

          )}

          {loggedIn===true && isAdmin===false && (
          
              <Dropdown className="menuIconQuestionPageForPhone">
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                    <Dropdown.Item onClick={() => reportQuestionByUser(question._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} />  Report question</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>

          )}
          
                </div>

                

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

                </div>
                {/* End of special block */}

                <div className="specialBlockDate">            
                <div className="updateDate">
                    <p className="updatedOnText">Asked on: </p>
                    <span className="updatedOnDateforPhone">Asked on: {question.getDate}</span>
                    <p className="updatedOnDate updatedOnDateforPC">{question.getDate}</p> 
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

                
                
            </div>
            
            <hr />      
        </>  
        )

        )}
        </>
        )}
        {questions.length == 0 && (
            <p><b>No questions asked yet!!</b></p>
        )}
        
        
        

        </div>
        
        <ToastContainer />
        </>
    );
    } 

}

export default QuestionList
