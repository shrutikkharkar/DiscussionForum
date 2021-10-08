import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import './QuestionList.css'

function QuestionList() {

const history = useHistory();

const [questions, setQuestions] = useState([]); 
useEffect(() => {
    questionList()
});

function questionList() {
    try 
    {
        axios.get('http://localhost:3001/question/get/')
        .then(response => {
            setQuestions(response.data);
            //setQuestions({ ...response.data, id:props.id });
            console.log(response.data);
        })
    } 
    catch (err) {
        console.error(err);
    }
}

function gotoAnswers() {
    history.push(`/topqans`);
}

    if(questions){
    return (
        <>
        {
        questions.map(question => 
        (
        <div className="container w-75 questionListContainer">
            <div className="questionBlock">
            <div className="questionBlock" key={question.id}>
                <div className="answerCount">
                    <p>0</p>
                    <p className="countStat">Answers</p>
                </div>
                <div className="viewCount">
                    <p>0</p>
                    <p className="countStat">Views</p>
                </div>
                <div className="voteCount">
                    <p>0</p>
                    <p className="countStat">Votes</p>
                </div>
                <a onClick={gotoAnswers} className="questionDiscussion">
                    <p>
                         {question.question}
                    </p>
                </a>
                <span className="updateDate">
                    <p className="updatedOnText">Updated on:</p> 13/08/2021
                </span>
                <hr />
            </div>
            
            </div>            
        </div>
        )

        )}
        

        </>
    );
    }
    return <h1>Its not there</h1>; 

}

export default QuestionList




/*
import React, { Component } from 'react'
import axios from 'axios'
import './QuestionList.css'

const QuestionTemplate = props => (
    <div className="questionBlock">
        <div className="answerCount">
            <p>{props.questions.answerCount}</p>
            <p className="countStat">Answers</p>
        </div>
        <div className="viewCount">
            <p>{props.questions.viewCount}</p>
            <p className="countStat">Views</p>
        </div>
        <div className="voteCount">
            <p>{props.questions.voteCount}</p>
            <p className="countStat">Votes</p>
        </div>
        <a href={`/topqans/?query=${props.questions._id}`} className="questionDiscussion">
            <p>
                 {props.questions.question}
            </p>
        </a>
        <span className="updateDate">
            <p className="updatedOnText">Updated on:</p> 13/08/2021
        </span>
        <hr />
</div>                
)


class QuestionList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            questions:[]
            
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3001/question/get/')
            .then(response => {
                this.setState({ questions: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
            })

    }

    questionList(){
        return this.state.questions.map(function(currentQuestion, i)
        {
            return <QuestionTemplate questions={currentQuestion} key={i} />;
        })
    }
 
    render() {
        return (
            <>
            <div className="container w-75 questionListContainer">
                
                {this.questionList()}  
                 
            </div>
            </>
        )
    }
}

export default QuestionList
*/