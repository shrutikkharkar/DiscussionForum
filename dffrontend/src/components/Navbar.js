import React, { Component, useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Navbar.css'
import './NavigationFunctions.css'
import {Link, useHistory} from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext'
import SearchBar from './SearchBar'
import { FaUserCircle, FaCheckSquare, FaHeart } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";

import { RiArrowDropDownLine, RiProfileFill } from "react-icons/ri";
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Hamburger from 'hamburger-react';
import { BsFillQuestionSquareFill, BsShieldFillCheck, BsBookmarkFill } from "react-icons/bs";
import { TiHome } from "react-icons/ti";
import NavigationFunctionsForPhone from './NavigationFunctionsForPhone'
import Dropdown from "react-bootstrap/Dropdown";
import VCETLogo from '../Images/VCETLogo.svg'
import UserIcon from '../Images/UserIcon.svg'
import VCETDFORUM from '../Images/VCETDFORUM.svg'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { useMediaQuery } from 'react-responsive'

function Navbar() {

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

const {loggedIn} = useContext(AuthContext);
const {isAdmin} = useContext(IsAdminContext);

const {getLoggedIn} = useContext(AuthContext);//For logout
const {getIsAdmin} = useContext(IsAdminContext);//For logout
const history = useHistory();
  
const [search, setSearch] = useState();
const [QuestionData, setQuestionData] = useState();

const [fullName, setFullName] = useState('');
const [isCollegeId, setIsCollegeId] = useState(false);

const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})

const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const [showSearch, setShowSearch] = useState(false);
  const [targetSearch, setTargetSearch] = useState(null);
  const refSearch = useRef(null);

  // const [isOpen, setOpen] = useState(false)

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
    getNotifications()
  };

  const showSearchbarForPhone = (event) => {

  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <RiArrowDropDownLine style={{fontSize: '2rem', cursor: 'pointer'}} />
    </span>
));



useEffect(() => {
  getNotifications()
  getQuestionsAndTagsForSearchBar()
  getFullNameAndIsCollegeId()
}, []);

const [NotificationData, setNotificationData] = useState([]);

function Search(){
  history.push('/askQuestion');
}

function getFullNameAndIsCollegeId(){
  try {

    axios.get(`${BEHOST}:${BEPORT}/user/getFullNameAndIsCollegeId`)
    .then((res) => {
      setFullName(res.data[0].fullName);
      setIsCollegeId(res.data[0].isCollegeId);
    })

  }
  catch (e) {
    console.error(e)
  }
}

function getQuestionsAndTagsForSearchBar(){
  try {
    axios.get(`${BEHOST}:${BEPORT}/question/getQuestionsAndTagsForSearchBar`)
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
      await axios.get(`${BEHOST}:${BEPORT}/notification/getNotificationsForUser`)
      .then((res) => {
        setNotificationData(res.data);
      })
    }
    if(isAdmin===false){
      await axios.get(`${BEHOST}:${BEPORT}/notification/getNotificationsForUser`)
      .then((res) => {
        setNotificationData(res.data);
      })
    }
      

  }
  catch (e) {
    console.error(e)
  }
}

