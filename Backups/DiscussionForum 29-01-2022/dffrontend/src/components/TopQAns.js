import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import IsCollegeIdContext from '../context/IsCollegeIdContext'
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { MdBlock, MdReportProblem, MdVerified, MdRemoveCircle, MdOutlinedFlag } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import Modal from 'react-bootstrap/Modal';
import { AiFillCloseCircle } from "react-icons/ai";
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import {Link, useHistory} from 'react-router-dom'
import CKEditorArea from "./CKEditor";
import { ToastContainer, toast } from 'react-toastify';
import { MentionsInput, Mention } from 'react-mentions'
import { WithContext as ReactTags } from 'react-tag-input';
import {usePopper} from 'react-popper';
import { createPopper } from '@popperjs/core';
import Dropdown from "react-bootstrap/Dropdown";
import 'react-toastify/dist/ReactToastify.css';
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import VCETLogo from '../VCETLogo.svg'

import Tagify from '@yaireo/tagify'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS

import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';

import io from 'socket.io-client'
let socket = io(`http://localhost:3001`)


function TopQAns() {

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);

    const [answer, setAnswer] = useState('')
    const [comment, setComment] = useState('')

    const [answerByIdForNotification, setAnswerByIdForNotification] = useState('')
    

    const [answerIdForComment, setAnswerIdForComment] = useState('')
    const [answers, setAnswers] = useState([])
    const questionID = queryParams.get('query')
    const [question, setQuestion] = useState([])
    const [comments, setComments] = useState([]);
    const [allTagNames, setAllTagNames] = useState([]);
    const [show, setShow] = useState(false);
    const [answerForComment, setAnswerForComment] = useState('');

    const [modal, setModal] = useState(false);

    // For block btn
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <span
          ref={ref}
          onClick={e => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
          <HiDotsVertical className="menuIcon" />
        </span>
      ));

        const { containerProps, indicatorEl } = useLoading({
          loading: true,
          indicator: <Puff width="20" />
        });


      
      const baseTagifySettings = {
        blacklist: ["xxx", "yyy", "zzz"],
        whitelist: allTagNames,
        maxTags: 6,
        //backspace: "edit",
        placeholder: "add tags (optional)",
        dropdown: {
            enabled: 1, // a;ways show suggestions dropdown
            searchKeys: ["tagName"]
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

    // const [answerTags, setAnswerTags] = useState();
    var [getTagsForAnswer, setTagsForAnswer] = useState();
    const onChange = useCallback(e => {
        // setTagsForAnswer(e.detail.value)
        setTagsForAnswer(e.detail.tagify.value)
    }, [])


    
    // access Tagify internal methods example:
    const clearAll = () => {
      tagifyRef1.current && tagifyRef1.current.removeAllTags()
    }


    // callbacks for all of Tagify's events:
    // onTagifyAdd = e => {
    //     console.log('added:', e.detail);
    // }

    // onTagifyRemove = e => {
    //     console.log('remove:', e.detail);
    // }

    // onTagifyInput = e => {
    //     console.log('input:', e.detail);
    // }

    // onTagifyInvalid = e => {
    //     console.log('invalid:', e.detail);
    // }


    /*
    socket.on('message', (data) => {
        document.querySelector('h1').innerHTML = data
    })

    const sendMessage = () => {
      const messageInput = document.querySelector('.message')
      const message = messageInput.value
      socket.emit('message', message)
    }
    
    */


    useEffect(() => {
        getQuestion()
        getAnswers()
        getAllTagNames()

    }, []);


    socket.on('madeChange', (data) => {
        getAnswers()
    })

    

    // socket.on("new_msg", function(data) {
    //     toast.dark(data.msg, {
    //         position: "bottom-left",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //     });
    // });

    async function getAllTagNames() {
        try {
            await axios.get(`http://localhost:3001/tag/getAllTagNames`)
            .then(response => {
                setAllTagNames(response.data);
                console.log(response.data);
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getQuestion() {
        try 
        {
            await axios.get(`http://localhost:3001/question/get/${questionID}`)
            .then(response => {
                console.log(response.data)
                setQuestion(response.data);
                // console.log(response.data[0].questionById);
            })
        } 
        catch (err) {
            console.error(err);
        }
    }


    async function getAnswers() {
        try 
        {
            if(loggedIn===true){ //this is for toggling like and dislike
                await axios.get(`http://localhost:3001/answer/getForUser/${questionID}`)
                .then(response => {
                    setAnswers(response.data);
                    console.log(response.data);
                })
            }
            else{
                await axios.get(`http://localhost:3001/answer/get/${questionID}`)
                .then(response => {
                    setAnswers(response.data);
                })
            }
            
        }
        catch (err) {
            console.error(err);
        }
    }


    async function giveAnswer(e) {
        e.preventDefault()

        try {
            const questionById = question[0].questionById
            const questionByEmail = question[0].questionByEmail

            // var resultTagsForAnswer = JSON.parse(getTagsForAnswer);
            let tagsForAnswer = getTagsForAnswer.map(a => a.value);
            const answerData = {questionID, answer, questionById, questionByEmail, tagsForAnswer};
            

            await axios.post('http://localhost:3001/answer/post', answerData)
            .then(res => {

                toast.success(`${res.data}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                getAnswers()
                socket.emit('makeChange', "Hello");
                
            })
               

        }
        catch (err) {
            toast.dark(err.response, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error(err);
        }
    }


    async function writeComment(e) {
        e.preventDefault()

        try {

            const answeredById = answerByIdForNotification
            const commentData = {comment, questionID, answeredById};
            
            await axios.post(`http://localhost:3001/comment/addComment/${answerIdForComment}`, commentData)
            .then(res => {
                getComments(answerIdForComment) 
                toast.success(`${res.data}`, {
                    position: "top-center",
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
            alert("Login or Register first")
            console.error(err);
        }
    }


    async function likeAnswer(ansId, answeredById) {

        try {
            const notificationData = {answeredById}

            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/like/${answerId}`, notificationData)
            .then(res => {
                getAnswers()

                // socket.emit('makeChange', "Hello")

                toast.success('Liked successfully!', {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // socket.emit('sendLikedNotification', {id: answerId});

            })

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeLike(answerId) {
        try {
            axios.post(`http://localhost:3001/answer/removeLike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.dark('Removed Like!', {
                    position: "bottom-left",
                    autoClose: 2000,
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

    async function dislikeAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/dislike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.success('Disliked answer successfully!', {
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
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeDislike(answerId) {
        try {
            axios.post(`http://localhost:3001/answer/removeDislike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.dark('Removed dislike!', {
                    position: "bottom-left",
                    autoClose: 2000,
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

    async function saveAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/save/${answerId}`)
            .then(res => {
                getAnswers()
                toast.success('Saved answer successfully!', {
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
            //alert("Login or Register first")
            console.error(err);
        }
    }

    function removeSave(answerId) {

        try{
            axios.post(`http://localhost:3001/answer/removeSave/${answerId}`)
            .then(res => {
                getAnswers()
                toast.dark('Removed saved answer!', {
                    position: "bottom-left",
                    autoClose: 2000,
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

    async function removeAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/removeAnswerByAdmin/${answerId}`)
            .then(res => {
                getAnswers()
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

    async function deleteComment(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/deleteComment/${commentId}`)
            .then(res => {
                getComments(answerIdForComment)
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

    async function reportAnswerByUser(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/reportAnswerByUser/${answerId}`)
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

    async function removeQuestionByAdmin(quesId) {

        try {
            const questionId = quesId

            await axios.post(`http://localhost:3001/question/removeQuestionByAdmin/${questionId}`)
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


    async function removeCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/removeCommentByAdmin/${commentId}`)
            .then(res => {
                getComments(answerIdForComment)
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

    async function reportCommentByUser(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`http://localhost:3001/comment/reportCommentByUser/${commentId}`)
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




    async function getComments(ansId, answeredById){
        const answerId = ansId
        setAnswerIdForComment(answerId)
        setAnswerByIdForNotification(answeredById)
        setModal(true)
        // setShow(true);
        
        try 
        { 
            if(loggedIn===true){
                await axios.get(`http://localhost:3001/comment/getCommentsForUser/${answerId}`)
                .then(response => {
                    setComments(response.data);
                    setAnswerForComment(response.data[0].answer);
                })
            }
            else{
                await axios.get(`http://localhost:3001/comment/getComments/${answerId}`)
                .then(response => {
                    setComments(response.data);
                    setAnswerForComment(response.data[0].answer);
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

    if(question.length!=0){
    return (
        
        <>
        {/* <section {...containerProps}>
        {indicatorEl} */}

        <div className="container col-xs-12 topQAnsList">
            {
            question.map(question => (
                <div key={question.id}>
                <p className="topQuesAnsPageAnswer">{question.question}

                <p style={{float: 'right', color: 'cornflowerblue'}}>-{question.fullName} ({question.Class} - {question.branch})</p>
                
                </p>
                {question.tagsForQuestion && (
                <>
                    <p className="tagClassPTag">
                    {question.tagsForQuestion.map(tag => (
                        <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                    ))} 
                    </p>
                </>
                )}
                {loggedIn===true && isAdmin===true && (
                        
                    <Dropdown style={{display: 'inline'}}>
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => removeQuestionByAdmin(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block question</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                            
                )}
                {loggedIn===true && isAdmin===false && (
                        
                    <Dropdown style={{display: 'inline'}}>
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => reportQuestionByUser(question._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} /> Report question</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                            
                )}

                </div>
            ))
            }
                
                <hr className="hrBelowAns"/>
                <p style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Answers: </p>
                
                {/* <br /> */}
                <hr />
                
                {
                answers.map(answer =>
                ( 
                    
                <div key={answer.id}>
                <div className="answerOnTopQAns">
                    <span className="answer">{answer.answer}</span>
                    
                </div>
                {answer.tagsForAnswer && (
                <>
                    {/* <Tags 
                        defaultValue={answer.tagsForAnswer} 
                        readOnly
                    /> */}
                    <p className="tagClassPTag">
                    {answer.tagsForAnswer.map(tag => (
                        <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                    ))} 
                    </p>
                </>
                )}
                <div className="answeredByName">
                    <span className="answeredBy">by. {answer.fullName}</span>
                    <span className="answeredBy"  style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})
                    {
                        answer.isAdmin === true && (
                            <>
                                &nbsp;
                                <MdVerified className="verifiedIcon" />
                            </>
                        )
                    }
                    {
                        answer.isAdmin === false && answer.isCollegeId === true && (
                            <>
                                &nbsp;&nbsp;
                                {/* College logo here */}
                                <img
                                  src={VCETLogo}
                                  style={{ height: 20, width: 20 }}
                                  alt="Verified college Id"
                                />
                            </>
                        )
                    }
                    </span>  
                </div>


                
                
                {/* <p>{(answer.tagsForAnswer).length}</p> */}
                <div>
                    {
                        answer.liked === true && (
                        <>
                            <BiLike className="likeIcon liked" onClick={() => removeLike(answer._id)} />
                            <span className="vote_count"> {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                            
                        </>
                        )
                    }
                    {
                        answer.liked === false && (
                        <>
                            <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id, answer.answeredById)} />
                            <span className="vote_count"> {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                        </>
                        )
                    }
                    {
                        loggedIn === false && (
                        <>
                            <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id)} />
                            <span className="vote_count"> {answer.likeCount}</span>
                        </>
                        )
                    }
                    
                    {
                        answer.disliked === true && (
                            <>
                                <BiDislike className="dislikeIcon disliked" onClick={() => removeDislike(answer._id)} />
                                <span className="vote_count"> {answer.dislikeCount}</span>
                                <span>&nbsp; &nbsp;</span>
                            </>
                        )
                    }
                    {
                        answer.disliked === false && (
                            <>
                                <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(answer._id)} />
                                <span className="vote_count"> {answer.dislikeCount}</span>
                                <span>&nbsp; &nbsp;</span>
                            </>
                        )
                    } 
                    {
                        loggedIn === false && (
                        <>
                            <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(answer._id)} />
                            <span className="vote_count"> {answer.dislikeCount}</span>
                            <span>&nbsp; &nbsp;&nbsp; &nbsp;</span>
                        </>
                        )
                    }
                    
               
                    <BiCommentDetail className="commentIcon" onClick={() => getComments(answer._id, answer.answeredById)} />
                    <span className="comment_count"> {answer.commentCount}</span>
                    <span>&nbsp; &nbsp;</span>

                    {loggedIn===true && isAdmin===true && (
                    <Dropdown style={{display: 'inline'}}>
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => removeAnswerByAdmin(answer._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block answer</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    )}

                    {loggedIn===true && isAdmin===false && (
                    <Dropdown style={{display: 'inline'}}>
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                          <Dropdown.Item onClick={() => reportAnswerByUser(answer._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} /> Report answer</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> 
                    )}

                    {
                        answer.saved === true && (
                        <span>
                            <BiBookmark onClick={() => removeSave(answer._id)} className="bookmark saved" />
                        </span>
                        )
                    }
                    {
                        answer.saved === false && (
                        <span>
                            <BiBookmark onClick={() => saveAnswer(answer._id)} className="bookmark" />
                        </span>
                        )
                    }
                    
                </div>

                <PureModal
                    header={answerForComment}

                    className="modal-body"

                width={"1000px"}
                scrollable={true}
                  footer={
                    <form onSubmit={writeComment}>
                    <div className="form-group" >
                        <input type="text" onChange={(e) => setComment(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="1"
                        placeholder="Write a comment..."></input>
                        <br />
                        <button type="submit" className="btn btn-secondary">Post</button>
                        
                        
                    </div>
                </form>}

                onClose={() => {
                    setModal(false);
                    return true;
                }}
                closeButton={<AiFillCloseCircle style={{fontSize: '2rem'}} />}
                closeButtonPosition="header"

                  isOpen={modal}
                >
                  
                  <div>
                          {comments.map(comment => (
                            <>
                            <span style={{color:"dodgerblue"}}>{comment.fullName} ({comment.Class} - {comment.branch})</span>
                            {
                                comment.isAdmin === true && (
                                <>
                                    &nbsp;
                                    <MdVerified className="verifiedIcon" />
                                </>
                                )
                            }
                            {
                                comment.isAdmin === false && answer.isCollegeId === true && (
                                    <>
                                        &nbsp;
                                        <img
                                          src={VCETLogo}
                                          style={{ height: 15, width: 15 }}
                                          alt="Verified college Id"
                                        />
                                    </>
                                )
                            }
                            &nbsp;&nbsp;
                            <span key={comment.id}>
                              {comment.comment}

                              {loggedIn===true && isAdmin===true && (
                                <Dropdown style={{display: 'inline', float: 'right'}}>
                                    <Dropdown.Toggle as={CustomToggle} />
                                    <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                                      <Dropdown.Item onClick={() => removeCommentByAdmin(comment._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block Comment</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                )}

                                {loggedIn===true && isAdmin===false && (
                                <Dropdown style={{display: 'inline', float: 'right'}}>
                                    <Dropdown.Toggle as={CustomToggle} />
                                    <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                                      <Dropdown.Item onClick={() => reportCommentByUser(comment._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} /> Report Comment</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> 
                                )}
                                
                              {comment.commentedByMe == true && (
                                  <MdRemoveCircle className="deleteCommentIcon" onClick={() => deleteComment(comment._id)} />
                              )}

                            

                            </span>
                            <hr />
                            </>
                          ))}
                        
                        </div>


                </PureModal>
        
                <hr />
                </div>
                
                ))}
                <br />
                
                <form onSubmit={giveAnswer}>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Post an answer to this question, it will help this community grow!</label>
                        <textarea onChange={(e) => setAnswer(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="2"
                        placeholder="Answer here..." ></textarea>
                        <Tags 
                            tagifyRef={tagifyRef1}
                            settings={settings}
                            {...tagifyProps}
                            onChange={onChange} />
                    </div>
                    <br />
                    <button type="submit" className="btn btn-secondary">Post</button>
                </form>
        </div>  

        <ToastContainer />      
        {/* </section>  */}
        </>
    )
    }
    // else{
    //     return (
    //         <>
    //             <h1 style={{display: 'flex',justifyContent: 'center'}}>loading...</h1>
    //         </>
    //     )
    // }
}

export default TopQAns
