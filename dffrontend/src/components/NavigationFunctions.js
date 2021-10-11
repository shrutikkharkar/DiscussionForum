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

    function sendToQuestioned(){
        history.push('/questioned');
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

                <p onClick={sendToQuestioned} className='function-questioned-icon'>
                    <i class="fas fa-question-circle"></i>
                    <span className='functions'> Questions</span>
                </p>
                
            </div>
    )
}

export default NavigationFunctions
