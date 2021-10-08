import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './TopQAns.css'

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

    if(answers){
    return (
        <>
        {
        answers.map(answer => 
          (
            <div className="container w-75">
            <div key={answer.id}>
            <p>
                {answer.answer_details[0].question}
            </p>
            <div>
                <span className="answer">{answer.answer}</span>

                {/* <span>
            
                    <p className="answeredBy" style={{ marginLeft: '10px'}}>({props.answers.user_details[0].Class} - {props.answers.user_details[0].branch})</p>

                    <p className="answeredBy">by. {props.answers.user_details[0].userName}</p>
                </span> */}
            </div>
            
            <div>
                <i className="fas fa-thumbs-up"></i>
                <span className="vote_count">10</span>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <i className="far fa-thumbs-down"></i>
                <span className="vote_count">1</span>

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
    else{
        <h1>Nothing Liked yet</h1>
    }
}

export default Liked
