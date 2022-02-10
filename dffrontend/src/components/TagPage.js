import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import './TopQAns.css'
import './TagPage.css'
import './QuestionList.css'
import AuthContext from '../context/AuthContext'
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { MdBlock, MdReportProblem, MdVerified, MdRemoveCircle, MdOutlinedFlag } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import IsAdminContext from '../context/IsAdminContext';
import {Link, Router, useHistory} from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory';
import {createBrowserHistory} from 'history';
import { ToastContainer, toast } from 'react-toastify';
import Dropdown from "react-bootstrap/Dropdown";
import 'react-toastify/dist/ReactToastify.css';
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import VCETLogo from '../Images/VCETLogo.svg'
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';

function TagPage() {

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    const [gotTagDetails, setGotTagDetails] = useState(false)
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')
    // const history = createHistory();  
    let history = useHistory();
    // const history = createBrowserHistory({forceRefresh:true})
    const queryParams = new URLSearchParams(window.location.search);
    const getTagnameFromUrl = queryParams.get('tagName')
    const [tagName, setTagName] = useState('')
    const [allTagDetails, setAllTagDetails] = useState([])
    const [modal, setModal] = useState(false);
    const [answerByIdForNotification, setAnswerByIdForNotification] = useState('')
    const [answerIdForComment, setAnswerIdForComment] = useState('')
    const [questionID, setQuestionID] = useState('')
    const [answerForComment, setAnswerForComment] = useState('');

    useEffect(() => {
        getTagDetails(getTagnameFromUrl)
        setTagName(getTagnameFromUrl)
    }, []);

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <span
          ref={ref}
          onClick={e => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
          <HiDotsVertical className="menuIcon" />
        </span>
      ));


      async function gotoAnswers(questionId) {
        history.push( `/topqans/?query=${questionId}` );
        try {
            await axios.post(`${BEHOST}:${BEPORT}/question/addView/${questionId}`)
        }
        catch (err) {
            console.error(err);
        }
    }
    
    async function removeQuestionByAdmin(quesId) {
    
        try {
            const questionId = quesId
    
            await axios.post(`${BEHOST}:${BEPORT}/question/removeQuestionByAdmin/${questionId}`)
            .then(res => {
                getTagDetails()
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
      
    
    async function reportQuestionByUser(quesId) {
    
        try {
            const questionId = quesId
    
            await axios.post(`${BEHOST}:${BEPORT}/question/reportQuestionByUser/${questionId}`)
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
   

    async function getTagDetails(tagName){
        setGotTagDetails(false)
        try{
            if(loggedIn === false){
                await axios.get(`${BEHOST}:${BEPORT}/tag/getTagDetails/${tagName}`)
                .then(res => {
                setGotTagDetails(true)
                setAllTagDetails(res.data)
                console.log(res.data)
                })
            }

            if(loggedIn === true){
                await axios.get(`${BEHOST}:${BEPORT}/tag/getTagDetailsForUser/${tagName}`)
                .then(res => {
                setGotTagDetails(true)
                setAllTagDetails(res.data)
                console.log(res.data)
                })
            }
            
        }
        catch (err) {
            console.error(err);
        }
    }


    async function writeComment(e) {
        e.preventDefault()

        try {

            const answeredById = answerByIdForNotification
            const commentData = {comment, questionID, answeredById};
            
            await axios.post(`${BEHOST}:${BEPORT}/comment/addComment/${answerIdForComment}`, commentData)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment) 
                toast.success(`${res.data}`, {
                    position: "top-center",
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


    async function likeAnswer(ansId, answeredById) {
        
        try {
            const notificationData = {answeredById}

            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/like/${answerId}`, notificationData)
            .then(res => {
                getTagDetails()
            })

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeLike(answerId) {
        try {
            axios.post(`${BEHOST}:${BEPORT}/answer/removeLike/${answerId}`)
            .then(res => {
                getTagDetails()
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function dislikeAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/dislike/${answerId}`)
            .then(res => {
                getTagDetails()
            })

        }
        catch (err) {
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeDislike(answerId) {
        try {
            axios.post(`${BEHOST}:${BEPORT}/answer/removeDislike/${answerId}`)
            .then(res => {
                getTagDetails()
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    async function saveAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/save/${answerId}`)
            .then(res => {
                getTagDetails()
                toast.success('Saved answer successfully!', {
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
            //alert("Login or Register first")
            console.error(err);
        }
    }

    function removeSave(answerId) {

        try{
            axios.post(`${BEHOST}:${BEPORT}/answer/removeSave/${answerId}`)
            .then(res => {
                getTagDetails()
                toast.dark('Removed saved answer!', {
                    position: "bottom-left",
                    autoClose: 2000,
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

    async function removeAnswerByAdmin(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/removeAnswerByAdmin/${answerId}`)
            .then(res => {
                getTagDetails()
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

    async function deleteComment(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`${BEHOST}:${BEPORT}/comment/deleteComment/${commentId}`)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment)
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

    async function reportAnswerByUser(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/reportAnswerByUser/${answerId}`)
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

    async function removeQuestionByAdmin(quesId) {

        try {
            const questionId = quesId

            await axios.post(`${BEHOST}:${BEPORT}/question/removeQuestionByAdmin/${questionId}`)
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

    async function reportQuestionByUser(quesId) {

        try {
            const questionId = quesId

            await axios.post(`${BEHOST}:${BEPORT}/question/reportQuestionByUser/${questionId}`)
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


    async function removeCommentByAdmin(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`${BEHOST}:${BEPORT}/comment/removeCommentByAdmin/${commentId}`)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment)
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

    async function reportCommentByUser(cmtId) {

        try {
            const commentId = cmtId

            await axios.post(`${BEHOST}:${BEPORT}/comment/reportCommentByUser/${commentId}`)
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




    async function getComments(ansId, answeredById, answerForCommentHeader, questionID){
        setQuestionID(questionID)
        setAnswerForComment(answerForCommentHeader);
        const answerId = ansId
        setAnswerIdForComment(answerId)
        setAnswerByIdForNotification(answeredById)
        setModal(true)
        
        try 
        { 
            if(loggedIn===true){
                await axios.get(`${BEHOST}:${BEPORT}/comment/getCommentsForUser/${answerId}`)
                .then(response => {
                    setComments(response.data);
                    console.log(response.data);
                    
                })
            }
            else{
                await axios.get(`${BEHOST}:${BEPORT}/comment/getComments/${answerId}`)
                .then(response => {
                    setComments(response.data);
                })
            }
        } 
        catch (err) {
            console.error(err);
        }     
    }

    
    function getTagContents(tagName){
        // history.push( `/tagPage/?tagName=${tagName}` );
        setTagName(tagName)
        getTagDetails(tagName)
    }

    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Puff width="50" />
      });

    if(gotTagDetails === false) {
      return ( 
        <div className="container tagPageMainDiv">
          <section className="classForLoader" {...containerProps}>
              {indicatorEl}
          </section>
        </div>
      )
    }
    else
    {

  return (
      <div className="container tagPageMainDiv">
          <h1>#{tagName}</h1>
          <br />
          {
            allTagDetails
            .map(tagDetail => (
            <>
            {tagDetail.type == 'answer' && (
                <div className="tileForAnswers">
                <div style={{cursor: 'pointer'}} onClick={() => {history.push(`/topqans/?query=${tagDetail.questionID}`)}}><b>Question: </b>{tagDetail.question}</div><br />

                <div className="answeredByName">
                <span className="answeredBy">{tagDetail.fullName}</span>
                <span className="answeredBy"  style={{ marginLeft: '10px'}}>({tagDetail.Class} - {tagDetail.branch})
                {
                    tagDetail.isAdmin === true && (
                        <>
                            &nbsp;
                            <MdVerified className="verifiedIcon" />
                        </>
                    )
                }
                {
                    tagDetail.isAdmin === false && tagDetail.isCollegeId === true && (
                        <>
                            &nbsp;&nbsp;
                            {/* College logo here */}
                            <img
                              src={VCETLogo}
                              style={{ height: 20, width: 20 }}
                              alt="Verified college Id"
                            />
                        </>
                    )
                }
                </span>  
            </div>


            <div key={tagDetail.id}>
            <div className="answerOnTopQAns">
                <span style={{fontSize: '1.3rem'}} className="tagDetail" dangerouslySetInnerHTML={{ __html: tagDetail.answer }} />
                    
            </div>
            {tagDetail.tagsForAnswer && (
            <>
                <p className="tagClassPTag ">
                {tagDetail.tagsForAnswer.map(tag => (
                    <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                ))} 
                </p>
            </>
            )}
            
            
        
            <div>
                {
                    tagDetail.liked === true && (
                    <>
                        <BiLike className="likeIcon liked" onClick={() => removeLike(tagDetail.answerId)} />
                        <span className="vote_count"> {tagDetail.likeCount}</span>
                        <span>&nbsp; &nbsp;</span>
                        
                    </>
                    )
                }
                {
                    tagDetail.liked === false && (
                    <>
                        <BiLike className="likeIcon" onClick={() => likeAnswer(tagDetail.answerId, tagDetail.answeredById)} />
                        <span className="vote_count"> {tagDetail.likeCount}</span>
                        <span>&nbsp; &nbsp;</span>
                    </>
                    )
                }
                {
                    loggedIn === false && (
                    <>
                        <BiLike className="likeIcon" onClick={() => likeAnswer(tagDetail.answerId)} />
                        <span className="vote_count"> {tagDetail.likeCount}</span>
                        <span>&nbsp; &nbsp;</span>
                    </>
                    )
                }
                
                {
                    tagDetail.disliked === true && (
                        <>
                            <BiDislike className="dislikeIcon disliked" onClick={() => removeDislike(tagDetail.answerId)} />
                            <span className="vote_count"> {tagDetail.dislikeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                        </>
                    )
                }
                {
                    tagDetail.disliked === false && (
                        <>
                            <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(tagDetail.answerId)} />
                            <span className="vote_count"> {tagDetail.dislikeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                        </>
                    )
                } 
                {
                    loggedIn === false && (
                    <>
                        <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(tagDetail.answerId)} />
                        <span className="vote_count"> {tagDetail.dislikeCount}</span>
                        <span>&nbsp;&nbsp;</span>
                    </>
                    )
                }
                
           
                <BiCommentDetail className="commentIcon" onClick={() => getComments(tagDetail.answerId, tagDetail.answeredById, tagDetail.answer, tagDetail.questionID)} />
                <span className="comment_count"> {tagDetail.commentCount}</span>
                <span>&nbsp; &nbsp;</span>

                {loggedIn===true && isAdmin===true && (
                <Dropdown style={{display: 'inline'}}>
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                      <Dropdown.Item onClick={() => removeAnswerByAdmin(tagDetail.answerId)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block answer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                )}

                {loggedIn===true && isAdmin===false && (
                <Dropdown style={{display: 'inline'}}>
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                      <Dropdown.Item onClick={() => reportAnswerByUser(tagDetail.answerId)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} /> Report answer</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> 
                )}

                {
                    tagDetail.saved === true && (
                    <span>
                        <BiBookmark onClick={() => removeSave(tagDetail.answerId)} className="bookmark saved" />
                    </span>
                    )
                }
                {
                    tagDetail.saved === false && (
                    <span>
                        <BiBookmark onClick={() => saveAnswer(tagDetail.answerId)} className="bookmark" />
                    </span>
                    )
                }
                
            </div>

            <PureModal
                header={answerForComment}

                className="modal-body"

            width={"1000px"}
            scrollable={true}
              footer={
                <form onSubmit={writeComment}>
                <div className="form-group" >
                    <input type="text" onChange={(e) => setComment(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="1"
                    placeholder="Write a comment..."></input>
                    <br />
                    <button type="submit" className="btn btn-secondary">Post</button>
                    
                    
                </div>
            </form>}

            onClose={() => {
                setModal(false);
                return true;
            }}
            closeButton={<AiFillCloseCircle style={{fontSize: '2rem'}} />}
            closeButtonPosition="header"

              isOpen={modal}
            >
              
              <div>
                      {comments.map(comment => (
                        <>
                        <span style={{color:"dodgerblue"}}>{comment.fullName} ({comment.Class} - {comment.branch})</span>
                        {
                            comment.isAdmin === true && (
                            <>
                                &nbsp;
                                <MdVerified className="verifiedIcon" />
                            </>
                            )
                        }
                        {
                            comment.isAdmin === false && tagDetail.isCollegeId === true && (
                                <>
                                    &nbsp;
                                    <img
                                      src={VCETLogo}
                                      style={{ height: 20, width: 20 }}
                                      alt="Verified college Id"
                                    />
                                </>
                            )
                        }
                        &nbsp;&nbsp;
                        <span key={comment.id}>
                          {comment.comment}

                          {loggedIn===true && isAdmin===true && (
                            <Dropdown style={{display: 'inline', float: 'right'}}>
                                <Dropdown.Toggle as={CustomToggle} />
                                <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                                  <Dropdown.Item onClick={() => removeCommentByAdmin(comment._id)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block Comment</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            )}

                            {loggedIn===true && isAdmin===false && (
                            <Dropdown style={{display: 'inline', float: 'right'}}>
                                <Dropdown.Toggle as={CustomToggle} />
                                <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                                  <Dropdown.Item onClick={() => reportCommentByUser(comment._id)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} /> Report Comment</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> 
                            )}
                            
                          {comment.commentedByMe == true && (
                              <MdRemoveCircle className="deleteCommentIcon" onClick={() => deleteComment(comment._id)} />
                          )}

                        

                        </span>
                        <hr />
                        </>
                      ))}

                    {comments.length == 0 && (
                      <>
                      <p>No comments yet...</p>
                      </>
                    )}
                    
                    </div>


            </PureModal>

            </div>

            </div>
            )}


            {/* FOR QUESTION */}
            {tagDetail.type == 'question' && (
                <div className="tileForAnswers">
                <div className="questionBlock" key={tagDetail.id}>
                   <div className="specialBlock"> 
    
                    < div className="statsBlock">
                        <div className="answerCount">
                            <p>{tagDetail.answerCount}</p>
                            <p className="countStat">Answers</p>
                        </div>
                        <div className="viewCount">
                            <p>{tagDetail.viewCount}</p>
                            <p className="countStat">Views</p>
                        </div>
                        <div className="voteCount">
                            <p>{tagDetail.likeCount + tagDetail.dislikeCount}</p>
                            <p className="countStat">Votes</p>
                        </div>
    
                        {loggedIn===true && isAdmin===true && (
                  
                  <Dropdown className="menuIconQuestionPageForPhone">
                      <Dropdown.Toggle as={CustomToggle} />
                      <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                        <Dropdown.Item onClick={() => removeQuestionByAdmin(tagDetail.questionID)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block Question</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
    
              )}
    
              {loggedIn===true && isAdmin===false && (
              
                  <Dropdown className="menuIconQuestionPageForPhone">
                      <Dropdown.Toggle as={CustomToggle} />
                      <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                        <Dropdown.Item onClick={() => reportQuestionByUser(tagDetail.questionID)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} />  Report tagDetail</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
    
              )}
              
                    </div>
    
                    
    
                    <p className="questionDiscussion">
                        <a onClick={(e) => gotoAnswers(tagDetail.questionID)} style={{color: 'royalblue'}} >
                             {tagDetail.question}
                        </a>
                        {tagDetail.tagsForQuestion && (
                        <>
                            <p className="tagClassPTag">
                            {tagDetail.tagsForQuestion.map(tag => (
                                <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                            ))} 
                            </p>
                        </>
                        )}
                    </p>
    
                    </div>
                    {/* End of special block */}
    
                    <div className="specialBlockDate">            
                    <div className="updateDate">
                        <p className="updatedOnText">Asked on: </p>
                        <span className="updatedOnDateforPhone">Asked on: {tagDetail.getDate}</span>
                        <p className="updatedOnDate updatedOnDateforPC">{tagDetail.getDate}</p> 
                    </div>
    
                    {loggedIn===true && isAdmin===true && (
                  
                        <Dropdown className="menuIconQuestionPage">
                            <Dropdown.Toggle as={CustomToggle} />
                            <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                              <Dropdown.Item onClick={() => removeQuestionByAdmin(tagDetail.questionID)}><MdBlock style={{fontSize: '1.1rem'}}  /> Block Question</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
    
                    )}
    
                    {loggedIn===true && isAdmin===false && (
    
                        <Dropdown className="menuIconQuestionPage">
                            <Dropdown.Toggle as={CustomToggle} />
                            <Dropdown.Menu className="dropdown-styling" size="sm" title="">
                              <Dropdown.Item onClick={() => reportQuestionByUser(tagDetail.questionID)}><MdOutlinedFlag style={{fontSize: '1.3rem'}} />  Report tagDetail</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
    
                    )}
                    </div>
        
                </div>
                
            </div>
            )}

        </>
        )) //map
        }
        <ToastContainer />
      </div> //container
  ) //return

}}

export default TagPage;
