import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './TopQAns.css'

function Saved() {

const [answers, setAnswers] = useState([]); 
useEffect(() => {
    answerList()
}, []);

function answerList() {
    try 
    {
        axios.get('http://localhost:3001/answer/getSaved/')
        .then(response => {
            setAnswers(response.data);
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
                Q. {answer.question}
            </p>
            <div>
                <span className="answer">-{answer.answer}</span>
               
                <span className="answeredBy"  style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})</span>
                
                <span className="answeredBy">by. {answer.userName}</span>

            </div>
            
            <div>
                <i className="far fa-thumbs-up"></i>
                <span className="vote_count"> {answer.likeCount}</span>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <i className="far fa-thumbs-down"></i>
                <span className="vote_count"> {answer.dislikeCount}</span>

                <span>
                    <i className="fas bookmark bookmark-onclick fa-bookmark inSaved"></i>
                </span>

            </div>
            
            
            <hr />
            </div>
            </div>
          )  
        )}
        </>
    
    )}
    else if(answers == []){
        <h1>Nothing saved yet</h1>
    }
    else{
        <h1>Nothing saved yet</h1>
    }
}

export default Saved
