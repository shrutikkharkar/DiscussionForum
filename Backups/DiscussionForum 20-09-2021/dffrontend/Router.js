import React, {useContext} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login';
import Signup from './components/Signup';
import TopQAns from './components/TopQAns';
import SearchResult from './components/SearchResult';
import Saved from './components/Saved';
import Liked from './components/Liked';
import Answered from './components/Answered';
import QuestionList from './components/QuestionList';
import AuthContext from './context/AuthContext';

function Router() {

    const {loggedIn} = useContext(AuthContext);
    
    return (
        <BrowserRouter>
        <Navbar />
            <Switch>

                {loggedIn === false && (
                    <>
                        <Route path="/login"><Login /></Route>

                        <Route path="/signup"><Signup /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/searchResult"><SearchResult /></Route>


                    </>
                )}

                {loggedIn === true && (
                    <>
                        <Route path="/saved"><Saved /></Route>

                        <Route path="/liked"><Liked /></Route>

                        <Route path="/answered"><Answered /></Route>

                        <Route exact path="/"><Home /></Route>

                        <Route path="/topqans"><TopQAns /></Route>

                        <Route path="/searchResult"><SearchResult /></Route>
                    </>
                )}


            </Switch>
        </BrowserRouter>
    )
}

export default Router



{/* <Router>
  <Route exact path = '/' component = {Home} />
</Router> */}
