import React, {useContext} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import TopQAns from './components/TopQAns';
import AskQuestion from './components/AskQuestion';
import Saved from './components/Saved';
import Liked from './components/Liked';
import Answered from './components/Answered';
import Questioned from './components/Questioned';
import NavigationFunctions from './components/NavigationFunctions';
import NavigationFunctionsForPhone from './components/NavigationFunctionsForPhone';
import UpdateProfile from './components/UpdateProfile';
import ResetPassword from './components/ResetPassword';
import TagPage from './components/TagPage';
import SearchResult from './components/SearchResult';

import AllAnswers from './components/Admin/AllAnswers';
import AllComments from './components/Admin/AllComments'
import AllQuestions from './components/Admin/AllQuestions';
import AllFlags from './components/Admin/AllFlags';
import AllUsers from './components/Admin/AllUsers';

import AuthContext from './context/AuthContext';
import IsAdminContext from './context/IsAdminContext';

import Error404 from './Images/Error404.svg';

function Router() {

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);

    
    const ShowError404 = () => 
    <div className="container" style={{display: 'flex', justifyContent: 'center'}}>
        <img
          src={Error404}
          style={{}}
          alt="Error 404"
        />
    </div>
    
     
    
    return (
        <BrowserRouter>
        <Navbar />
        <Route path="/tagPage"><TagPage /></Route>
        <Route path="/searchResult"><SearchResult /></Route>
            <Switch>

                {loggedIn === false && isAdmin === false && (
                    <>
                    
                        <Route path="/login"><Login /></Route>

                        <Route path="/signup"><Signup /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/askQuestion"><AskQuestion /></Route>

                        <Route path="/resetPassword"><ResetPassword /></Route>

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

                        <Route path="/askQuestion"><AskQuestion /></Route>

                        <Route path="/updateProfile"><UpdateProfile /></Route>


                        {/* Admin side */}

                        <Route path="/allAnswers"><AllAnswers /></Route>

                        <Route path="/allComments"><AllComments /></Route>

                        <Route path="/allQuestions"><AllQuestions /></Route>

                        <Route path="/allFlags"><AllFlags /></Route>

                        <Route path="/allUsers"><AllUsers /></Route>

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

                        <Route path="/askQuestion"><AskQuestion /></Route>

                        <Route path="/updateProfile"><UpdateProfile /></Route>


                        {/* ERROR Admin side */}
                        <Route path="/admin"><ShowError404 /></Route>

                        <Route path="/allAnswers"><ShowError404 /></Route>

                        <Route path="/allComments"><ShowError404 /></Route>

                        <Route path="/allQuestions"><ShowError404 /></Route>

                        <Route path="/allFlags"><ShowError404 /></Route>

                        <Route path="/allUsers"><ShowError404 /></Route>

                        <Route path="/allAdmins"><ShowError404 /></Route>

                        <Route path="/login"><ShowError404 /></Route>

                        <Route path="/signup"><ShowError404 /></Route>
                    </>
                )}


            </Switch>
        </BrowserRouter>
    )
}

export default Router

