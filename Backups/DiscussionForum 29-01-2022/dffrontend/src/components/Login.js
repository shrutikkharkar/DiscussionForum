import React, { Component, useContext, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from "axios";
import './Login.css'
import AuthContext from '../context/AuthContext';
import IsAdminContext from '../context/IsAdminContext';
import GoogleLogin from 'react-google-login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
   
    const {getLoggedIn} = useContext(AuthContext);
    const {getIsAdmin} = useContext(IsAdminContext);
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForm, setShowForm] = useState('login')
    const [messageSent, setMessageSent] = useState(false);

    async function sendEmailForResetPassword(e){
        e.preventDefault();
        try {
            const resetPasswordData = {email};
            await axios.post('http://localhost:3001/user/sendEmailForResetPassword', resetPasswordData)
            .then(res => {
                setMessageSent(true)
                toast.dark(`${res.data}`, {
                    position: "top-center",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }
        catch (err) {
            toast.dark(err.response.data, {
                position: "top-center",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error(err);
        }
    }

    async function login(e) {
        e.preventDefault();

        try {
            
            const loginData = {
                email, password
            };

            await axios.post('http://localhost:3001/user/login', loginData)
            await getLoggedIn()
            await getIsAdmin()
            .then(res => {
                toast.success('Login successful!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                history.push('/');
            })   

        } catch (err) {
            toast.dark(err.response.data, {
                position: "top-center",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error(err);
        }


    }

  

        return (
            <>
            <div className="container loginContainer">
                
                <hr />
                {showForm == 'login' && (
                <>
                    <h3>Login</h3>

                    <form className="formForPhone" onSubmit={login}>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                        </div>
                        <br />
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                            <Link onClick={() => setShowForm('forgotPassword')} style={{textDecoration: "none", float: 'right'}}>Forgot password? </Link>
                        </div>

                        <br />
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                    <br />
                    <Link to="/signup" style={{textDecoration: "none"}}>New User? Signup </Link>

                </>

                )}



                {showForm == 'forgotPassword' && (
                <>
                    <h3>Reset Password</h3>
                    <br />
                    <form className="formForPhone" onSubmit={sendEmailForResetPassword}>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                        </div>
                        <br />
                        
                        <button type="submit" class="btn btn-primary">Reset</button>
                        &nbsp;&nbsp;
                        <Link onClick={() => setShowForm('login')} style={{textDecoration: "none"}}>Login</Link>
                    </form>
                    <br />

                    {messageSent === false && (
                        <Link to="/signup" style={{textDecoration: "none"}}>New User? Signup </Link>
                    )}

                    {messageSent === true && (
                        <p style={{color: "green"}} >Link to reset your password is sent to your entered mail</p>
                    )}
                    

                </>

                )}
                    
            </div>

            <ToastContainer />
                
           </> 
        )

}

export default Login
