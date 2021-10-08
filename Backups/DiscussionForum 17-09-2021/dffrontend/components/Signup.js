import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Navbar from './Navbar'
import  { Redirect, useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom'


class Signup extends Component {
    
    constructor(props) {
        super()
        this.state = {
            fullName: '',
            userName: '',
            email: '',
            class: '',
            branch: '',
            password: '',
            confirmPassword: ''
        }
        this.changeFullName = this.changeFullName.bind(this)
        this.changeUserName = this.changeUserName.bind(this)
        this.changeEmail = this.changeEmail.bind(this)
        this.changeClass = this.changeClass.bind(this)
        this.changeBranch = this.changeBranch.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.changeConfirmPassword = this.changeConfirmPassword.bind(this)

        this.onSubmit = this.onSubmit.bind(this)
    }

    changeFullName(event) {
        this.setState({ fullName: event.target.value })
    }

    changeUserName(event) {
        this.setState({ userName: event.target.value })
    }

    changeEmail(event) {
        this.setState({ email: event.target.value })
    }

    changeClass(event) {
        this.setState({ class: event.target.value })
    }

    changeBranch(event) {
        this.setState({ branch: event.target.value })
    }

    changePassword(event) {
        this.setState({ password: event.target.value })
    }

    changeConfirmPassword(event) {
        this.setState({ confirmPassword: event.target.value })
    }

    onSubmit(event) {
        event.preventDefault() // prevent default stops page from refreshing on submit
        
        const registered = {
            fullName: this.state.fullName,
            userName: this.state.userName,
            email: this.state.email,
            class: this.state.class,
            branch: this.state.branch,
            password: this.state.password
        } // registered will be sent to backend
        if(this.state.password == this.state.confirmPassword)
        {
            axios.post('http://localhost:3001/users/signup', registered)
            .then(response => {
            console.log(response.data)
            window.alert(response.data.message)
            window.location.href = '/login'
        })

        .catch(err => {
            window.alert("Please provide correct credentials")
        })
        }

        else{
            window.alert("Different passwords")
        }

    }
    render() {
        return (
            <div>
                <Navbar />
                <div className="container signupContainer">
                    <br />
                    <h3>Signup</h3>

                    <form onSubmit={this.onSubmit}>
                        <div className='row'>

                            <div className='col-md-6'>

                            <div className="form-group">
                            <label for="exampleInputEmail1">Full Name</label>
                            <input onChange={this.changeFullName} value={this.state.fullName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Full name" />
                        </div>
                        <br />
                        <div className="form-group">
                            <label for="exampleInputEmail1">Username</label>
                            <input onChange={this.changeUserName} value={this.state.userName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" />
                            <small id="emailHelp" className="form-text text-muted">Following username will be displayed to public.</small>
                        </div>
                        <br />
                        <div className="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input onChange={this.changeEmail} value={this.state.email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <br />

                            </div>


                            <div className='col-md-6'>

                            <div className="form-row align-items-center">
                            <div className="col-auto my-2">
                              <label className="mr-sm-3" for="inlineFormCustomSelect">Class:</label>
                              <select value={this.state.class} onChange={this.changeClass} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                <option selected>Choose...</option>
                                <option value="FE">FE</option>
                                <option value="SE">SE</option>
                                <option value="TE">TE</option>
                                <option value="BE">BE</option>
                                <option value="Alumni">Alumni</option>
                              </select>
                            </div>
                        </div>
                        <br /> 
                        <div className="form-row align-items-center"> 
                            <div className="col-auto my-2">
                              <label className="mr-sm-3" for="inlineFormCustomSelect">Branch : </label>
                              <select value={this.state.branch} onChange={this.changeBranch} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                <option selected>Choose...</option>
                                <option value="Comps">Comps</option>
                                <option value="IT">INFT</option>
                                <option value="Mech">Mech</option>
                                <option value="Instru">Instrumentation</option>
                                <option value="Civil">Civil</option>
                                <option value="Extc">Extc</option>
                                <option value="AI/DS">AI/DS</option>
                                <option value="DS">DS</option>
                              </select>
                            </div>
                        </div>
                        <br />
                        <div className="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input onChange={this.changePassword} value={this.state.password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" />
                        </div>
                        <br />
                         
                        <div className="form-group">
                            <label for="exampleInputPassword1">Confirm Password</label>
                            <input onChange={this.changeConfirmPassword} value={this.state.confirmPassword} type="password" className="form-control" id="confirmPassword" placeholder="Re-enter the Password" />
                        </div>
                        <br />
                                
                            </div>

                        </div>





                       
                        
                        
                        {/*
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" for="exampleCheck1">Remember me</label>
                        </div>
                        <br /> */}
                        <button type="submit" className="btn btn-primary">Register</button>
                        <span>    </span>
                        <Link to="/login" style={{textDecoration: "none"}}>Login</Link>
                    </form>
                  
                   
                </div>
                
            </div>   
        )
    }
}

export default Signup
