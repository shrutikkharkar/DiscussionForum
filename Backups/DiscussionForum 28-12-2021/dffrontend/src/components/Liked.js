import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './TopQAns.css'
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Liked() {

const [answers, setAnswers] = useState([]); 
useEffect(() => {
    answerList()
}, []);

function answerList() {
    try 
    {
        axios.get('http://localhost:3001/answer/getLiked/')
        .then(response => {
            setAnswers(response.data);
        })
    } 
    catch (err) {
        console.error(err);
    }
}


async function likeAnswer(ansId) {

    try {
        const answerId = ansId

        await axios.post(`http://localhost:3001/answer/like/${answerId}`)
        .then(res => {
            answerList()
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
            answerList()
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
            answerList()
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
            answerList()
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
            answerList()
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
            answerList()
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

    if(answers){
    return (
        <>
        {
        answers.map(answer => 
          (
            <div className="container w-75">
            <div key={answer.id}>
            <p>
                {answer.question}
            </p>
            <div>
                <span className="answer">{answer.answer}</span>
                <span className="answeredBy"  style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})</span>
                
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

                        &nbsp; &nbsp; &nbsp; &nbsp;
                   

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
            
            
            <hr />
            </div>
            </div>
          )  
        )}

        <ToastContainer />

        </>
    
    )}
    else{
        return (
        <h1>Nothing Liked yet</h1>
        )
    }
}

export default Liked
