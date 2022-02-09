import React, { Component, useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import './Signup.css'
import  { Redirect, useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import IsAdminContext from '../context/IsAdminContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateProfile() {

    useEffect(() => {
        getUserDetails()
    }, []);

    const {getLoggedIn} = useContext(AuthContext);
    const {getIsAdmin} = useContext(IsAdminContext);
    const history = useHistory();

    const [fullName, setFullName] = useState('');
    const [Class, setClass] = useState('');
    const [branch, setBranch] = useState('');
    

    async function getUserDetails() {
        try {
            await axios.get('http://localhost:3001/user/getUserDetailsForUpdate')
            .then(res => {
                console.log(res.data)
                setFullName(res.data.fullName)
                setClass(res.data.Class)
                setBranch(res.data.branch)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function updateUserData(e) {
        e.preventDefault() // prevent default stops page from refreshing on submit
        
        try {

            const updateProfileData = {
                fullName, Class, branch
            };

            await axios.post('http://localhost:3001/user/updateProfile', updateProfileData)
            .then(res => {
                toast.success(`Updated successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                history.push('/')
            })
            await getLoggedIn()
            await getIsAdmin()

        } catch (err) {
            console.error(err);
        }


    }

    return (
    <>
    <div className="container">
        <br />
        <div className='row'>
            <div className='col-md-6 updateProfileContainer'>
            <h3>Update Profile</h3>
            <br />
                <form onSubmit={updateUserData}>
            
                <div className="form-group">
                    <label for="exampleInputEmail1">Full Name</label>
                    <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Full name" />
                </div>
                <br />

                
             
                <label className="mr-sm-3" for="inlineFormCustomSelect">Class</label>
                <select value={Class} onChange={(e) => setClass(e.target.value)} className="classSelect custom-select mr-sm-2" id="inlineFormCustomSelect">
                <option selected>Choose...</option>
                <option value="FE">FE</option>
                <option value="SE">SE</option>
                <option value="TE">TE</option>
                <option value="BE">BE</option>
                <option value="Alumni">Alumni</option>
                </select>
            
                <br /><br />
                <label className="mr-sm-3" for="inlineFormCustomSelect">Branch </label>
                <select value={branch} onChange={(e) => setBranch(e.target.value)} className="branchSelect custom-select mr-sm-2" id="inlineFormCustomSelect">
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
                
                <br /><br />

                <button type="submit" className="btn btn-primary">Update</button>
                         
                </form>
            </div>
        </div>        
    </div>
    <ToastContainer />      
    </>
      
     
    )
}

export default UpdateProfile
