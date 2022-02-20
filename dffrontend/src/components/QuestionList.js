import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import './QuestionList.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import { MdBlock, MdOutlinedFlag } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import SearchBar from './SearchBar'
import { Pagination } from "react-pagination-bar"
import 'react-pagination-bar/dist/index.css'
import io from "socket.io-client"
import SocketContext from '../context/SocketContext';

// const socket = io.connect(`${process.env.REACT_APP_BEHOST}:${process.env.REACT_APP_BEPORT}`)

function QuestionList() {

const location = useLocation();

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

const history = useHistory();

const [questions, setQuestions] = useState([]); 


const {socket} = useContext(SocketContext);

useEffect(() => {

    // socket.emit('leaveAllRooms', 'leaveAllRooms');
    socket.emit('joinQuestionPage', 'questionListPage');
    setTimeout(() => questionList(), 500);
    
}, []);


socket.off('getNewQuestions').on('getNewQuestions', () => {
    questionList()
    console.log("Called")
    toast.dark("Someone just asked a new question!", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
});


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


const [currentPage, setCurrentPage] = useState(1);
const pagePostsLimit = 4;


async function questionList() {
    try 
    {
        await axios.get(`${BEHOST}:${BEPORT}/question/get/`)
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
        await axios.post(`${BEHOST}:${BEPORT}/question/addView/${questionId}`)
    }
    catch (err) {
        console.error(err);
    }
}

async function removeQuestionByAdmin(quesId) {

    try {
        const questionId = quesId

        await axios.post(`${BEHOST}:${BEPORT}/question/removeQuestionByAdmin/${questionId}`)
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

        await axios.post(`${BEHOST}:${BEPORT}/question/reportQuestionByUser/${questionId}`)
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


    if(gotQuestions === false){
        return(
        <div className="container questionListContainer col-xs-12">
            <section className="classForLoader" {...containerProps}>
                {indicatorEl}
            </section>
        </div>
        )
    }
    else{
    
    return (
        <>
        <div className="container questionListContainer col-xs-12">
            <div className="askQuestionBtnInQListDIV">  
         
            <button onClick={() => history.push('/askQuestion')} className="btn btn-primary">
            Ask a Question
            </button>

            <span className="breakForAskBtn"><hr /></span>
            </div>
        {questions.length > 0 && (
        <>
        {
        questions
        .slice((currentPage - 1) * pagePostsLimit, currentPage * pagePostsLimit)
        .map(question => 
        
        <div>
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
        </div>  
        

        )}
        <Pagination
            initialPage={currentPage}
            itemsPerPage={pagePostsLimit}
            onPageСhange={(pageNumber) => setCurrentPage(pageNumber)}
            totalItems={questions.length}
            pageNeighbours={1}
            withProgressBar={true}
        />
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
