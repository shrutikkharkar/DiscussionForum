import React, { Component, useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Navbar.css'
import './NavigationFunctions.css'
import {Link, useHistory} from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext'
import LogoutBtn from './LogoutBtn'
import SearchBar from './SearchBar'
import { FaUserCircle } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { RiArrowDropDownLine, RiProfileFill } from "react-icons/ri";
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Hamburger from 'hamburger-react';
import { BsFillQuestionSquareFill, BsShieldFillCheck } from "react-icons/bs";
import { TiHome } from "react-icons/ti";
import NavigationFunctions from './NavigationFunctions'
import Dropdown from "react-bootstrap/Dropdown";
import VCETLogo from '../Images/VCETLogo.svg'
import UserIcon from '../Images/UserIcon.svg'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

function Navbar() {

const {loggedIn} = useContext(AuthContext);
const {isAdmin} = useContext(IsAdminContext);
const history = useHistory();
  
const [search, setSearch] = useState();
const [QuestionData, setQuestionData] = useState();

const [fullName, setFullName] = useState('');
const [isCollegeId, setIsCollegeId] = useState(false);


const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

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

const CustomToggleForNav = React.forwardRef(({ children, onClick }, ref) => (
  <span
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <Hamburger />
  </span>
));

useEffect(() => {
  getNotifications()
  getQuestions()
}, []);

const [NotificationData, setNotificationData] = useState([]);

function Search(){
  history.push('/searchResult');
}

function getFullNameAndIsCollegeId(){
  try {

    axios.get('http://localhost:3001/user/getFullNameAndIsCollegeId')
    .then((res) => {
      setFullName(res.data[0].fullName);
      setIsCollegeId(res.data[0].isCollegeId);
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

const [displaySidebar, setDisplaySidebar] = useState('none')
const [isOpen, setOpen] = useState(false)

const [SideNavForPhone, setSideNavForPhone] = useState('none')
function openNavbarForPhone() {
  
}

    return (
      <>

      
      {/* {getUserName()} */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", marginBottom: "2%"}}>
        
        <p className="logo" onClick={gotoHome} > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VCETDFORUM</p>
        <Dropdown  style={{display: 'inline'}} >
            <Dropdown.Toggle as={CustomToggleForNav} />
            <Dropdown.Menu className="dropdown-styling" size="sm" title="">

                  <Dropdown.Item>
                    <TiHome style={{ fontSize: '1.90em' }} />
                    <Link to = "/" >Home</Link>
                  </Dropdown.Item>
                    
                  <Dropdown.Item>
                    <i className="fas fa-bookmark" style={{ fontSize: '1.5em' }} /> Saved answers
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <i className="fas fa-heart" style={{ fontSize: '1.5em' }} />  Liked answers
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <i className="fas fa-check-square" style={{ fontSize: '1.5em' }} /> Answered
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <BsFillQuestionSquareFill className="fas fa-heart" style={{ fontSize: '1.5em' }} /> My Questions
                  </Dropdown.Item>



                  
                  {/* <SideNav
            onSelect={(selected) => {
                const to = '/' + selected;
                if (to) {
                    history.push(to);
                }
            }}
            style={{ backgroundColor: 'black'}}
            className='SideNav'
            expanded={true}
            >      
            <SideNav.Toggle />
           
            <SideNav.Nav defaultSelected="">

                <NavItem eventKey="">
                    <NavIcon>
                        <TiHome style={{ fontSize: '1.90em' }} />
                    </NavIcon>
                    <NavText>
                        Home
                    </NavText>
                </NavItem>

                <NavItem eventKey="saved">
                    <NavIcon>
                        <i className="fas fa-bookmark" style={{ fontSize: '1.5em' }} />
                    </NavIcon>
                    <NavText>
                        Saved answers
                    </NavText>
                </NavItem>

                <NavItem eventKey="liked">
                    <NavIcon>
                        <i className="fas fa-heart" style={{ fontSize: '1.5em' }} />
                    </NavIcon>
                    <NavText>
                        Liked answers
                    </NavText>
                </NavItem>

                <NavItem eventKey="answered">
                    <NavIcon>
                        <i className="fas fa-check-square" style={{ fontSize: '1.5em' }} />
                    </NavIcon>
                    <NavText>
                        Answered
                    </NavText>
                </NavItem>

                <NavItem eventKey="questioned">
                    <NavIcon>
                        <BsFillQuestionSquareFill className="fas fa-heart" style={{ fontSize: '1.5em' }} />
                    </NavIcon>
                    <NavText>
                        My Questions
                    </NavText>
                </NavItem>

                {isAdmin == true && (
                <NavItem eventKey="admin">

                    <NavIcon>
                        <BsShieldFillCheck style={{ fontSize: '1.75em' }} />
                    </NavIcon>
                    <NavText>
                        Admin Panel
                    </NavText>
                    <NavItem eventKey="allAnswers">
                        <NavText>
                            All Answers
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="allComments">
                        <NavText>
                            All Comments
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="allQuestions">
                        <NavText>
                            All Questions
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="allFlags">
                        <NavText>
                            All Flags
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="allUsers">
                        <NavText>
                            All Users
                        </NavText>
                    </NavItem>

                </NavItem>
                )}

                </SideNav.Nav>
        </SideNav> */}
                  
                  
            </Dropdown.Menu>
          </Dropdown>
        {/* <span className="HamburgerIcon"><Hamburger onToggle={toggled => openNavbarForPhone()} /></span> */}
        {/* <p className="logoForPhone" onClick={gotoHome} > V</p> */}
          
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
            {getFullNameAndIsCollegeId()}
            <div style={{marginLeft:'1em', marginRight:'1em', float: 'right'}}>

            <BiSearch className="searchIconForPhone" />
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

            
            <span className="askQuestionBtnSpan"><button onClick={Search} className="btn btn-primary">Ask a Question</button></span>
              <LogoutBtn />
              {/* <img src={VCETLogo}></img> */}
              {isCollegeId === true && (
                <img
                  src={VCETLogo}
                  style={{ height: 33, width: 33 }}
                  alt="Verified college Id"
                />
              )}

              {isCollegeId === false && (
                <>
                <FaUserCircle className='fas fa-user-circle userNameIcon' style={{fontSize:'30px', color:'#0bccda'}}/>
                {/* <img
                  src={UserIcon}
                  style={{ height: 33, width: 33 }}
                  alt="Verified college Id"
                /> */}
                </>
              )}

              &nbsp;&nbsp;
              {fullName}
              {/* <Hamburger onToggle={toggled => openNavbarForPhone()} /> */}
              <Dropdown  style={{display: 'inline'}} >
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu className="dropdown-styling" size="sm" title="">

                    <Dropdown.Item onClick={() => history.push('/updateProfile')}><RiProfileFill style={{fontSize: '1.3rem'}} /> Update profile</Dropdown.Item>
                    {/* <Dropdown.Item onClick={() => removeQuestionByAdmin(question._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Logout</Dropdown.Item> */}
                  
                  </Dropdown.Menu>
              </Dropdown>
              &nbsp;&nbsp;
            </div>
            </>
          )}

          {loggedIn===true && isAdmin===true && (
            <>
            {getFullNameAndIsCollegeId()}
            <div style={{marginLeft:'1em', marginRight:'1em', float: 'right'}}>
      
            <BiSearch onClick={showSearchbarForPhone} className="searchIconForPhone" />
            
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

            

            <span className="askQuestionBtnSpan"><button onClick={Search} className="btn btn-primary">Ask a Question</button></span>
            &nbsp;
              {/* <Link to = "/admin" className="btn btn-outline-dark">Admin Panel</Link> */}

              <LogoutBtn />
              {/* <img src={VCETLogo}></img> */}

              {isCollegeId === true && (
                <img
                  src={VCETLogo}
                  style={{ height: 33, width: 33 }}
                  alt="Verified college Id"
                />
              )}

              {isCollegeId === false && (
                <>
                <FaUserCircle className='fas fa-user-circle userNameIcon' style={{fontSize:'30px', color:'#0bccda'}}/>
                {/* <img
                  src={UserIcon}
                  style={{ height: 33, width: 33 }}
                  alt="Verified college Id"
                /> */}
                </>
              )}

              &nbsp;&nbsp;
              {fullName}
              <Dropdown style={{display: 'inline'}}>
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu className="dropdown-styling" size="sm" title="">

                  <Dropdown.Item onClick={() => history.push('/updateProfile')}><RiProfileFill style={{fontSize: '1.3rem'}} /> Update profile</Dropdown.Item>

                  </Dropdown.Menu>
              </Dropdown>
              
          
              {/* <Hamburger onToggle={toggled => openNavbarForPhone()} /> */}
              <span className="spaceForDesktop">&nbsp;&nbsp;
              </span>
              
              &nbsp;&nbsp;
            </div>
            </>
          )}

        </nav>

        </>
    )
  
}

export default Navbar
