import React, { Component, useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import  { Redirect, useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import IsAdminContext from '../context/IsAdminContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Signup() {

    const {getLoggedIn} = useContext(AuthContext);
    const {getIsAdmin} = useContext(IsAdminContext);
    const history = useHistory();

    const [fullName, setFullName] =useState('');
    // const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [Class, setClass] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    


    async function signup(e) {
        e.preventDefault() // prevent default stops page from refreshing on submit
        
        try {

            // const registerData = {
            //     fullName, userName, email,
            //     Class, branch, password, confirmPassword
            // };

            const registerData = {
                fullName, email,
                Class, branch, password, confirmPassword
            };

            await axios.post('http://localhost:3001/user/signup', registerData)
            await getLoggedIn()
            await getIsAdmin()
            toast.success('Verification mail sent to your email!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            history.push('/login')

        } catch (err) {
            console.error(err);
        }


    }
    
    return (
        <div>
            <div className="container signupContainer">
                <br />
                <h3>Signup</h3>
                <form onSubmit={signup}>
                    <div className='row'>
                        <div className='col-md-6'>
                        <div className="form-group">
                        <label for="exampleInputEmail1">Full Name</label>
                        <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Full name" />
                    </div>
                    <br />
                    {/* <div className="form-group">
                        <label for="exampleInputEmail1">Username</label>
                        <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" />
                    </div>
                    <br /> */}
                    <div className="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <br />
                        </div>
                        <div className='col-md-6'>
                        <div className="form-row align-items-center">
                        <div className="col-auto my-2">
                          <label className="mr-sm-3" for="inlineFormCustomSelect">Class:</label>
                          <select value={Class} onChange={(e) => setClass(e.target.value)} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
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
                          <select value={branch} onChange={(e) => setBranch(e.target.value)} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
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
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" />
                    </div>
                    <br />
                     
                    <div className="form-group">
                        <label for="exampleInputPassword1">Confirm Password</label>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className="form-control" id="confirmPassword" placeholder="Re-enter the Password" />
                    </div>
                    <br />
                            
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                    <span>    </span>
                    <Link to="/login" style={{textDecoration: "none"}}>Login</Link>
                </form>
              
               
            </div>
            <ToastContainer />
        </div>   
    )
    
}

export default Signup
