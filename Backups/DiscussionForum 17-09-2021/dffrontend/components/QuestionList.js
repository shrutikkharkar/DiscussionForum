import React, { Component } from 'react'
import axios from 'axios'
import  {NavLink, Redirect, useHistory, Link } from 'react-router-dom';
import './QuestionList.css'
import NavigationFunctions from './NavigationFunctions';

const QuestionTemplate = props => (
    <div className="questionBlock">
        <div className="answerCount">
            <p>{props.questions.viewCount}</p>
            <p className="countStat">Answers</p>
        </div>
        <div className="viewCount">
            <p>{props.questions.viewCount}</p>
            <p className="countStat">Views</p>
        </div>
        <div className="voteCount">
            <p>{props.questions.votesCount}</p>
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
            questions:[
                {counts: []}
            ]
            
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3001/questions/get/')
            .then(response => {
                this.setState({ questions: response.data });
                console.log(response.data);
            })
            .catch(function (error){
                console.log(error);
        })

        axios.get('http://localhost:3001/answers/getCounts')
        .then(response => {
            this.setState({ questions.counts: response.data });
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
            <NavigationFunctions />
            <div className="container w-75 questionListContainer">
                
                {this.questionList()}  
                 
            </div>
            </>
        )
    }
}

export default QuestionList
