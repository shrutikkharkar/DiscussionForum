import React, { Component, useContext, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from "axios";
import './Login.css'
import AuthContext from '../context/AuthContext';
import IsAdminContext from '../context/IsAdminContext';
import GoogleLogin from 'react-google-login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginSvg from '../Images/loginSvg.svg'
import Loading from '../Images/Loading.svg'
import { useMediaQuery } from 'react-responsive'



function Login() {
   
    const {getLoggedIn} = useContext(AuthContext);
    const {getIsAdmin} = useContext(IsAdminContext);
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForm, setShowForm] = useState('login')
    const [messageSent, setMessageSent] = useState(false);

    const [loginLoading, setLoginLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)

    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status')

    async function sendEmailForResetPassword(e, next){
        e.preventDefault();
        setResetLoading(true)
        try {
            const resetPasswordData = {email};
            await axios.post('http://localhost:3001/user/sendEmailForResetPassword', resetPasswordData)
            .then(res => {
                setResetLoading(false);
                setMessageSent(true)
                // toast.dark(`${res.data}`, {
                //     position: "top-center",
                //     autoClose: 8000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                // });
            })
        }
        catch (err) {
            setResetLoading(false);
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
        setLoginLoading(true)

        try {
            
            const loginData = {
                email, password
            };

            await axios.post('http://localhost:3001/user/login', loginData)
            await getLoggedIn()
            await getIsAdmin()
            .then(res => {
                setLoginLoading(false)
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
            setLoginLoading(false)
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
            <div className="container">
            <div className="row">
                {isDesktopOrLaptop && (
                    <div className='col-md-6'>
                        <img
                          src={loginSvg}
                          style={{ height: '100%', width: '100%', marginRight: '20vw'}}
                          alt="Verified college Id"
                        />
                    </div>
                )}

                
                <div className='col-md-6'>

                {showForm == 'login' && (
                <div className="loginContainer container col-md-12" >
                    <h3>Login</h3>

                    <form className="formForPhone" onSubmit={login}>
                        <div className="form-group col-md-6">
                            <label for="exampleInputEmail1">Email address</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                        </div>
                        <br />
                        <div class="form-group col-md-6">
                            <label for="exampleInputPassword1">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                            <Link onClick={() => setShowForm('forgotPassword')} style={{textDecoration: "none", float: 'right'}}>Forgot password? </Link>
                        </div>

                        <br />
                        <button type="submit" class="btn btn-primary">
                            {loginLoading === false && (
                                <span>Login</span>
                            )}
                            {loginLoading === true && (
                                <span>Logging in...</span>
                            )}
                        </button>
                    </form>
                    <br />
                    <Link to="/signup" style={{textDecoration: "none"}}>New User? Signup </Link>
                   
                   {status == 'success' && (
                       <p style={{color: 'green'}}>Password reset successful</p>
                   )}
                </div>

                )}

                

                {showForm == 'forgotPassword' && (
                <div className="loginContainer container col-md-12">
                    <h3>Reset Password</h3>
                    <br />
                    <form className="formForPhone" onSubmit={sendEmailForResetPassword}>
                        <div class="form-group col-md-6">
                            <label for="exampleInputEmail1">Email address</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />

                        </div>
                        <br />
                        
                        <button type="submit" class="btn btn-primary">
                            {resetLoading === false && (
                                <span>Reset</span>
                            )}
                            {resetLoading === true && (
                                <span>Sending mail...</span>
                            )}
                            
                        </button>

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
                    

                </div>

                )}
                </div>
            
                    
            </div>

            </div>
            <ToastContainer />
                
           </> 
        )

}

export default Login
