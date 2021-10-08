import React, { Component } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import NavigationFunctions from './NavigationFunctions'
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
    <p>
        <span className="answer">{props.answers.answer}</span>
        <span className="answeredBy">by. {props.answers.user_details[0].userName}</span>
        
        <br />
        <p className="answeredBy">({props.answers.user_details[0].Class} - {props.answers.user_details[0].branch})</p>
        <i className="far fa-thumbs-up"></i>
        <span className="vote_count">10</span>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <i className="far fa-thumbs-down"></i>
        <span className="vote_count">1</span>
        <i className="far bookmark bookmark-onclick fa-bookmark"></i>
        <hr />
    </p>
    
)

const queryParams = new URLSearchParams(window.location.search);
class SearchResult extends Component {

    constructor (props) {
        super(props)

        this.state = {
            questions: [],
            answers: [],
            id: props.Qid,
            //id: queryParams.get('query'),
            answer: '',
        }
        this.changeAnswer = this.changeAnswer.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount() {
        //610fc20e7d32093698c2dff7
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

        // axios.get(`http://localhost:3001/answers/getAnswerer/6107a2aee36f650cbc6c1849`)
        // .then(response => {
        //     this.setState({answeredBy: response.data});
        // })
        // .catch(function (error){
        //     console.log(error);
        // })

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

        const answered = {
            questionID: this.state.id,
            answer: this.state.answer
        }


        axios.post('http://localhost:3001/answer/post', answered)
        .then(res => {
            window.alert(res.errorMessage);
            window.location.reload();

        })
    }

    render() {
        return (
            <>
                {/* <Navbar name="Shrutik Kharkar"/> */}
                {/* <NavigationFunctions /> */}
                <div className="container w-75">
                    <p className="topQuesAnsPageAnswer">{this.getQuestion()}</p>
                    <hr className="hrBelowAns"/>
                    <p style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Answers:</p>
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



