import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import AdminPanel from './AdminPanel'
import 'react-toastify/dist/ReactToastify.css';
import './AllAnswers.css'

function AllAnswers() {

    useEffect(() => {
        getAllAnswerDetails()
    }, []);

    const [allAnswerDetails, setAllAnswerDetails] = useState([])
    const [getToggleState, setToggleState] = useState('') 

    async function getAllAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('allAnswers')
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllBlockedAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllBlockedAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('blockedAnswers')
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function getAllMeBlockedAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllMeBlockedAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
                setToggleState('meBlockedAnswers')
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function removeAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/removeAnswerByAdmin/${answerId}`)
            .then(res => {
                toast.dark(`${res.data}`, {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    async function unblockAnyAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/unblockAnyAnswerByAdmin/${answerId}`)
            .then(res => {

                getAllBlockedAnswerDetails();
                toast.dark(`${res.data}`, {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function unblockMyBlockedAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`http://localhost:3001/answer/unblockMyBlockedAnswerByAdmin/${answerId}`)
            .then(res => {
                getAllMeBlockedAnswerDetails();
                toast.dark(`${res.data}`, {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }
        catch (err) {
            console.error(err);
        }
    }
    return (
    <>
    <div className="allAnswers">

        
        {getToggleState == "allAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllAnswerDetails()} >
                All Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "blockedAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllAnswerDetails()} >
                All Answers
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "meBlockedAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllAnswerDetails()} >
                All Answers
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Answers
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}

        

        <br />
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Sr.no</th>
                    <th scope="col">Answers</th>
                    <th scope="col">Email</th>
                    {getToggleState == "allAnswers" && (
                        <th scope="col">Block Answer</th>
                    )}
                    {getToggleState == "blockedAnswers" && (
                    <>
                        <th scope="col">Blocked by</th>
                        <th scope="col">Unblock Answer</th>
                    </>
                    )}
                    {getToggleState == "meBlockedAnswers" && (
                        <th scope="col">Unblock Answer</th>
                    )}

                </tr>
            </thead>
        {
        allAnswerDetails.map( (answer, index) => 
        (
            <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{answer.answer}</td>
                    <td>{answer.email}</td>

                    {getToggleState == "allAnswers" && (
                    <td><button type="button" onClick={() => removeAnswerByAdmin(answer._id)} class="btn btn-danger">
                        Block Answer
                    </button></td>
                    )}

                    {getToggleState == "blockedAnswers" && (
                    <>

                    <td>{answer.nameOfRemover} ({answer.Class}-{answer.branch})</td>    
                    <td><button type="button" onClick={() => unblockAnyAnswerByAdmin(answer._id)} class="btn btn-danger">
                        Unblock Answer
                    </button></td>

                    </>
                    )}

                    {getToggleState == "meBlockedAnswers" && (
                    <td><button type="button" onClick={() => unblockMyBlockedAnswerByAdmin(answer._id)} class="btn btn-danger">
                        Unblock Answer
                    </button></td>
                    )}
                    
                  </tr>
            </tbody>
        ))
        }
    
    </table> 
    <ToastContainer />   
    </div>
    </>
    )
}

export default AllAnswers
