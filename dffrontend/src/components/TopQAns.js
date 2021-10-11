import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './TopQAns.css'

function TopQAns() {

    const queryParams = new URLSearchParams(window.location.search);

    const [answer, setAnswer] = useState('')
    const [answers, setAnswers] = useState([])
    const questionID = queryParams.get('query')
    const [question, setQuestion] = useState([])

    useEffect(() => {
            getQuestion()
            getAnswers()
    }, []);


    async function getQuestion() {
        try 
        {
            
            await axios.get(`http://localhost:3001/question/get/${questionID}`)
            .then(response => {
                console.log(response.data)
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
            await axios.get(`http://localhost:3001/answer/get/${questionID}`)
            .then(response => {
                setAnswers(response.data);
            })
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
                alert("Answer submitted successfully")
                getAnswers()  
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
                //alert(res.data)
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
                //alert(res.data)
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
                alert(res.data)
            })

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }



    return (
        <>
            <div className="container w-75">
                    <p className="topQuesAnsPageAnswer">{question.question}</p>
                    <p>{question.userName}</p>
                    <hr className="hrBelowAns"/>
                    <p style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Answers: </p>
                    <form onSubmit={giveAnswer}>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Post an answer to this question, it will help this community grow!</label>
                            <textarea onChange={(e) => setAnswer(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                        <br />
                        <button type="submit" className="btn btn-secondary">Post</button>
                    </form>
                    <br />
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
                        <i onClick={() => likeAnswer(answer._id)} className="far fa-thumbs-up"></i>
                        {/* <button onClick={() => likeAnswer(answer._id)} >Like</button> */}
                        <span className="vote_count"> {answer.likeCount}</span>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <i onClick={() => dislikeAnswer(answer._id)} className="far fa-thumbs-down"></i>
                        <span className="vote_count"> {answer.dislikeCount}</span>

                        <span>
                            <i onClick={() => saveAnswer(answer._id)} className="far bookmark bookmark-onclick fa-bookmark"></i>
                        </span>

                    </div>


                    <hr />
                    </div>

                    
                    ))}

            </div>        
            
        </>
    )
}

export default TopQAns
