import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllQuestions() {

    useEffect(() => {
        getAllQuestionDetails()
    }, []);

    const [allQuestionDetails, setAllQuestionDetails] = useState([])

    async function getAllQuestionDetails() {
        try {
            await axios.get('http://localhost:3001/question/getAllQuestionDetails')
            .then((res) => {
                setAllQuestionDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="allAnswers container">

        {getToggleState == "allAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllAnswerDetails()} >
                All Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "blockedAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllAnswerDetails()} >
                All Questions
            </button>
            <button className="allAnswersToggleButtons selectedToggleButton" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllMeBlockedAnswerDetails()} >
                Blocked by me
            </button>
        </div>
        )}
        {getToggleState == "meBlockedAnswers" && (
            <div className="allAnswersToggleBar">
            <button className="allAnswersToggleButtons" onClick={() => getAllAnswerDetails()} >
                All Questions
            </button>
            <button className="allAnswersToggleButtons" onClick={() => getAllBlockedAnswerDetails()} >
                Blocked Questions
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
                <th scope="col">Question</th>
                <th scope="col">Email</th>
                <th scope="col">Question by.</th>
                <th scope="col">Answers</th>
                {getToggleState == "allQuestions" && (
                    <th scope="col">Block Question</th>
                )}
                {getToggleState == "blockedQuestions" && (
                <>
                    <th scope="col">Blocked by</th>
                    <th scope="col">Unblock Question</th>
                </>
                )}
                {getToggleState == "meBlockedQuestions" && (
                    <th scope="col">Unblock Question</th>
                )}
              </tr>
            </thead>

        {
        allQuestionDetails.map( (question, index) => 
        (
            <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{question.question}</td>
                    <td>{question.email}</td>
                    <td>Question by name here</td>
                    <td>{question.answerCount}</td>

                    {getToggleState == "allQuestions" && answer.removed == 0 && (
                    <td><button type="button" onClick={() => removeAnswerByAdmin(question._id)} class="btn btn-secondary">
                        Block Question
                    </button></td>
                    )}

                    {getToggleState == "allQuestions" && answer.removed != 0 && (
                    <td><button type="button" onClick={() => unblockAnyAnswerByAdmin1(question._id)} class="btn btn-danger">
                        Unblock Question
                    </button></td>
                    )}

                    {getToggleState == "blockedQuestions" && (
                    <>

                    <td>{answer.nameOfRemover} ({answer.Class}-{answer.branch})</td>    
                    <td><button type="button" onClick={() => unblockAnyAnswerByAdmin(question._id)} class="btn btn-danger">
                        Unblock Question
                    </button></td>

                    </>
                    )}

                    {getToggleState == "meBlockedQuestions" && (
                    <td><button type="button" onClick={() => unblockMyBlockedAnswerByAdmin(question._id)} class="btn btn-danger">
                        Unblock Question
                    </button></td>
                    )}
                  </tr>
            </tbody>
        ))
        }

        </table>

        <ToastContainer />
        </div>
    )
}

export default AllQuestions
