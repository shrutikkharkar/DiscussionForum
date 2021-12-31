import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllAnswers() {

    useEffect(() => {
        getAllAnswerDetails()
    }, []);

    const [allAnswerDetails, setAllAnswerDetails] = useState([])

    async function getAllAnswerDetails() {
        try {
            await axios.get('http://localhost:3001/answer/getAllAnswerDetails')
            .then((res) => {
                setAllAnswerDetails(res.data)
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
                    <th scope="col">Answer</th>
                    <th scope="col">Email</th>
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
                  </tr>
            </tbody>
        ))
        }
    
    </table>  
    </div>
    )
}

export default AllAnswers
