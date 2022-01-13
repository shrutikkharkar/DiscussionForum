import React, {useState, useEffect, useContext, useRef} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { MdBlock, MdReportProblem, MdVerified, MdRemoveCircle } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import {Link, useHistory} from 'react-router-dom'
import CKEditorArea from "./CKEditor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [show, setShow] = useState(false);

    // For block btn
    const [showPop, setShowPop] = useState(false);
    const target = useRef(null);

    

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

    async function getQuestion() {
        try 
        {
            await axios.get(`http://localhost:3001/question/get/${questionID}`)
            .then(response => {
                // console.log(response.data)
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

            const answerData = {questionID, answer, questionById};
            
            await axios.post('http://localhost:3001/answer/post', answerData)
            .then(res => {

                toast.success('Answer submitted successfully!', {
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


    async function getComments(ansId, answeredById){
        const answerId = ansId
        setAnswerIdForComment(answerId)
        setAnswerByIdForNotification(answeredById)
        // if(show == true){
        //     setShow(false); 
        // }
        // if(show == false){
        //     setShow(true); 
        // }

        setShow(true);
        
        try 
        { 
            if(loggedIn===true){
                await axios.get(`http://localhost:3001/comment/getCommentsForUser/${answerId}`)
                .then(response => {
                    setComments(response.data);
                    console.log(response.data);
                })
            }
            else{
                await axios.get(`http://localhost:3001/comment/getComments/${answerId}`)
                .then(response => {
                    setComments(response.data);
                })
            }
        } 
        catch (err) {
            console.error(err);
        }     
    }




    return (
        <>


            <div className="container topQAnsList w-75">
                {
                question.map(question => (
                    <div key={question.id}>
                    <p className="topQuesAnsPageAnswer">{question.question}<p style={{float: 'right', color: 'cornflowerblue'}}>-{question.userName}</p></p>
                    
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
                    <div>
                        <span className="answer">{answer.answer}</span>
                        
                        <span className="answeredBy"  style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})
                        
                        {
                            answer.isAdmin === true && (
                                <>
                                    &nbsp;
                                    <MdVerified className="verifiedIcon" />
                                </>
                            )
                        }
                        </span>
                
                        <span className="answeredBy">by. {answer.userName}</span>
                        
                        
                        

                    </div>


                    <div>
                        {
                            answer.liked === true && (
                            <>
                                <BiLike className="likeIcon liked" onClick={() => removeLike(answer._id)} />
                                <span className="vote_count"> {answer.likeCount}</span>
                            </>
                            )
                        }

                        {
                            answer.liked === false && (
                            <>
                                <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id, answer.answeredById)} />
                                <span className="vote_count"> {answer.likeCount}</span>
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

                        &nbsp; &nbsp; &nbsp; &nbsp;

                        {
                            answer.disliked === true && (
                                <>
                                    <BiDislike className="dislikeIcon disliked" onClick={() => removeDislike(answer._id)} />
                                    <span className="vote_count"> {answer.dislikeCount}</span>
                                </>
                            )
                        }

                        {
                            answer.disliked === false && (
                                <>
                                    <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(answer._id)} />
                                    <span className="vote_count"> {answer.dislikeCount}</span>
                                </>
                            )
                        } 

                        {
                            loggedIn === false && (
                            <>
                                <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(answer._id)} />
                                <span className="vote_count"> {answer.dislikeCount}</span>
                            </>
                            )
                        }

                        &nbsp; &nbsp; &nbsp; &nbsp;
                   
                        <BiCommentDetail className="commentIcon" onClick={() => getComments(answer._id, answer.answeredById)} />
                        <span className="comment_count"> {answer.commentCount}</span>
 
                        &nbsp; &nbsp; &nbsp; &nbsp;



                        {loggedIn===true && isAdmin===true && (
                            <>
                                {/* Remove answer button here */}
                                <MdBlock onClick={() => removeAnswerByAdmin(answer._id)} />

                                {/* <HiDotsVertical ref={target} onClick={() => setShowPop(!showPop)} /> */}
                                
                                {/* <Button ref={target} onClick={() => setShowPop(!showPop)}>
                                  Click me!
                                </Button>

                                <Overlay target={target.current} show={showPop} placement="top">
                                  {(props) => (
                                    <Tooltip id="overlay-example" {...props}>
                                      My Tooltip
                                    </Tooltip>
                                  )}
                                </Overlay> */}
                            </>
                        )}

                        {loggedIn===true && isAdmin===false && (
                            <>
                                {/* Report answer button here */}
                                <MdReportProblem onClick={() => reportAnswerByUser(answer._id)} />
                            </>
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


                    {show===true && (
                        // <p>
                        //     {comments.map(comment => (
                        //         <p>{comment.comment}</p>
                        //     ))}
                        // </p>

                        <Modal
                          show={show}
                          size="lg"
                          onHide={() => setShow(false)}
                          dialogClassName="modal-90w"
                          centered
                          aria-labelledby="contained-modal-title-vcenter"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">
                            {comments.map(comment => (
                                <>
                                    {comment.answer[0]}
                                </>
                            ))}
                              
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>

                            <div>
                              {comments.map(comment => (
                                <>
                                <span style={{color:"dodgerblue"}}>{comment.userName} ({comment.Class} - {comment.branch})</span>
                                {
                                    comment.isAdmin === true && (
                                    <>
                                        &nbsp;
                                        <MdVerified className="verifiedIcon" />
                                    </>
                                    )
                                }
                                &nbsp;&nbsp;
                                <span key={comment.id}>
                                  {comment.comment}
                                  {comment.commentedByMe == true && (
                                      <MdRemoveCircle className="deleteCommentIcon" onClick={() => deleteComment(comment._id)} />
                                  )}
                                </span>
                                <hr />
                                </>
                              ))}
                            
                            <form onSubmit={writeComment}>
                                <div className="form-group" >
                                    <input type="text" onChange={(e) => setComment(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="1"
                                    placeholder="Write a comment..."></input>
                                    <br />
                                    <button type="submit" className="btn btn-secondary">Post</button>
                                </div>
                                
                                
                            </form>
                            </div>
                            
                          </Modal.Body>
                        </Modal>

                    )}
            



                    <hr />
                    </div>

                    
                    ))}
                    <br />
                    
                    <form onSubmit={giveAnswer}>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Post an answer to this question, it will help this community grow!</label>
                            <textarea onChange={(e) => setAnswer(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                        <br />
                        <button type="submit" className="btn btn-secondary">Post</button>
                    </form>

            </div>  

            <ToastContainer />      
            
        </>
    )
}

export default TopQAns
