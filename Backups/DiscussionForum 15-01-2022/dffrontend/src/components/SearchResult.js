import React, { Component } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SearchResult extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
            question: ''
        }
        this.changeQuestion = this.changeQuestion.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    



    changeQuestion(event) {
        this.setState({question: event.target.value})
    }

    onSubmit(event){
        event.preventDefault()
        try{

        const questioned = {
            question: this.state.question
        }

        axios.post('http://localhost:3001/question/post', questioned)
        .then(response => {
            toast.success('Question submitted successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            window.location.href = '/'
        })
        }
        catch (err) {
            alert("Login or register first")
            console.error(err);
        }
    }

    render() {
        return (
            <div>
                <div className="container w-75">
                <form onSubmit={this.onSubmit}>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Didn't find answer to your question? Post your question here!</label>
                        <textarea onChange={this.changeQuestion} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>

                    <br />
                    <button type="submit" className="btn btn-secondary">Post</button>
                </form>
                </div>
                <ToastContainer />
            </div>
        )
    }
}

export default SearchResult
