import React, { Component } from 'react'
import QuestionList from './QuestionList'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Home extends Component {
    render() {
        return (
            <div>
                <QuestionList />
                <ToastContainer />
            </div>
        )
    }
}

export default Home
