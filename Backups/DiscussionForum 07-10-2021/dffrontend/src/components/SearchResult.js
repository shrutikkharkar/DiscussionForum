import React, { Component } from 'react'
import axios from 'axios'

class SearchResult extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
            // questionById: '6110da0de372a240cc6b2224',
            question: '',
            answersCount: 0,
            viewCount: 0,
            votesCount: 0
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
            // questionById: this.state.questionById,
            question: this.state.question,
            answersCount: this.state.answersCount,
            viewCount: this.state.viewCount,
            votesCount: this.state.votesCount
        }

        axios.post('http://localhost:3001/question/post', questioned)
        .then(response => {
            //console.log(response.data)
            window.alert(response.data.message)
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
            </div>
        )
    }
}

export default SearchResult
