import React, { Component } from 'react'
import Navbar from './Navbar'
import QuestionList from './QuestionList'
import NavigationFunctions from './NavigationFunctions'

class Home extends Component {
    render() {
        return (
            <div>
                <Navbar name="Shrutik Kharkar"/>
                <QuestionList />
                {/* <NavigationFunctions /> */}
            </div>
        )
    }
}

export default Home
