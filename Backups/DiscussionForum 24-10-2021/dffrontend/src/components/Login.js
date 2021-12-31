import React, { Component, useContext, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from "axios";
import './Login.css'
import AuthContext from '../context/AuthContext';


function Login() {
   
    const {getLoggedIn} = useContext(AuthContext);
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function login(e) {
        e.preventDefault();

        try {
            
            const loginData = {
                email, password
            };

            await axios.post('http://localhost:3001/user/login', loginData)
            await getLoggedIn();
            history.push('/');

        } catch (err) {
            console.error(err);
        }


    }
        return (
            <>
            <div className="container loginContainer">
                
                <hr />
                <h3>Login</h3>
                        <form onSubmit={login}>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                            </div>
                            <br />
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                            </div>

                            <br />
                            <button type="submit" class="btn btn-primary">Login</button>
                        </form>
                        <br />
                        <Link to="/signup" style={{textDecoration: "none"}}>New User? Signup </Link>
                    
            </div>
                
           </> 
        )

}

export default Login
