import React, { Component, useContext, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from "axios";
import './Login.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signupSvg from '../Images/signupSvg.svg'
import { useMediaQuery } from 'react-responsive'


function ResetPassword() {
   
const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

    const history = useHistory();

    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

    const queryParams = new URLSearchParams(window.location.search);
    const tokenToResetPassword = queryParams.get('user')

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    async function resetPassword(e){
        e.preventDefault();
        try {
            if(password == confirmPassword)
            {
                const resetPasswordData = {tokenToResetPassword, password};
                await axios.post(`${BEHOST}:${BEPORT}/user/resetPassword`, resetPasswordData)
                .then(res => {
                    toast.success(`${res.data}`, {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    history.push('/login/?status=success');
                })
            }
            else{
                toast.dark("Passwords donot match!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            
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

        return (
            <>
            <div className="container">
            <div className="row">
            
            {isDesktopOrLaptop && (
                <div className="col-md-6">
                    <img
                      src={signupSvg}
                      style={{ height: '100%', width: '100%', marginRight: '20vw'}}
                      alt="Verified college Id"
                    />
                </div>
            )}

            <div className="col-md-6">
                <div className="container">  
                <h3>Reset Password</h3>

                <form className="formForPhone" onSubmit={resetPassword}>
                <div className='col-md-12'>
                    <div className="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" />
                    </div>
                    <br />
                     
                    <div className="form-group">
                        <label for="exampleInputPassword1">Confirm Password</label>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className="form-control" id="confirmPassword" placeholder="Re-enter the Password" />
                    </div>

                        <br />
                        <button type="submit" class="btn btn-primary">Reset</button>
                </div>
                </form>
                    
            </div>
            </div>
            </div>
            </div>

            <ToastContainer />
                
           </> 
        )

}

export default ResetPassword