async function clearAllNotifications(){
  try{
    await axios.post(`${BEHOST}:${BEPORT}/notification/clearAllNotifications`)
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

async function logout() {
  await axios.get(`${BEHOST}:${BEPORT}/user/logout`);
  await getLoggedIn();
  await getIsAdmin();
  history.push('/');
}

const [openSidenavForPhone, setOpenSidenavForPhone] = useState('none')

function toggleSidenavForPhone(){
  if(openSidenavForPhone == 'none'){
    setOpenSidenavForPhone('inline')
  }
  if(openSidenavForPhone == 'inline'){
    setOpenSidenavForPhone('none')
  }
}

    return (
      <>  
      {isPortrait && (
        <NavigationFunctionsForPhone show={openSidenavForPhone} />
      )}
    
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", 
        marginBottom: "2%", paddingTop: 0, paddingBottom: 0}}>
        
        {/* Div Start inside NAV */}
        <div className="MainDivOfNav">

        {/* DIV bar for logo START */}
        <div>
          {!isPortrait && (
          <>
            <span className="logo" onClick={gotoHome} > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VCETDFORUM</span>
          </>
          )}
          {isPortrait && (
            <span className="logoForPhone" onClick={gotoHome} > V</span>
          )}
        </div>
        {/* DIV bar for logo END */}
        
          
        {/* Div for search bar START*/}
        <div>
          {/* {!isPortrait && (
              <SearchBar placeholder="Search..." data={QuestionData} />
          )} */}
          <SearchBar placeholder="Search..." data={QuestionData} />
        </div>
        {/* Div for search bar End*/}
          

         {/* Div for notifications START */}
         {loggedIn === true && (
        <div>

          <MdNotificationsNone onClick={handleClick} className="notificationIcon" />
            

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
                  {NotificationData.length > 0 && (
                    <>
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

                        {notification.type == "reportedAnswer" && isAdmin === true && (
                          <p onClick={() => goToReportedAnswers()} >
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            reported a answer
                          </p>
                        )}

                        {notification.type == "reportedQuestion" && isAdmin === true && (
                          <p onClick={() => goToReportedAnswers()} >
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            reported a question
                          </p>
                        )}

                        {notification.type == "reportedComment" && isAdmin === true && (
                          <p onClick={() => goToReportedAnswers()} >
                            {notification.fromName} ({notification.fromClass} - {notification.fromBranch})
                            reported a comment
                          </p>
                        )}
                        

                      <hr />
                      </>
                    ))}
                    </>
                  )}
                  {NotificationData.length == 0 && (
                    <>
                      <p>No notifications for now!</p>
                      <hr />
                    </>
                  )}
                    <button type="button" onClick={() => clearAllNotifications()} class="btn btn-secondary">Clear all</button>
                  </Popover.Body>
                </Popover>
              </Overlay>
            </div>
        </div>
        )}
        {/* Div for notifications END */}


        {/* Div for ask question on PC START */}
        {/* {isDesktopOrLaptop && (
          <div>
            <button onClick={Search} className="btn btn-primary">Ask a Question</button>
          </div>
        )} */}
        {/* Div for ask question on PC END */}


        {/* Div for Login Signup and Logout for PC START */}
        <div>
          {loggedIn === false && (
            <>
              <Link to = "/login" className="btn btn-primary btn-md active" style={{marginLeft:'1em', marginRight:'1em'}}>Login</Link>
              <Link to = "/signup" className="btn btn-secondary btn-md active">Register</Link>
              &nbsp;
            </>
          )}
          {loggedIn === true && !isPortrait && (
            <>
              <button onClick={Search} className="btn btn-primary">Ask a Question</button>
              &nbsp;
              <button onClick={logout} className="btn btn-secondary btn-md active">Logout</button>
            </>
          )}
        </div>
        {/* Div for Login Signup and Logout for PC END */}


        {/* Div for user icon and name and update dropdown START */}
        {loggedIn === true && (
        <div>
          {getFullNameAndIsCollegeId()}
          {isCollegeId === true && !isPortrait && (
            <img
              src={VCETLogo}
              style={{ height: 33, width: 33 }}
              alt="Verified college Id"
            />
          )}

          {isCollegeId === false && !isPortrait && (   
          <>
            <FaUserCircle className='fas fa-user-circle userNameIcon' style={{fontSize:'30px', color:'#0bccda'}}/>  
            &nbsp;
          </>
          )}

          {!isPortrait && (
          <>  
            <span>{fullName}</span>

            <Dropdown style={{display: 'inline'}}>
              <Dropdown.Toggle as={CustomToggle} />
                <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                  <Dropdown.Item onClick={() => history.push('/updateProfile')}><RiProfileFill style={{fontSize: '1.3rem'}} /> Update profile</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
          )}

          {isPortrait && (
            <Hamburger toggled={false}
              onToggle={toggled => {
                if (toggled) {
                  toggleSidenavForPhone()
                } else {
                  toggleSidenavForPhone()
                } 
              }}
              className="HamburgerIcon" 
            />
          )}
          
        </div>
        )}
        {/* Div for user icon and name and update dropdown END */}
  
        </div>
        {/* Div END inside NAV */}

        </nav>

        </>
    )
  
}

export default Navbar
