import React, { Component, useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Navbar from './Navbar'
import  { Redirect, useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom'
import AuthContext from '../context/AuthContext';



function Signup() {

    const {getLoggedIn} = useContext(AuthContext);
    const history = useHistory();

    const [fullName, setFullName] =useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [Class, setClass] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    


    async function signup(e) {
        e.preventDefault() // prevent default stops page from refreshing on submit
        
        try {

            const registerData = {
                fullName, userName, email,
                Class, branch, password, confirmPassword
            };

            await axios.post('http://localhost:3001/user/signup', registerData)
            await getLoggedIn()
            history.push('/')

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
                    <div className="form-group">
                        <label for="exampleInputEmail1">Username</label>
                        <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" />
                        <small id="emailHelp" className="form-text text-muted">Following username will be displayed to public.</small>
                    </div>
                    <br />
                    <div className="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
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
            
        </div>   
    )
    
}

export default Signup








// import React, { Component, useContext } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from "axios";
// import Navbar from './Navbar'
// import  { Redirect, useHistory } from 'react-router-dom';
// import {Link} from 'react-router-dom'
// import AuthContext from '../context/AuthContext';

// const {getLoggedIn} = useContext(AuthContext);
// const history = useHistory();


// Class Signup extends Component {
    
//     constructor(props) {
//         super()
//         this.state = {
//             fullName: '',
//             userName: '',
//             email: '',
//             Class: '',
//             branch: '',
//             password: '',
//             confirmPassword: ''
//         }
//         this.changeFullName = this.changeFullName.bind(this)
//         this.changeUserName = this.changeUserName.bind(this)
//         this.changeEmail = this.changeEmail.bind(this)
//         this.changeClass = this.changeClass.bind(this)
//         this.changeBranch = this.changeBranch.bind(this)
//         this.changePassword = this.changePassword.bind(this)
//         this.changeConfirmPassword = this.changeConfirmPassword.bind(this)

//         this.onSubmit = this.onSubmit.bind(this)
//     }

//     changeFullName(event) {
//         this.setState({ fullName: event.target.value })
//     }

//     changeUserName(event) {
//         this.setState({ userName: event.target.value })
//     }

//     changeEmail(event) {
//         this.setState({ email: event.target.value })
//     }

//     changeClass(event) {
//         this.setState({ Class: event.target.value })
//     }

//     changeBranch(event) {
//         this.setState({ branch: event.target.value })
//     }

//     changePassword(event) {
//         this.setState({ password: event.target.value })
//     }

//     changeConfirmPassword(event) {
//         this.setState({ confirmPassword: event.target.value })
//     }

//     async onSubmit(event) {
//         event.preventDefault() // prevent default stops page from refreshing on submit
        
//         const registered = {
//             fullName: this.state.fullName,
//             userName: this.state.userName,
//             email: this.state.email,
//             Class: this.state.Class,
//             branch: this.state.branch,
//             password: this.state.password
//         } // registered will be sent to backend
//         if(this.state.password == this.state.confirmPassword)
//         {
//             await axios.post('http://localhost:3001/users/signup', registered)
//             await getLoggedIn()
//             history.push('/')
//             /*
//             .then(response => {
//             console.log(response.data)
//             window.alert(response.data.message)
//             window.location.href = '/login'
//             })

//             .catch(err => {
//                 window.alert("Please provide correct credentials")
//             })
//             */
//         }

//         else{
//             window.alert("Different passwords")
//         }

//     }
//     render() {
//         return (
//             <div>
//                 <Navbar />
//                 <div className="container signupContainer">
//                     <br />
//                     <h3>Signup</h3>

//                     <form onSubmit={this.onSubmit}>
//                         <div className='row'>

//                             <div className='col-md-6'>

//                             <div className="form-group">
//                             <label for="exampleInputEmail1">Full Name</label>
//                             <input onChange={this.changeFullName} value={this.state.fullName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Full name" />
//                         </div>
//                         <br />
//                         <div className="form-group">
//                             <label for="exampleInputEmail1">Username</label>
//                             <input onChange={this.changeUserName} value={this.state.userName} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" />
//                             <small id="emailHelp" className="form-text text-muted">Following username will be displayed to public.</small>
//                         </div>
//                         <br />
//                         <div className="form-group">
//                             <label for="exampleInputEmail1">Email address</label>
//                             <input onChange={this.changeEmail} value={this.state.email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
//                             <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
//                         </div>
//                         <br />

//                             </div>


//                             <div className='col-md-6'>

//                             <div className="form-row align-items-center">
//                             <div className="col-auto my-2">
//                               <label className="mr-sm-3" for="inlineFormCustomSelect">Class:</label>
//                               <select value={this.state.Class} onChange={this.changeClass} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
//                                 <option selected>Choose...</option>
//                                 <option value="FE">FE</option>
//                                 <option value="SE">SE</option>
//                                 <option value="TE">TE</option>
//                                 <option value="BE">BE</option>
//                                 <option value="Alumni">Alumni</option>
//                               </select>
//                             </div>
//                         </div>
//                         <br /> 
//                         <div className="form-row align-items-center"> 
//                             <div className="col-auto my-2">
//                               <label className="mr-sm-3" for="inlineFormCustomSelect">Branch : </label>
//                               <select value={this.state.branch} onChange={this.changeBranch} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
//                                 <option selected>Choose...</option>
//                                 <option value="Comps">Comps</option>
//                                 <option value="IT">INFT</option>
//                                 <option value="Mech">Mech</option>
//                                 <option value="Instru">Instrumentation</option>
//                                 <option value="Civil">Civil</option>
//                                 <option value="Extc">Extc</option>
//                                 <option value="AI/DS">AI/DS</option>
//                                 <option value="DS">DS</option>
//                               </select>
//                             </div>
//                         </div>
//                         <br />
//                         <div className="form-group">
//                             <label for="exampleInputPassword1">Password</label>
//                             <input onChange={this.changePassword} value={this.state.password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" />
//                         </div>
//                         <br />
                         
//                         <div className="form-group">
//                             <label for="exampleInputPassword1">Confirm Password</label>
//                             <input onChange={this.changeConfirmPassword} value={this.state.confirmPassword} type="password" className="form-control" id="confirmPassword" placeholder="Re-enter the Password" />
//                         </div>
//                         <br />
                                
//                             </div>

//                         </div>





                       
                        
                        
//                         {/*
//                         <div className="form-group form-check">
//                             <input type="checkbox" className="form-check-input" id="exampleCheck1" />
//                             <label className="form-check-label" for="exampleCheck1">Remember me</label>
//                         </div>
//                         <br /> */}
//                         <button type="submit" className="btn btn-primary">Register</button>
//                         <span>    </span>
//                         <Link to="/login" style={{textDecoration: "none"}}>Login</Link>
//                     </form>
                  
                   
//                 </div>
                
//             </div>   
//         )
//     }
// }

// export default Signup

