import React, { Component, useContext, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from "axios";
import './Login.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ResetPassword() {
   
    const history = useHistory();

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
                await axios.post('http://localhost:3001/user/resetPassword', resetPasswordData)
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
                    history.push('/login');
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
            <div className="container loginContainer">

                <hr />                
                <h3>Reset Password</h3>

                <form className="formForPhone" onSubmit={resetPassword}>

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
                </form>
                    
            </div>

            <ToastContainer />
                
           </> 
        )

}

export default ResetPassword
