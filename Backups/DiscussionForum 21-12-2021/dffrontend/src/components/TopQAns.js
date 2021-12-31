import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import Modal from 'react-bootstrap/Modal';
import CommentBox from './CommentBox'
import {Link, useHistory} from 'react-router-dom'
import CKEditorArea from "./CKEditor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TopQAns() {

    const {loggedIn} = useContext(AuthContext);
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
                    // console.log(response.data)
                    setAnswers(response.data);
                })
            }
            else{
                await axios.get(`http://localhost:3001/answer/get/${questionID}`)
                .then(response => {
                    //console.log(response.data)
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
            alert("Login or Register first")
            console.error(err);
        }
    }


    async function writeComment(e) {
        e.preventDefault()

        try {
            const commentData = {comment};
            
            await axios.post(`http://localhost:3001/comment/addComment/${answerIdForComment}`, commentData)
            .then(res => {
                setShow(false);
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
                toast.dark('Liked answer!', {
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
            alert("Login or Register first")
            console.error(err);
        }
    }

    async function dislikeAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/dislike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.dark('Disliked answer!', {
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
            alert("Login or Register first")
            console.error(err);
        }
    }

    async function saveAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/save/${answerId}`)
            .then(res => {
                //alert(res.data)
                toast.dark('Saved successfully!', {
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
                        <span className="answeredBy"  style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})</span>
                
                        <span className="answeredBy">by. {answer.userName}</span>

                    </div>

                    <div>
                        
                        <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id)} />
                        <span className="vote_count"> {answer.likeCount}</span>

                        &nbsp; &nbsp; &nbsp; &nbsp;

                        <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(answer._id)} />
                        <span className="vote_count"> {answer.dislikeCount}</span>

                        &nbsp; &nbsp; &nbsp; &nbsp;
                     
                        <BiCommentDetail className="commentIcon" onClick={() => getComments(answer._id)} />
                        <span className="comment_count"> {answer.commentCount}</span>



                        <span>
                            <HiDotsHorizontal />
                            <BiBookmark onClick={() => saveAnswer(answer._id)} className="bookmark" />
                            {/* <i onClick={() => saveAnswer(answer._id)} className="far bookmark bookmark-onclick fa-bookmark"></i> */}
                        </span>

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
                    {/* <CKEditorArea
                      label={"this.state.Form.discriptionLong.label"}
                      rows={2}
                      cols={3}
                      placeholder={"Placeholder"}
                      changed={(event, editor) =>
                        this.CKEditorHandler(event, editor, "discriptionLong")
                      }
                    /> */}
                    
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
