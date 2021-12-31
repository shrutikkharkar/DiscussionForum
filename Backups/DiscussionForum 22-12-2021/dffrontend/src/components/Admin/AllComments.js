import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllComments() {

    useEffect(() => {
        getAllCommentDetails()
    }, []);

    const [allCommentDetails, setAllCommentDetails] = useState([])

    async function getAllCommentDetails() {
        try {
            await axios.get('http://localhost:3001/comment/getAllCommentDetails')
            .then((res) => {
                setAllCommentDetails(res.data)
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
                <th scope="col">Comment</th>
                <th scope="col">Email</th>
                
              </tr>
            </thead>
        {
        allCommentDetails.map( (comment, index) => 
        (
            <tbody>
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td>{comment.comment}</td>
                    <td>{comment.email}</td>
                  </tr>
            </tbody>
        ))
        }
            
        </table>
        </div>
    )
}

export default AllComments
