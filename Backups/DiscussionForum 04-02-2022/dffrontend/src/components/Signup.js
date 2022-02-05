import React, { Component, useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import  { Redirect, useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import IsAdminContext from '../context/IsAdminContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';
import signupSvg from '../Images/signupSvg.svg'
import { useMediaQuery } from 'react-responsive'


function Signup() {

    const {getLoggedIn} = useContext(AuthContext);
    const {getIsAdmin} = useContext(IsAdminContext);
    const history = useHistory();

    const [fullName, setFullName] =useState('');
    const [email, setEmail] = useState('');
    const [Class, setClass] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

    async function signup(e) {
        e.preventDefault() // prevent default stops page from refreshing on submit
        
        try {
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

            <div className="col-md-6 signupDiv">
                <div className="container">
                <h3>Signup</h3>
                <br />
                <form onSubmit={signup}>
                
                <div className='col-md-12'>
                    <div className="form-group">
                        <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Full name" />
                    </div>
                    <br />
                    <div className="form-group">
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <br />
                
                    <div className="row">
                    <div className="form-row col-md-6 col-xs-12 align-items-center">
                        <select value={Class} onChange={(e) => setClass(e.target.value)} className=" classSelect custom-select mr-sm-2" id="inlineFormCustomSelect">
                          <option selected>Select Class...</option>
                          <option value="FE">First year (FE)</option>
                          <option value="SE">Second year (SE)</option>
                          <option value="TE">Third year (TE)</option>
                          <option value="BE">Final year (BE)</option>
                          <option value="Alumni">Alumni</option>
                        </select>
                    </div>
                    <br /> 

                    <div className="form-row col-md-6 col-xs-12 align-items-center"> 
                        <select value={branch} onChange={(e) => setBranch(e.target.value)} className=" branchSelect custom-select mr-sm-2" id="inlineFormCustomSelect">
                          <option selected>Select Branch...</option>
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
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" />
                    </div>
                    <br />
                 
                    <div className="form-group">
                        <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className="form-control" id="confirmPassword" placeholder="Re-enter the Password" />
                    </div>
                    <br />
                        
                    
                    <button type="submit" className="btn btn-primary">Register</button>
                    &nbsp; &nbsp;
                    <Link to="/login" style={{textDecoration: "none"}}>Login</Link>
                </div>
            </form>
            </div>
            </div>
        </div>
            
            
          
            <ToastContainer />
        </div>
            
    )
    
}

export default Signup
