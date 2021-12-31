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
import AdminPanel from './components/AdminPanel';
import AuthContext from './context/AuthContext';
import IsAdminContext from './context/IsAdminContext';

function Router() {

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    
    return (
        <BrowserRouter>
        <Navbar />
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

                {loggedIn === false && isAdmin === true && (
                    <>
                        <Route path="/login"><Login /></Route>

                        <Route path="/signup"><Signup /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/searchResult"><SearchResult /></Route>

                        <Route path="/comments"><CommentBox /></Route>

                    </>
                )}

                {/* {loggedIn === true && (
                    <>
                        <Route path="/saved"><NavigationFunctions /><Saved /></Route>

                        <Route path="/liked"><NavigationFunctions /><Liked /></Route>

                        <Route path="/answered"><NavigationFunctions /><Answered /></Route>

                        <Route path="/questioned"><NavigationFunctions /><Questioned /></Route>

                        <Route exact path="/"><NavigationFunctions /><Home /></Route>

                        <Route path="/topqans"><NavigationFunctions /><TopQAns /></Route>

                        <Route path="/searchResult"><NavigationFunctions /><SearchResult /></Route>

                        <Route path="/comments"><CommentBox /></Route>
                    </>
                )} */}

                {loggedIn === true && isAdmin === true && (
                    <>
                        <Route path="/saved"><NavigationFunctions /><Saved /></Route>

                        <Route path="/liked"><NavigationFunctions /><Liked /></Route>

                        <Route path="/answered"><NavigationFunctions /><Answered /></Route>

                        <Route path="/questioned"><NavigationFunctions /><Questioned /></Route>

                        <Route exact path="/"><NavigationFunctions /><Home /></Route>

                        <Route path="/topqans"><NavigationFunctions /><TopQAns /></Route>

                        <Route path="/searchResult"><NavigationFunctions /><SearchResult /></Route>

                        <Route path="/comments"><CommentBox /></Route>

                        <Route path="/adminPanel"><AdminPanel /></Route>
                    </>
                )}

                {loggedIn === true && isAdmin === false && (
                    <>
                        <Route path="/saved"><NavigationFunctions /><Saved /></Route>

                        <Route path="/liked"><NavigationFunctions /><Liked /></Route>

                        <Route path="/answered"><NavigationFunctions /><Answered /></Route>

                        <Route path="/questioned"><NavigationFunctions /><Questioned /></Route>

                        <Route exact path="/"><NavigationFunctions /><Home /></Route>

                        <Route path="/topqans"><NavigationFunctions /><TopQAns /></Route>

                        <Route path="/searchResult"><NavigationFunctions /><SearchResult /></Route>

                        <Route path="/comments"><CommentBox /></Route>
                    </>
                )}


            </Switch>
        </BrowserRouter>
    )
}

export default Router

