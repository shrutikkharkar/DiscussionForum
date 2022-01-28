import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import './TagPage.css'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import {Link, Router, useHistory} from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory';
import {createBrowserHistory} from 'history';
import { ToastContainer, toast } from 'react-toastify';

function TagPage() {

    useEffect(() => {
        getTagDetails()
    }, []);

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    // const history = createHistory();  
    let history = useHistory();
    // const history = createBrowserHistory({forceRefresh:true})
    const queryParams = new URLSearchParams(window.location.search);
    const tagName = queryParams.get('tagName')
    const [allTagDetails, setAllTagDetails] = useState([])

    async function getTagDetails(){
        const tagName1 = queryParams.get('tagName')
        try{
            await axios.get(`http://localhost:3001/tag/getTagDetails/${tagName1}`)
            .then(res => {
                setAllTagDetails(res.data)
                console.log(res.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    function getTagContents(tagName){
        history.push( `/tagPage/?tagName=${tagName}` );
        getTagDetails()
    }

  return (
      <div className="container">
          <h1>{tagName}</h1>
          {
            allTagDetails.map(tagDetail => (
            <>
                {tagDetail.answer && (
                      <p><b>Answer: </b> {tagDetail.answer}</p>
                )}
                {tagDetail.question && (
                      <p><b>Question: </b>{tagDetail.question}</p>
                )}

                {tagDetail.tagsForQuestion && (
                <>
                    <p className="tagClassPTag">
                    {tagDetail.tagsForQuestion.map(tag => (
                        <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                    ))} 
                    </p>
                </>
                )}
                {tagDetail.tagsForAnswer && (
                <>
                    <p className="tagClassPTag">
                    {tagDetail.tagsForAnswer.map(tag => (
                        <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                    ))} 
                    </p>
                </>
                )}

                <hr />
            </>  
            ))
          }
      </div>
  );

}

export default TagPage;
