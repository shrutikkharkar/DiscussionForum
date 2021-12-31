import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import './AdminPanel.css'

function AdminPanel() {
    return (
    <div>
        {/* <div className="row">
            <Link to = "/allAnswers" className="optionButtons answersBtn">Answers</Link>
            <Link to = "/allComments" className="optionButtons commentsBtn">Comments</Link>
            <Link to = "/allQuestions" className="optionButtons questionsBtn">Questions</Link>
            <Link to = "/allFlags" className="optionButtons flagsBtn">Flags</Link>
            <Link to = "/allUsers" className="optionButtons usersBtn">Users</Link>
            <Link to = "/allAdmins" className="optionButtons adminsBtn">Admins</Link>
        </div> */}

        <div className="row firstRow">
            <Link to = "/allAnswers" className="col-md-4 optionButtons answersBtn">Answers</Link>
            <Link to = "/allComments" className="col-md-4 optionButtons commentsBtn">Comments</Link>
            <Link to = "/allQuestions" className="col-md-4 optionButtons questionsBtn">Questions</Link>
        </div>
        
        <div className="row">
            <Link to = "/allFlags" className="col-md-4 optionButtons flagsBtn">Flags</Link>
            <Link to = "/allUsers" className="col-md-4 optionButtons usersBtn">Users</Link>
            <Link to = "/allAdmins" className="col-md-4 optionButtons adminsBtn">Admins</Link>
        </div>
    </div>
    )
}

export default AdminPanel
