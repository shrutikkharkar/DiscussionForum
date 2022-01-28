import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import './NavigationFunctions.css'
import { BsFillQuestionSquareFill, BsShieldFillCheck, BsPencilSquare } from "react-icons/bs";
import { TiHome } from "react-icons/ti";
import IsAdminContext from '../context/IsAdminContext'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function NavigationFunctions() {

    const history = useHistory();

    const {isAdmin} = useContext(IsAdminContext);

    // function sendToSaved(){
    //     history.push('/saved');
    // }
    // function sendToLiked(){
    //     history.push('/liked');
    // }
    // function sendToAnswered(){
    //     history.push('/answered');
    // }

    // function sendToQuestioned(){
    //     history.push('/questioned');
    // }

    return (

        <SideNav
            onSelect={(selected) => {
                const to = '/' + selected;
                if (to) {
                    history.push(to);
                }
            }}
            style={{ backgroundColor: 'black', position: 'fixed' }}
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
                <NavItem eventKey="allAdmins">
                    <NavText>
                        All Admins
                    </NavText>
                </NavItem>
                
                
            </NavItem>
            )}

            


        </SideNav.Nav>
    </SideNav>
        // <div className="navigation-functions-div">
                
        //         <p onClick={sendToSaved} className='function-saved-icon'>
        //             <i className="fas fa-bookmark"></i>
        //             <span className='functions'> Saved</span>
        //         </p>

        //         <p onClick={sendToLiked} className='function-like-icon'>
        //             <i className="fas fa-heart"></i>
        //             <span className='functions'> Liked</span>
        //         </p>

        //         <p onClick={sendToAnswered} className='function-answered-icon'>
        //             <i className="fas fa-check-square"></i>
        //             <span className='functions'> Answered</span>
        //         </p>

        //         <p onClick={sendToQuestioned} className='function-questioned-icon'>
        //             {/* <i class="fas fa-question-circle"></i> */}
        //             <BsFillQuestionSquareFill />
        //             <span className='functions'> Questions</span>
        //         </p>
                
        //     </div>
    )
}

export default NavigationFunctions
