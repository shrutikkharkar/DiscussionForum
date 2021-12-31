import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import './AdminPanel.css'

function AdminPanel() {
    return (
    <div className="container">
        <div className="row firstRow">
            <Link to = "/allAnswers" className="col-md-4 optionButtons answersBtn">Answers</Link>
            <Link to = "/allComments" className="col-md-4 optionButtons commentsBtn">Comments</Link>
            <Link to = "/allQuestions" className="col-md-4 optionButtons questionsBtn">Questions</Link>
        </div>
        {/* <br /> */}
        <div className="row">
            <Link to = "/allFlags" className="col-md-4 optionButtons flagsBtn">Flags</Link>
            <Link to = "/allUsers" className="col-md-4 optionButtons usersBtn">Users</Link>
        </div>
    </div>
    )
}

export default AdminPanel
