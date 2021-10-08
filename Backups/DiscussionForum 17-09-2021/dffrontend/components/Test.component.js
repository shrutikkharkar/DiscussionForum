
import React, { Component } from 'react';
import axios from 'axios';

const Todo = props => (
    <tr>
        <td>{props.todo.todo_description}</td>
        <td>{props.todo.todo_responsible}</td>
        <td>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
        </td>
    </tr>
)

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = {todos: []};
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }

    todoList() {
        return this.state.todos.map(function(currentTodo, i){
            return <Todo todo={currentTodo} key={i} />;
        })
    }

    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}
























/*




import React, { Component } from 'react'
import axios from 'axios'

class Test extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             fullName: ''
        }
        this.changeFullName = this.changeFullName.bind(this)
    }
    
    changeFullName(event){
        this.setState({ fullName: event.target.value })
    }
    onSubmit(event){
        event.preventDefault()
        const registered = {
            fullName: this.state.fullName
        }

        axios.post('http://localhost:3001/app/signup', registered)
        .then((response) => {
            console.log(response.data)
        })
        
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input value={this.state.fullName} onChange={this.changeFullName} type="text" />
                    <button type="submit" >Submit</button>
                </form>
            </div>
        )
    }
}

export default Test





import React, { Component } from 'react'
import axios from "axios";

class Test extends Component {

    constructor() {
        super()
    
        this.state = {
            fullName: ''
        }
        this.changeFullName = this.changeFullName.bind(this)
    }

    changeFullName(event) {
        this.setState({ fullName: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault()
        const registered = {
            fullName: this.state.fullName
        }

        axios.post('http://localhost:3001/app/signup', registered)
        .then(response => {
            console.log(response.data)
        })

    }
    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div>
                        <label>Full Name</label>
                        <input onChange={this.changeFullName} value={this.state.fullName} type="text" />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        )
    }
}

export default Test


*/