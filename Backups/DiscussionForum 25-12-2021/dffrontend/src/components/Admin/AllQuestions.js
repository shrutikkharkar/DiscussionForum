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
        <div className="container">
        <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.no</th>
                <th scope="col">Question</th>
                <th scope="col">Email</th>
                <th scope="col">Answers</th>
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
                    <td>{question.answerCount}</td>
                  </tr>
            </tbody>
        ))
        }

        </table>
        </div>
    )
}

export default AllQuestions
