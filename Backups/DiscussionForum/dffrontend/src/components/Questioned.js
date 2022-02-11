import React, {useState, useRef, useEffect, useContext, useCallback} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import './QuestionList.css'
import { RiArrowDropDownLine, RiProfileFill } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import { MdBlock, MdOutlinedFlag } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import Dropdown from "react-bootstrap/Dropdown";
import { AiFillCloseCircle } from "react-icons/ai";
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';

import { Pagination } from "react-pagination-bar"
import 'react-pagination-bar/dist/index.css'

function Questioned() {

    const [currentPage, setCurrentPage] = useState(1);
    const pagePostsLimit = 5;

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

const history = useHistory();
const [modal, setModal] = useState(false);
const [modalForUpdateQuestion, setModalForUpdateQuestion] = useState(false);
const [allTagNames, setAllTagNames] = useState([]);

const [questions, setQuestions] = useState([]); 
useEffect(() => {
    questionList()
    getAllTagNames()
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

const baseTagifySettings = {
    blacklist: ["xxx", "yyy", "zzz"],
    whitelist: allTagNames,
    maxTags: 6,
    placeholder: "add tags (optional)",
    dropdown: {
    }
  }

const tagifyRef1 = useRef()
const tagifyRefDragSort = useRef()

const [tagifySettings, setTagifySettings] = useState([])
const [tagifyProps, setTagifyProps] = useState({})

const settings = {
    ...baseTagifySettings,
    ...tagifySettings
}

const [gotQuestioned, setGotQuestioned] = useState(false);
const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff width="50" />
});


async function getAllTagNames() {
    try {
        await axios.get(`${BEHOST}:${BEPORT}/tag/getAllTagNames`)
        .then(response => {
            setAllTagNames(response.data);
        })
    }
    catch (err) {
        console.error(err);
    }
}


async function questionList() {
    try 
    {
        await axios.get(`${BEHOST}:${BEPORT}/question/questioned`)
        .then(response => {
            setGotQuestioned(true)
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
        await axios.post(`${BEHOST}:${BEPORT}/question/addView/${questionId}`)
    }
    catch (err) {
        console.error(err);
    }
}

async function deleteQuestion(quesId) {

    try {
        const questionId = quesId

        await axios.post(`${BEHOST}:${BEPORT}/question/deleteQuestion/${questionId}`)
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

var [getTagsForQuestion, setTagsForQuestion] = useState([]);
const [wasTagUpdated, setWasTagUpdated] = useState(false);

const onChange = useCallback(e => {
    setTagsForQuestion(e.detail.tagify.value)
    setWasTagUpdated(true)
}, [])

    const [questionForUpdate, setQuestionForUpdate] = useState('')
    const [questionIdForUpdate, setQuestionIdForUpdate] = useState('')
    const [tagsForQuestionUpdate, setTagsForQuestionUpdate] = useState([])

    function openUpdateModal(quesId, question, tagsForQuestion){
        
        setModalForUpdateQuestion(true)
        setQuestionForUpdate(question)
        setQuestionIdForUpdate(quesId)
        setTagsForQuestionUpdate(tagsForQuestion)
        setWasTagUpdated(false)
        
    }

    async function updateQuestion(e) {
        e.preventDefault()
        try{
            const questionId = questionIdForUpdate
            const question = questionForUpdate

            if(wasTagUpdated === true){

                let tagsForQuestion = getTagsForQuestion.map(a => a.value);
                const questionData = {question, tagsForQuestion};

                await axios.post(`${BEHOST}:${BEPORT}/question/updateQuestion/${questionId}`, questionData)
                .then(res => {
                    questionList()
                    setModalForUpdateQuestion(false)
                    toast.success(`${res.data}`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }); 
                })
            }
            if(wasTagUpdated === false) {
                
                let tagsForQuestion = tagsForQuestionUpdate
                const questionData = {question, tagsForQuestion};

                await axios.post(`${BEHOST}:${BEPORT}/question/updateQuestion/${questionId}`, questionData)
                .then(res => {
                    questionList()
                    setModalForUpdateQuestion(false)
                    toast.success(`${res.data}`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }); 
                })
            }
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


    if(gotQuestioned == false ){
        return ( 
            <section className="classForLoader" {...containerProps}>
                {indicatorEl}
            </section>
        )
    }
    else{

    if(questions.length!=0){
    return (
        <>
        
        <div className="container questionListContainer col-xs-12">
        <p style={{fontSize: '1.5rem'}} ><b>My Questions</b></p> 
        
        {questions.length > 0 && (
        <>
        
        {
        questions
        .slice((currentPage - 1) * pagePostsLimit, currentPage * pagePostsLimit)
        .map(question => 
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
                    <Dropdown.Item onClick={() => deleteQuestion(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  />
                     Delete question
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => openUpdateModal(question._id, question.question, question.tagsForQuestion)}>
                      <RiProfileFill style={{fontSize: '1.1rem'}}  /> Update Question
                    </Dropdown.Item>
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
                          
                            <Dropdown.Item onClick={() => deleteQuestion(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> 
                             Delete question
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => openUpdateModal(question._id, question.question, question.tagsForQuestion)}>
                              <RiProfileFill style={{fontSize: '1.1rem'}}  /> Update Question
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>

                </div>

            </div>
            
            <hr />      
        </>  
        )

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

        </div>

        {/* For update answer */}
        <PureModal
                    header={"Update Question"}

                    // className="modal-body"

                width={"500px"}
                scrollable={false}
                  

                onClose={() => {
                    setModalForUpdateQuestion(false);
                    return true;
                }}
                closeButton={<AiFillCloseCircle style={{fontSize: '2rem'}} />}
                closeButtonPosition="header"

                  isOpen={modalForUpdateQuestion}
                >
                  
                <div>      
                <form onSubmit={updateQuestion}>
                    <div className="form-group" >
                        <textarea type="text" value={questionForUpdate} onChange={(e) => setQuestionForUpdate(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="1"
                        placeholder="Update your answer..." rows="3" ></textarea>
                        <Tags 
                            tagifyRef={tagifyRef1}
                            settings={settings}
                            {...tagifyProps}
                            defaultValue={tagsForQuestionUpdate}
                            onChange={onChange} />

                        <br />
                        <button type="submit" className="btn btn-secondary">Update</button>
                        
                    </div>
                </form>
                </div>


                </PureModal>
        
        <ToastContainer />
        </>
    );
    }
    else{
    return (
        <div className="container questionListContainer col-xs-12">
            <p style={{fontSize: '1.5rem'}}><b>No questions asked</b></p>
        </div>);
    }
    }
}

export default Questioned
