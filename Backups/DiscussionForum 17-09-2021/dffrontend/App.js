import Home from './components/Home'
import Navbar from './components/Navbar'
import QuestionList from './components/QuestionList';
import Login from './components/Login';
import Signup from './components/Signup';
import TopQAns from './components/TopQAns';
import SearchResult from './components/SearchResult';
import Saved from './components/Saved';
import Liked from './components/Liked';
import Answered from './components/Answered';
import React from 'react';
import { BrowserRouter as Router ,Route, Link, useHistory} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path = '/' component = {Home} />
        <Route exact path = '/login' component = {Login} />
        <Route exact path = '/signup' component = {Signup} />
        <Route exact path = '/topqans' component = {TopQAns} />
        <Route exact path = '/searchResult' component = {SearchResult} />
        <Route exact path = '/saved' component = {Saved} />
        <Route exact path = '/liked' component = {Liked} />
        <Route exact path = '/answered' component = {Answered} />
        {/* <Route exact path = '/signup/:id' component = {SignupEdit} /> */}
      </Router>
    </div>
  );
}

export default App;
