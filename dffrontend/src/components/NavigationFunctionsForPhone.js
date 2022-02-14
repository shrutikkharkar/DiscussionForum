import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import { BsFillQuestionSquareFill, BsShieldFillCheck } from "react-icons/bs";
import { TiHome } from "react-icons/ti";
import IsAdminContext from '../context/IsAdminContext'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { useMediaQuery } from 'react-responsive'

const NavigationFunctionsForPhone = (props) => {
    
    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

    const history = useHistory();

    const {isAdmin} = useContext(IsAdminContext);

    var shouldDisplay = props.show

    return (
        <>
        {isTabletOrMobile && (

            <SideNav
            onSelect={(selected) => {
                const to = '/' + selected;

                if (to) {
                    history.push(to);
                }
            }}
            
            style={{ backgroundColor: '#242f40', position: 'fixed', display: shouldDisplay}}
            // #c8ccd3;
            className='SideNav'
            expanded={true}
            >      
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="">

                <NavItem eventKey="" style={{color: '#c8ccd3'}} >
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
        </SideNav>
        )}
    </>
)}

export default NavigationFunctionsForPhone
