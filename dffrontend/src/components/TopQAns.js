import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import SocketContext from '../context/SocketContext'
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { MdBlock, MdReportProblem, MdVerified, MdRemoveCircle, MdOutlinedFlag } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import {Link, useHistory} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import Dropdown from "react-bootstrap/Dropdown";
import 'react-toastify/dist/ReactToastify.css';
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import VCETLogo from '../Images/VCETLogo.svg'
import { Pagination } from "react-pagination-bar"
import 'react-pagination-bar/dist/index.css'

import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS

import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Spinner } from 'react-bootstrap';

import io from 'socket.io-client'
import { auto } from '@popperjs/core';

import {likeAnswer} from '../Controllers.js'


function TopQAns() {

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

// let socket = io(`${BEHOST}:${BEPORT}`)

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    const {socket} = useContext(SocketContext)

    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);

    const [answer, setAnswer] = useState('')
    const [comment, setComment] = useState('')

    const [answerByIdForNotification, setAnswerByIdForNotification] = useState('')
    
    const [posting, setPosting] = useState(false)

    const [answerIdForComment, setAnswerIdForComment] = useState('')
    const [answers, setAnswers] = useState([])
    const questionID = queryParams.get('query')
    const [question, setQuestion] = useState([])
    const [comments, setComments] = useState([]);
    const [allTagNames, setAllTagNames] = useState([]);
    const [answerForComment, setAnswerForComment] = useState('');

    const [modal, setModal] = useState(false);
    const [modalForLikedBy, setModalForLikedBy] = useState(false);
    
    const [gotQuestion, setGotQuestion] = useState(false);
    const [gotAnswers, setGotAnswers] = useState(false);

    const [likedBy, setLikedBy] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pagePostsLimit = 5;
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
        indicator: <Puff width="50" />
      });

        
      
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

    // const [answerTags, setAnswerTags] = useState();
    var [getTagsForAnswer, setTagsForAnswer] = useState([]);
    const onChange = useCallback(e => {
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
        socket.on('connection')
        socket.emit('join', {questionID});

    }, []);


    // socket.on('madeChange', (data) => {
    //     getAnswers()
    // })

    // socket.on("newAnswer", function(data) {
    //     getAnswers()
    //     // toast.dark(data.msg, {
    //     //     position: "top-center",
    //     //     autoClose: 4000,
    //     //     hideProgressBar: false,
    //     //     closeOnClick: true,
    //     //     pauseOnHover: true,
    //     //     draggable: true,
    //     //     progress: undefined,
    //     // });
    // })

    socket.off('getNewAnswers').on('getNewAnswers', () => {
        getAnswers()
        console.log("came")
        toast.dark("Someone just added a new answer!", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    });

    

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
            await axios.get(`${BEHOST}:${BEPORT}/tag/getAllTagNames`)
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
            await axios.get(`${BEHOST}:${BEPORT}/question/get/${questionID}`)
            .then(response => {
                setQuestion(response.data);
                setGotQuestion(true);
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
                await axios.get(`${BEHOST}:${BEPORT}/answer/getForUser/${questionID}`)
                .then(response => {
                    setAnswers(response.data);
                    console.log(response.data);
                    setGotAnswers(true);
                })
            }
            else{
                await axios.get(`${BEHOST}:${BEPORT}/answer/get/${questionID}`)
                .then(response => {
                    setAnswers(response.data);
                    console.log(response.data);
                    setGotAnswers(true);
                })
            }
            
        }
        catch (err) {
            console.error(err);
        }
    }


    async function giveAnswer(e) {
        e.preventDefault()
        setPosting(true)

        try {
            const questionById = question[0].questionById
            const questionByEmail = question[0].questionByEmail

            let tagsForAnswer = getTagsForAnswer.map(a => a.value);
            const answerData = {questionID, answer, questionById, questionByEmail, tagsForAnswer};
            

            await axios.post(`${BEHOST}:${BEPORT}/answer/post`, answerData)
            .then(res => {
                setPosting(false)
                getAllTagNames()
                setAnswer('')
                toast.success("Answer submitted successfully!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                getAnswers()
                clearAll()
                // socket.emit('makeChange', "Hello");
                socket.emit('newAnswer', {questionID: res.data});
                
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
            
            await axios.post(`${BEHOST}:${BEPORT}/comment/addComment/${answerIdForComment}`, commentData)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment) 
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

            await axios.post(`${BEHOST}:${BEPORT}/answer/like/${answerId}`, notificationData)
            .then(res => {
                getAnswers()
            })

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }

    // const likeAnswer = async (req, res) => {

    // }
    // let LikeAnswer = likeAnswer(ansId, answeredById)
    // LikeAnswer.then( res => {
    //     setAnswers(res)
    // })

    function removeLike(answerId) {
        try {
            axios.post(`${BEHOST}:${BEPORT}/answer/removeLike/${answerId}`)
            .then(res => {
                getAnswers()
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function dislikeAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/dislike/${answerId}`)
            .then(res => {
                getAnswers()
            })

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeDislike(answerId) {
        try {
            axios.post(`${BEHOST}:${BEPORT}/answer/removeDislike/${answerId}`)
            .then(res => {
                getAnswers()
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function saveAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/save/${answerId}`)
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
            axios.post(`${BEHOST}:${BEPORT}/answer/removeSave/${answerId}`)
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

            await axios.post(`${BEHOST}:${BEPORT}/answer/removeAnswerByAdmin/${answerId}`)
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

            await axios.post(`${BEHOST}:${BEPORT}/comment/deleteComment/${commentId}`)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment)
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

            await axios.post(`${BEHOST}:${BEPORT}/answer/reportAnswerByUser/${answerId}`)
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

            await axios.post(`${BEHOST}:${BEPORT}/question/removeQuestionByAdmin/${questionId}`)
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


    async function removeCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`${BEHOST}:${BEPORT}/comment/removeCommentByAdmin/${commentId}`)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment)
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

            await axios.post(`${BEHOST}:${BEPORT}/comment/reportCommentByUser/${commentId}`)
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




    async function getComments(ansId, answeredById, answerForCommentHeader){
        setAnswerForComment(answerForCommentHeader);
        const answerId = ansId
        setAnswerIdForComment(answerId)
        setAnswerByIdForNotification(answeredById)
        setModal(true)
        
        try 
        { 
            if(loggedIn===true){
                await axios.get(`${BEHOST}:${BEPORT}/comment/getCommentsForUser/${answerId}`)
                .then(response => {
                    setComments(response.data);
                    console.log(response.data);
                    
                })
            }
            else{
                await axios.get(`${BEHOST}:${BEPORT}/comment/getComments/${answerId}`)
                .then(response => {
                    setComments(response.data);
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

    async function getLikedByList(answerId){
        try {

            await axios.get(`${BEHOST}:${BEPORT}/answer/getLikedByList/${answerId}`)
            .then(response => {
                setLikedBy(response.data);
                setModalForLikedBy(true)
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    if( gotQuestion == false && gotAnswers == false ){
        return ( 
            <section className="classForLoader" {...containerProps}>
                {indicatorEl}
            </section>
        )
    }
    else{

    return (
        
        <>
     
        <div className="container col-xs-12 topQAnsList">
            {
            question.map(question => (
                <div key={question.id}>

                <div className="topQuesAnsPageAnswer">{question.question}
                <p style={{float: 'right', color: 'cornflowerblue'}}>-{question.fullName} ({question.Class} - {question.branch})</p>
                </div>

                <div className="questionTagAndOptionDiv">
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


                </div>
            ))
            }
                
                <hr className="hrBelowAns"/>

                <p style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Answers: </p>
              
                {answers.length > 0 && (
                <>
                {
                answers
                .slice((currentPage - 1) * pagePostsLimit, currentPage * pagePostsLimit)
                .map(answer =>
                // ( 

                <div className="tileForAnswers">
                    
                    <div className="answeredByName">
                    <span className="answeredBy">{answer.fullName}</span>
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


                <div key={answer.id}>
                <div className="answerOnTopQAns">
                    <span className="answer" dangerouslySetInnerHTML={{ __html: answer.answer }} />
                        
                </div>
                {answer.tagsForAnswer && (
                <>
                    <p className="tagClassPTag ">
                    {answer.tagsForAnswer.map(tag => (
                        <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                    ))} 
                    </p>
                </>
                )}
                
                
            
                <div>
                    {
                        answer.liked === true && (
                        <>
                            <BiLike className="likeIcon liked" onClick={() => removeLike(answer._id)} />
                            <span className="vote_count" onClick={() => getLikedByList(answer._id)}  > {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                            
                        </>
                        )
                    }
                    {
                        answer.liked === false && (
                        <>
                            <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id, answer.answeredById)} />
                            <span className="vote_count" onClick={() => getLikedByList(answer._id)} > {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                        </>
                        )
                    }
                    {
                        loggedIn === false && (
                        <>
                            <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id)} />
                            <span className="vote_count" onClick={() => getLikedByList(answer._id)} > {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
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
                            <span>&nbsp;&nbsp;</span>
                        </>
                        )
                    }
                    
               
                    <BiCommentDetail className="commentIcon" onClick={() => getComments(answer._id, answer.answeredById, answer.answer)} />
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
                    // header={answerForComment}
                    header={<p dangerouslySetInnerHTML={{ __html: answerForComment }} />}
                    
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
                                          style={{ height: 20, width: 20 }}
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

                            

                            {/* <hr /> */}
                            </>
                          ))}

                        {comments.length == 0 && (
                          <>
                          <p>No comments yet...</p>
                          </>
                        )}
                        
                        </div>


                </PureModal>


                {/* Modal for liked by */}
                <PureModal
                    header={"Liked by"}
                    width={"500px"}
                    scrollable={true}
                  

                onClose={() => {
                    setModalForLikedBy(false);
                    return true;
                }}
                closeButton={<AiFillCloseCircle style={{fontSize: '2rem'}} />}
                closeButtonPosition="header"

                  isOpen={modalForLikedBy}
                >
                  
                <div>
                    {likedBy.length == 0 && (
                        <p>No likes yet..</p>
                    )}
                    {likedBy.map(name => (
                        <>
                            <span className="answeredBy">{name.fullName}</span>
                            <span className="answeredBy"  style={{ marginLeft: '10px'}}>({name.Class} - {name.branch})
                            {
                                name.isAdmin === true && (
                                    <>
                                        &nbsp;
                                        <MdVerified className="verifiedIcon" />
                                    </>
                                )
                            }
                            {
                                name.isAdmin === false && name.isCollegeId === true && (
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
                            <hr />
                        </>
                    ))}
                </div>


                </PureModal>
        
                </div>

                </div>
                // )
                )}
                <Pagination
                    initialPage={currentPage}
                    itemsPerPage={pagePostsLimit}
                    onPageСhange={(pageNumber) => setCurrentPage(pageNumber)}
                    totalItems={answers.length}
                    pageNeighbours={1}
                    withProgressBar={true}
                />
                </>
                )}
                <br />
                
                <form onSubmit={giveAnswer}>
                    <div class="form-group">
                    
                        <label for="exampleFormControlTextarea1">Post an answer to this question, it will help this community grow!</label>
                        {/* <textarea onChange={(e) => setAnswer(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="2"
                        placeholder="Answer here..." ></textarea> */}

                        <CKEditor
                            editor={ ClassicEditor }
                            config={{
                                removePlugins: ["EasyImage","ImageUpload","MediaEmbed"]
                            }}
                            data="<p>Write answer here..</p>"
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setAnswer(data)
                            } }

                        />
                        
                        <Tags 
                            tagifyRef={tagifyRef1}
                            settings={settings}
                            {...tagifyProps}
                            onChange={onChange} />
                    </div>
                    <br />

                    {posting === false && (
                        <button type="submit" className="btn btn-secondary">Post</button>
                    )}
                    
                    {posting === true && (
                    <button className="btn btn-secondary" variant="secondary" disabled>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        &nbsp;Posting...
                    </button>
                    )}
                    
                    
                </form>
        </div>  

        <br />

        <ToastContainer /> 
        </>
        )
    }
    
}

export default TopQAns
