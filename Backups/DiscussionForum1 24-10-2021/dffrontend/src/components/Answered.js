import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './TopQAns.css'

function Answered() {

const [answers, setAnswers] = useState([]); 
useEffect(() => {
    answerList()
}, []);

function answerList() {
    try 
    {
        axios.get('http://localhost:3001/answer/getAnswered/')
        .then(response => {
            setAnswers(response.data);
        })
    } 
    catch (err) {
        console.error(err);
    }
}

function deleteAns(answerId) {
    try {
        axios .post(`http://localhost:3001/answer/deleteAnswer/${answerId}`)
        .then(response => {
            window.alert(response.data)
            answerList()
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
                

                <span className="answeredBy">
                    by. You
                </span>
            </div>
            
            <div>
                <i className="far fa-thumbs-up"></i>
                <span className="vote_count"> {answer.likeCount}</span>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <i className="far fa-thumbs-down"></i>
                <span className="vote_count"> {answer.dislikeCount}</span>

                
                <span>
                    
                    <i className="fas bookmark bookmark-onclick fa-bookmark inSaved"></i>
                    <button type="button" class="btn btn-danger" onClick={() => deleteAns(answer._id)} 
                    style={{float: 'right', marginRight: '2rem', marginTop: '0.5rem'}}>Delete</button>
                </span>

            </div>
            
            
            <hr />
            </div>
            </div>
          )  
        )}
        </>
    
    )}
    else{
        <h1>Nothing saved yet</h1>
    }
}

export default Answered
