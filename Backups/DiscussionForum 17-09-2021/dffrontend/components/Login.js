import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from "axios";
import Navbar from './Navbar'
import UserIconAndActions from './UserIconAndActions';
import './Login.css'

class Login extends Component {

    constructor(props) {
        super()
        this.state = {
            email: '',
            password: ''
        }
        this.changeEmail = this.changeEmail.bind(this)
        this.changePassword = this.changePassword.bind(this)

        this.onSubmit = this.onSubmit.bind(this)
    }

    changeEmail(event) {
        this.setState({ email: event.target.value })
    }
    changePassword(event) {
        this.setState({ password: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault() // prevent default stops page from refreshing on submit
 
        const logined = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post('http://localhost:3001/users/login', logined)
        .then(response => {
            if(response.data.isSuccessful == false){
                window.alert(response.data.message)
            }
            else {

                // const setAuthToken = token => {
                //     if (token) {
                //       // Apply authorization token to every request if logged in
                //       axios.defaults.headers.common["Authorization"] = token;
                //     } else {
                //       // Delete auth header
                //       delete axios.defaults.headers.common["Authorization"];
                //     }
                //   };

                console.log(response.data.token)
                window.alert(response.data.message)
                window.location.href = "/";
                //<Navbar logined = {true} />
                <UserIconAndActions logined = {true} />

            }
        })

    }

    render() {
        return (
            <>
            <Navbar />
            <div className="container loginContainer">
                
                <hr />
                <h3>Login</h3>
                        <form onSubmit={this.onSubmit}>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input onChange={this.changeEmail} value={this.state.email} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                {/* <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> */}
                            </div>
                            <br />
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input onChange={this.changePassword} value={this.state.password} type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            {/* <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                                <label class="form-check-label" for="exampleCheck1">Remember me</label>
                            </div> */}
                            <br />
                            <button type="submit" class="btn btn-primary">Login</button>
                        </form>
                        <br />
                        <Link to="/signup" style={{textDecoration: "none"}}>New User? Signup </Link>
                    
            </div>
                
           </> 
        )
    }
}

export default Login
