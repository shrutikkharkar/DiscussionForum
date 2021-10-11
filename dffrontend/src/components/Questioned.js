import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import './TopQAns.css'

function Questioned() {

    const history = useHistory();

    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        questionList()
    }, []);

    function questionList() {
        try {
            axios.get('http://localhost:3001/question/questioned')
            .then(response => {
                setQuestions(response.data);
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    function deleteQues(quesId) {
        try {
            axios.post(`http://localhost:3001/question/deleteQuestion/${quesId}`)
            .then(response => {
                //window.alert(response.data)
                questionList()
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


    return (
        <>
        <div className="container w-75 questionListContainer">
        <p style={{fontSize: "1.5rem", fontFamily: "cursive", color: "cadetblue"}}>My Questions.</p>
        
        
        {
            questions.map(question => (
              
            
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
                <a onClick={() => gotoAnswers(question._id)} className="questionDiscussion">
                    <p>
                         {question.question}
                    </p>

                </a>
                <button type="button" className="btn btn-danger" onClick={() => deleteQues(question._id)} 
                            style={{marginRight: "-65rem",
                                marginTop: "-9rem"}}>Delete</button>
                <hr />   
            </div>
            
               
     
                
            )
            )
        }
          </div>  
        </>
    )
}

export default Questioned
