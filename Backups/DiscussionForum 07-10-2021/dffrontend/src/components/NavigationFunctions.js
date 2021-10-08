import React from 'react'
import {useHistory} from 'react-router-dom'
import './NavigationFunctions.css'



function NavigationFunctions() {

    const history = useHistory();

    function sendToSaved(){
        history.push('/saved');
    }
    function sendToLiked(){
        history.push('/liked');
    }
    function sendToAnswered(){
        history.push('/answered');
    }

    return (
        <div className="navigation-functions-div">
                
                <p onClick={sendToSaved} className='function-saved-icon'>
                    <i className="fas fa-bookmark"></i>
                    <span className='functions'> Saved</span>
                </p>

                <p onClick={sendToLiked} className='function-like-icon'>
                    <i className="fas fa-heart"></i>
                    <span className='functions'> Liked</span>
                </p>

                <p onClick={sendToAnswered} className='function-answered-icon'>
                    <i className="fas fa-check-square"></i>
                    <span className='functions'> Answered</span>
                </p>
                
            </div>
    )
}

export default NavigationFunctions




// import React, { Component } from 'react'
// import './NavigationFunctions.css'

// class NavigationFunctions extends Component {


//     constructor(props) {
//         super(props)
    
//         this.state = {
             
//         }
//     }
    
//     sendToSaved(){
//         window.location.href = '/saved'
//     }

//     sendToLiked(){
//         window.location.href = '/liked'
//     }

//     sendToAnswered(){
//         window.location.href = '/answered'
//     }

//     render() {
//         return (
//             <div className="navigation-functions-div">
                
//                 <p onClick={this.sendToSaved} className='function-saved-icon'>
//                     <i className="fas fa-bookmark"></i>
//                     <span className='functions'> Saved</span>
//                 </p>

//                 <p onClick={this.sendToLiked} className='function-like-icon'>
//                     <i className="fas fa-heart"></i>
//                     <span className='functions'> Liked</span>
//                 </p>

//                 <p onClick={this.sendToAnswered} className='function-answered-icon'>
//                     <i className="fas fa-check-square"></i>
//                     <span className='functions'> Answered</span>
//                 </p>
                
//             </div>
//         )
//     }
// }

// export default NavigationFunctions

