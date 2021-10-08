import React, { Component, useContext, useState } from 'react'
import axios from 'axios'
import './Navbar.css'
import {Link, useHistory} from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import LogoutBtn from './LogoutBtn'




function Navbar() {

const {loggedIn} = useContext(AuthContext);
const history = useHistory();
  
const [search, setSearch] = useState();
const [userName, setUserName] = useState();

function Search(){
  history.push('/searchResult');
}

function getUserName(){
  try {

    axios.get('http://localhost:3001/user/getUsername')
    .then((res) => {
      setUserName(res.data[0].userName);
    })

  }
  catch (e) {
    console.error(e)
  }
}

function gotoHome() {
    history.push('/');
}

    return (
      <>
      
      {getUserName()}
      
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", marginBottom: "2%"}}>
        <p className="logo" onClick={gotoHome} >VCETDFORUM</p>
          <form onSubmit={search} className="form-inline searchForm justify-content-centre" >
            <input onChange={(e) => setSearch(e.target.value)} value={search} className="searchBox" type="text" placeholder="Search" />
            <a onClick={Search} type="submit" className="searchButton"><i className="fa fa-search"></i></a>
            
          </form>

          {loggedIn===false && (
            <>
              <Link to = "/login" className="btn btn-primary btn-md active">Login</Link>
              <Link to = "/signup" className="btn btn-secondary btn-md active"
                    style={{marginLeft:'1em', marginRight:'1em'}}>Register</Link>
            </>
          )}
          
          {loggedIn===true && (
            <>
              <LogoutBtn />
              <i className='fas fa-user-circle userNameIcon' style={{fontSize:'30px', color:'#0bccda'}}></i>
              &nbsp;&nbsp;
              {userName}
              &nbsp;&nbsp;
              &nbsp;&nbsp;
            </>
          )}

        </nav>

        </>
    )
  
}

export default Navbar
