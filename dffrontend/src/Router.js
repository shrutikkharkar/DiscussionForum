import React, {useContext} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import TopQAns from './components/TopQAns';
import SearchResult from './components/SearchResult';
import Saved from './components/Saved';
import Liked from './components/Liked';
import Answered from './components/Answered';
import Questioned from './components/Questioned';
import NavigationFunctions from './components/NavigationFunctions';
import CommentBox from './components/CommentBox';
import UpdateProfile from './components/UpdateProfile';
import TagPage from './components/TagPage';

import AdminPanel from './components/Admin/AdminPanel';
import AllAnswers from './components/Admin/AllAnswers';
import AllComments from './components/Admin/AllComments'
import AllQuestions from './components/Admin/AllQuestions';
import AllFlags from './components/Admin/AllFlags';
import AllUsers from './components/Admin/AllUsers';
import AllAdmins from './components/Admin/AllAdmins';

import AuthContext from './context/AuthContext';
import IsAdminContext from './context/IsAdminContext';

function Router() {

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    
    return (
        <BrowserRouter>
        <Navbar />
        <Route path="/tagPage"><TagPage /></Route>
            <Switch>

                {loggedIn === false && isAdmin === false && (
                    <>
                        <Route path="/login"><Login /></Route>

                        <Route path="/signup"><Signup /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/searchResult"><SearchResult /></Route>

                        <Route path="/comments"><CommentBox /></Route>

                    </>
                )}


                {loggedIn === true && isAdmin === true && (
                    <>
                        <NavigationFunctions />

                        <Route path="/saved"><Saved /></Route>

                        <Route path="/liked"><Liked /></Route>

                        <Route path="/answered"><Answered /></Route>

                        <Route path="/questioned"><Questioned /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/searchResult"><SearchResult /></Route>

                        <Route path="/updateProfile"><UpdateProfile /></Route>



                        <Route path="/admin"><AdminPanel /></Route>

                        <Route path="/allAnswers"><AllAnswers /></Route>

                        <Route path="/allComments"><AllComments /></Route>

                        <Route path="/allQuestions"><AllQuestions /></Route>

                        <Route path="/allFlags"><AllFlags /></Route>

                        <Route path="/allUsers"><AllUsers /></Route>

                        <Route path="/allAdmins"><AllAdmins /></Route>
                    </>
                )}


                {loggedIn === true && isAdmin === false && (
                    <>
                        <NavigationFunctions />

                        <Route path="/saved"><Saved /></Route>

                        <Route path="/liked"><Liked /></Route>

                        <Route path="/answered"><Answered /></Route>

                        <Route path="/questioned"><Questioned /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/searchResult"><SearchResult /></Route>

                        <Route path="/updateProfile"><UpdateProfile /></Route>
                    </>
                )}


            </Switch>
        </BrowserRouter>
    )
}

export default Router

