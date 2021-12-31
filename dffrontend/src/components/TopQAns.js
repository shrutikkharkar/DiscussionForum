import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { MdBlock, MdReportProblem, MdVerified } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import Modal from 'react-bootstrap/Modal';
import {Link, useHistory} from 'react-router-dom'
import CKEditorArea from "./CKEditor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function TopQAns() {

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    const history = useHistory();
    const queryParams = new URLSearchParams(window.location.search);

    const [answer, setAnswer] = useState('')
    const [comment, setComment] = useState('')
    const [answerIdForComment, setAnswerIdForComment] = useState('')
    const [answers, setAnswers] = useState([])
    const questionID = queryParams.get('query')
    const [question, setQuestion] = useState([])
    const [comments, setComments] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        getQuestion()
        getAnswers()
    }, []);


    async function getQuestion() {
        try 
        {
            await axios.get(`http://localhost:3001/question/get/${questionID}`)
            .then(response => {
                // console.log(response.data)
                setQuestion(response.data);
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
            const answerData = {questionID, answer};
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
            })
               

        }
        catch (err) {
            toast.dark(err.response.data, {
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
            const commentData = {comment};
            
            await axios.post(`http://localhost:3001/comment/addComment/${answerIdForComment}`, commentData)
            .then(res => {
                setShow(true);
                getComments() 
            })
               

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }


    async function likeAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/like/${answerId}`)
            .then(res => {
                getAnswers()
                toast.success('Liked successfully!', {
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


    async function getComments(ansId){
        const answerId = ansId
        setAnswerIdForComment(answerId)
        if(show == true){
            setShow(false); 
        }
        if(show == false){
            setShow(true); 
        }
        
        try 
        { 
            await axios.get(`http://localhost:3001/comment/getComments/${answerId}`)
            .then(response => {
                setComments(response.data);
                console.log(response.data);
            })
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
                                <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id)} />
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
                   
                        <BiCommentDetail className="commentIcon" onClick={() => getComments(answer._id)} />
                        <span className="comment_count"> {answer.commentCount}</span>
 
                        &nbsp; &nbsp; &nbsp; &nbsp;



                        {loggedIn===true && isAdmin===true && (
                            <>
                                {/* Remove answer button here */}
                                <MdBlock onClick={() => removeAnswerByAdmin(answer._id)} />
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
                              Answer will be here
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>

                            <div>
                              {comments.map(comment => (
                                <>
                                <span style={{color:"dodgerblue"}}>{comment.userName} ({comment.Class} - {comment.branch})</span>
                                &nbsp;&nbsp;
                                <span key={comment.id}>
                                  {comment.comment}
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
