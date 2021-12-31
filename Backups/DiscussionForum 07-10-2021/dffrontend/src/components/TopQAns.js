import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'

function TopQAns() {

    const queryParams = new URLSearchParams(window.location.search);

    const {loggedIn} = useContext(AuthContext);

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
            if(loggedIn===true){
                await axios.get(`http://localhost:3001/answer/getForUser/${questionID}`)
                .then(response => {
                    setAnswers(response.data);
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
            alert("Answer submitted successfully")
            getAnswers()     

        }
        catch (err) {
            alert("there was error")
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
            console.error(err);
        }
    }



    return (
        <>
            <div className="container w-75">
                    <p className="topQuesAnsPageAnswer">{question.question}</p>
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

                        <span>

                            <p className="answeredBy" style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})</p>

                            <p className="answeredBy">by. {answer.userName}</p>
                        </span>
                    </div>

                    <div>
                        <i onClick={() => likeAnswer(answer._id)} className="far fa-thumbs-up"></i>
                        {/* <button onClick={() => likeAnswer(answer._id)} >Like</button> */}
                        <span className="vote_count">{answer.likeCount}</span>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <i onClick={() => dislikeAnswer(answer._id)} className="far fa-thumbs-down"></i>
                        <span className="vote_count">{answer.dislikeCount}</span>

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




/*

import React, { Component } from 'react'
import axios from 'axios'
import './TopQAns.css'

const QuestionTemplate = props => (
    <p>
        {props.questions.question}
    </p>
)    
// var bookmarkOnClick = () => {
//     document.getElementsByClassName("bookmark-onclick").className = "fas bookmark fa-bookmark";
// }
const AnswerTemplate = props => (
    <div>
        <div>
            <span className="answer">{props.answers.answer}</span>

            <span>
        
                <p className="answeredBy" style={{ marginLeft: '10px'}}>({props.answers.user_details[0].Class} - {props.answers.user_details[0].branch})</p>
                
                <p className="answeredBy">by. {props.answers.user_details[0].userName}</p>
            </span>
        </div>
        
        <div>
            <i className="far fa-thumbs-up"></i>
            <span className="vote_count">10</span>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <i className="far fa-thumbs-down"></i>
            <span className="vote_count">1</span>

            <span>
                <i className="far bookmark bookmark-onclick fa-bookmark"></i>
            </span>

        </div>
        
        
        <hr />
    </div>
    
)

const queryParams = new URLSearchParams(window.location.search);
class SearchResult extends Component {

    constructor (props) {
        super(props)

        this.state = {
            questions: [],
            answers: [],
            id: queryParams.get('query'),
            //id: null,
            answer: '',
        }
        this.changeAnswer = this.changeAnswer.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount() {
    

        axios.get(`http://localhost:3001/question/get/${this.state.id}`)
            .then(response => {
                this.setState({ questions: response.data });
            })
            .catch(function (error){
                console.log(error);
        })
        

        axios.get(`http://localhost:3001/answer/get/${this.state.id}`)
        .then(response => {
                this.setState({ answers: response.data });
                //console.log(response.data);
                //console.log(response.data[0].user_details[0]);
        })
        .catch(function (error){
            console.log(error);
        })

    }


    changeAnswer(event) {
        this.setState({ answer: event.target.value})
    }
    getQuestion(){
        return <QuestionTemplate questions={this.state.questions} />
    }

    toggleBookmark(){
        window.alert('Saved')
    }

    getAnswers(){
        return this.state.answers.map(function(currentAnswer, i){
            return <AnswerTemplate answers={currentAnswer} key={i} />;
        })
    }

    onLike(){

    }

    onSubmit(event) {
        event.preventDefault() // prevent default stops page from refreshing on submit
        try{
            const answered = 
            {
                questionID: this.state.id,
                answer: this.state.answer
            }  

            axios.post('http://localhost:3001/answer/post', answered)
            .then(res => {
            window.alert("Submitted successfully");
            window.location.reload();
            })
        } 
        catch(err){
            window.alert("Error");
            console.error(err);
        }
    }

    render() {
        return (
            <>
                <div className="container w-75">
                    <p className="topQuesAnsPageAnswer">{this.getQuestion()}</p>
                    <hr className="hrBelowAns"/>
                    <p style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Answers: </p>
                    <form onSubmit={this.onSubmit}>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Post an answer to this question, it will help this community grow!</label>
                            <textarea onChange={this.changeAnswer} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                        <br />
                        <button type="submit" className="btn btn-secondary">Post</button>
                    </form>
                    <br />
                    <hr />
                    <p>{this.getAnswers()}</p>
                </div>
            </>
        )
    }
}

export default SearchResult

*/

