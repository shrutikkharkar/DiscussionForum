import React, { Component, useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Navbar.css'
import {Link, useHistory} from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext'
import LogoutBtn from './LogoutBtn'
import SearchBar from './SearchBar'
import { FaUserCircle } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';


function Navbar() {

const {loggedIn} = useContext(AuthContext);
const {isAdmin} = useContext(IsAdminContext);
const history = useHistory();
  
const [search, setSearch] = useState();
const [QuestionData, setQuestionData] = useState();

const [userName, setUserName] = useState();


const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
    getNotifications()
  };

useEffect(() => {
  getNotifications()
  getQuestions()
}, []);

const [NotificationData, setNotificationData] = useState([]);

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

function getQuestions(){
  try {

    axios.get('http://localhost:3001/question/get')
    .then((res) => {
      setQuestionData(res.data);
    })

  }
  catch (e) {
    console.error(e)
  }
}

async function getNotifications(){
  try{

    if(isAdmin===true){
      await axios.get('http://localhost:3001/notification/getNotificationsForAdmin')
      .then((res) => {
        setNotificationData(res.data);
        console.log("Admin block" + res.data);
      })
    }
    if(isAdmin===false){
      await axios.get('http://localhost:3001/notification/getNotificationsForUser')
      .then((res) => {
        setNotificationData(res.data);
        console.log("User block" + res.data);
      })
    }
      

  }
  catch (e) {
    console.error(e)
  }
}

async function clearAllNotifications(){
  try{
    await axios.post('http://localhost:3001/notification/clearAllNotifications')
    .then((res) => {
      getNotifications()
      setShow(!show)
    })
  }
  catch (e) {
    console.error(e)
  }
}

function goToAnswer(questionId){
  history.push(`/topqans/?query=${questionId}`)
  setShow(!show)
}

function goToReportedAnswers(){
  history.push("/allFlags")
}

function gotoHome() {
    history.push('/');
}

    return (
      <>
      {/* {getUserName()} */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", marginBottom: "2%"}}>
        
        <p className="logo" onClick={gotoHome} > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VCETDFORUM</p>
          
          <SearchBar placeholder="Search..." data={QuestionData} />

          {/* <form onSubmit={search} className="form-inline searchForm justify-content-centre" >
            <input onChange={(e) => setSearch(e.target.value)} value={search} className="searchBox" type="text" placeholder="Search" />
            <a onClick={Search} type="submit" className="searchButton"><i className="fa fa-search"></i></a>  
          </form> */}


          {loggedIn===false && isAdmin===false && (
            <>
            
            <div style={{marginLeft:'1em', marginRight:'1em', float: 'right'}}>
              <Link to = "/login" className="btn btn-primary btn-md active" style={{marginLeft:'1em', marginRight:'1em'}}>Login</Link>
              <Link to = "/signup" className="btn btn-secondary btn-md active">Register</Link>
            </div>
              
            </>
          )}
          
          {loggedIn===true && isAdmin===false && (
            <>
            {getUserName()}
            <div style={{marginLeft:'1em', marginRight:'1em', float: 'right'}}>

            <div className="topbarIcons">
              <div className="topbarIconItem">
                <MdNotificationsNone onClick={handleClick} className="notificationIcon" />
                <span className="topbarIconBadge">{NotificationData.length}</span>
              </div>

              <div ref={ref}>
              <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref}
                containerPadding={20}
              >
                <Popover id="popover-contained">
                  <Popover.Header as="h3">Notifications</Popover.Header>
                  <Popover.Body>
                  {
                    NotificationData.map(notification => (
                      <>

                        {notification.type == "answered" && (
                          <p onClick={() => goToAnswer(notification.propertyId)} >
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            answered to your question
                          </p>
                        )}
                        {notification.type == "liked" && (
                          <p>
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            liked your answer
                          </p>
                        )}
                        {notification.type == "commented" && (
                          <p>
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            commented on your answer
                          </p>
                        )}
                        

                      <hr />
                      </>
                    ))}
                    <button type="button" onClick={() => clearAllNotifications()} class="btn btn-secondary">Clear all</button>
                  </Popover.Body>
                </Popover>
              </Overlay>
            </div>

            </div>

            
            <button onClick={Search} class="btn btn-primary">Ask a Question</button>
              <LogoutBtn />
              <FaUserCircle className='fas fa-user-circle userNameIcon' style={{fontSize:'30px', color:'#0bccda'}}/>
              {/* <i ></i> */}
              &nbsp;&nbsp;
              {userName}
              &nbsp;&nbsp;
              &nbsp;&nbsp;
            </div>
            </>
          )}

          {loggedIn===true && isAdmin===true && (
            <>
            {getUserName()}
            <div style={{marginLeft:'1em', marginRight:'1em', float: 'right'}}>
      
            <div className="topbarIcons">
              <div className="topbarIconItem">
                <MdNotificationsNone onClick={handleClick} className="notificationIcon" />
                <span className="topbarIconBadge">{NotificationData.length}</span>
              </div>

              <div ref={ref}>
              <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref}
                containerPadding={20}
              >
                <Popover id="popover-contained">
                  <Popover.Header as="h3">
                    Notifications
                  </Popover.Header>

                  <Popover.Body>
                    {
                    NotificationData.map(notification => (
                      <>

                        {notification.type == 'liked' && (
                          <p>
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            liked your answer
                          </p>
                        )}
                       
                      
                        
                        {notification.type == "answered" && (
                          <p onClick={() => goToAnswer(notification.propertyId)}>
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            answered to your question
                          </p>
                        )}
                        
                        {notification.type == "commented" && (
                          <p>
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            commented on your answer
                          </p>
                        )}

                        {notification.type == "reportedAnswer" && (
                          <p onClick={() => goToReportedAnswers()} >
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            reported a answer
                          </p>
                        )}

                      <hr />
                      
                      </>
                    ))}
                    <button type="button" onClick={() => clearAllNotifications()} class="btn btn-secondary">Clear all</button>
                  </Popover.Body>
                </Popover>
              </Overlay>
            </div>

            </div>



            <button onClick={Search} class="btn btn-primary">Ask a Question</button>
            &nbsp;
              {/* <Link to = "/admin" className="btn btn-outline-dark">Admin Panel</Link> */}

              <LogoutBtn />
              <FaUserCircle className='fas fa-user-circle userNameIcon' style={{fontSize:'30px', color:'#0bccda'}}/>
              {/* <i ></i> */}
              &nbsp;&nbsp;
              {userName}
              &nbsp;&nbsp;
              &nbsp;&nbsp;
            </div>
            </>
          )}

        </nav>

        </>
    )
  
}

export default Navbar
