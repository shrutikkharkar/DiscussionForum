import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import './QuestionList.css'

function QuestionList() {

const history = useHistory();

const [questions, setQuestions] = useState([]); 
useEffect(() => {
    questionList()
}, []);

async function questionList() {
    try 
    {
        await axios.get('http://localhost:3001/question/get/')
        .then(response => {
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
        await axios.post(`http://localhost:3001/question/addView/${questionId}`)
    }
    catch (err) {
        console.error(err);
    }
}

    if(questions){
    return (
        <>
        {
        questions.map(question => 
        (
        <div className="container w-75 questionListContainer">
            
            <div className="questionBlock" key={question.id}>
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
                <a onClick={(e) => gotoAnswers(question._id)} className="questionDiscussion">
                    <p>
                         {question.question}
                    </p>
                </a>

                <div className="updateDate">
                    <p>Updated on: </p>
                    <p>13/08/2021</p> 
                </div>

                {/* <p className="updateDate"></p> */}
                     
                
                {/* <hr /> */}
            </div>
            
            <hr />      
        </div>  
        )

        )}
        
        
        </>
    );
    }
    return <h1>Its not there</h1>; 

}

export default QuestionList
