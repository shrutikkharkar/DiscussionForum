import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import './TopQAns.css'
import AuthContext from '../context/AuthContext'
import IsAdminContext from '../context/IsAdminContext';
import { BiLike, BiDislike, BiCommentDetail, BiBookmark } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { MdBlock, MdReportProblem, MdVerified, MdRemoveCircle, MdOutlinedFlag } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import {Link, useHistory} from 'react-router-dom'
import { RiArrowDropDownLine, RiProfileFill } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import Dropdown from "react-bootstrap/Dropdown";
import 'react-toastify/dist/ReactToastify.css';
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import VCETLogo from '../Images/VCETLogo.svg'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';

import { Pagination } from "react-pagination-bar"
import 'react-pagination-bar/dist/index.css'






function Answered() {

    useEffect(() => {
        getAnswers()
        getAllTagNames()
    }, []);

    const BEPORT = process.env.REACT_APP_BEPORT
    const BEHOST = process.env.REACT_APP_BEHOST
    const FEPORT = process.env.REACT_APP_FEPORT
    const FEHOST = process.env.REACT_APP_FEHOST


    const {loggedIn} = useContext(AuthContext);
    const {isAdmin} = useContext(IsAdminContext);
    const history = useHistory();

    const [comment, setComment] = useState('')
    const [questionID, setQuestionID] = useState()
    const [answerByIdForNotification, setAnswerByIdForNotification] = useState('')
    
    const [currentPage, setCurrentPage] = useState(1);
    const pagePostsLimit = 5;

    const [answerIdForComment, setAnswerIdForComment] = useState('')
    const [answers, setAnswers] = useState([])
    const [comments, setComments] = useState([]);
    const [allTagNames, setAllTagNames] = useState([]);
    const [answerForComment, setAnswerForComment] = useState('');

    const [modal, setModal] = useState(false);
    const [modalForUpdateAnswer, setModalForUpdateAnswer] = useState(false);

    const [gotAnswers, setGotAnswers] = useState(false);

    // For block btn
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

      const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Puff width="50" />
      });

        
      
      const baseTagifySettings = {
        blacklist: ["xxx", "yyy", "zzz"],
        whitelist: allTagNames,
        maxTags: 6,
        placeholder: "add tags (optional)",
        dropdown: {
        }
      }

    const tagifyRef1 = useRef()
    const tagifyRefDragSort = useRef()

    const [tagifySettings, setTagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState({})

    const settings = {
        ...baseTagifySettings,
        ...tagifySettings
    }




    
    // access Tagify internal methods example:
    const clearAll = () => {
      tagifyRef1.current && tagifyRef1.current.removeAllTags()
    }


    async function getAllTagNames() {
        try {
            await axios.get(`${BEHOST}:${BEPORT}/tag/getAllTagNames`)
            .then(response => {
                setAllTagNames(response.data);
            })
        }
        catch (err) {
            console.error(err);
        }
    }


    async function getAnswers() {
        try 
        {
            await axios.get(`${BEHOST}:${BEPORT}/answer/getAnswered`)
            .then(response => {
                setAnswers(response.data);
                // console.log(response.data);
                setGotAnswers(true);
            })
        }
        catch (err) {
            console.error(err);
        }
    }



    async function writeComment(e) {
        e.preventDefault()

        try {

            const answeredById = answerByIdForNotification
            const commentData = {comment, answeredById, questionID};
            
            await axios.post(`${BEHOST}:${BEPORT}/comment/addComment/${answerIdForComment}`, commentData)
            .then(res => {
                getComments(answerIdForComment, answerByIdForNotification, answerForComment, questionID)
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
            alert("Login or Register first")
            console.error(err);
        }
    }


    async function likeAnswer(ansId, answeredById) {

        try {
            const notificationData = {answeredById}

            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/like/${answerId}`, notificationData)
            .then(res => {
                getAnswers()

                toast.success('Liked successfully!', {
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
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeLike(answerId) {
        try {
            axios.post(`${BEHOST}:${BEPORT}/answer/removeLike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.dark('Removed Like!', {
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

    async function dislikeAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/dislike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.success('Disliked answer successfully!', {
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
            alert("Login or Register first")
            console.error(err);
        }
    }

    function removeDislike(answerId) {
        try {
            axios.post(`${BEHOST}:${BEPORT}/answer/removeDislike/${answerId}`)
            .then(res => {
                getAnswers()
                toast.dark('Removed dislike!', {
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

    async function saveAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/save/${answerId}`)
            .then(res => {
                getAnswers()
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
            console.error(err);
        }
    }

    function removeSave(answerId) {

        try{
            axios.post(`${BEHOST}:${BEPORT}/answer/removeSave/${answerId}`)
            .then(res => {
                getAnswers()
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

    async function deleteAnswer(ansId) {

        try {
            const answerId = ansId

            await axios.post(`${BEHOST}:${BEPORT}/answer/deleteAnswer/${answerId}`)
            .then(res => {
                getAnswers()
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
                getComments(answerIdForComment, answerByIdForNotification, answerForComment, questionID)
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
                getComments(answerIdForComment, answerByIdForNotification, answerForComment, questionID)
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
            await axios.get(`${BEHOST}:${BEPORT}/comment/getCommentsForUser/${answerId}`)
            .then(response => {
                setComments(response.data);
                console.log(response.data);
                
            })
            
        } 
        catch (err) {
            console.error(err);
        }     
    }

    
    var [getTagsForAnswer, setTagsForAnswer] = useState([]);
    const [wasTagUpdated, setWasTagUpdated] = useState(false);

    const onChange = useCallback(e => {
        setTagsForAnswer(e.detail.tagify.value)
        setWasTagUpdated(true)
    }, [])


    const [answerForUpdate, setAnswerForUpdate] = useState('')
    const [answerIdForUpdate, setAnswerIdForUpdate] = useState('')
    const [tagsForAnswerUpdate, setTagsForAnswerUpdate] = useState([])

    function openUpdateModal(ansId, answer, tagsForAnswer){
     
        setModalForUpdateAnswer(true)
        setAnswerForUpdate(answer)
        setAnswerIdForUpdate(ansId)
        setTagsForAnswerUpdate(tagsForAnswer)
        setWasTagUpdated(false)

    }

    

    async function updateAnswer(e) {
        e.preventDefault()
        try{
            const answerId = answerIdForUpdate
            const answer = answerForUpdate

            if(wasTagUpdated === false) {
                let tagsForAnswer = tagsForAnswerUpdate
                const answerData = {answer, tagsForAnswer };
            
                await axios.post(`${BEHOST}:${BEPORT}/answer/updateAnswer/${answerId}`, answerData)
                .then(res => {
                    getAnswers()
                    setModalForUpdateAnswer(false)
                    toast.success(`${res.data}`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }); 
                })
            }

            if(wasTagUpdated === true) {
                let tagsForAnswer = getTagsForAnswer.map(a => a.value);
                const answerData = {answer, tagsForAnswer};
            
                await axios.post(`${BEHOST}:${BEPORT}/answer/updateAnswer/${answerId}`, answerData)
                .then(res => {
                    getAnswers()
                    setModalForUpdateAnswer(false)
                    toast.success(`${res.data}`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }); 
                })
            }

            
        }
        catch (err) {
            console.error(err);
        } 
    }

    

    function getTagContents(tagName){
        history.push( `/tagPage/?tagName=${tagName}` );
    }

    if(gotAnswers == false ){
        return ( 
            <section className="classForLoader" {...containerProps}>
                {indicatorEl}
            </section>
        )
    }
    else{

    if(answers.length !=0){

    

    return (
        
        <>
     
        <div className="container col-xs-12 topQAnsList">
            <p style={{fontSize: '1.5rem'}}><b>My answers</b></p>  
            {answers.length > 0 && (
                <>
                
                {
                answers
                .slice((currentPage - 1) * pagePostsLimit, currentPage * pagePostsLimit)
                .map(answer =>
                ( 
                    <div className="tileForAnswers">
                    <div style={{cursor: 'pointer'}}onClick={() => {history.push(`/topqans/?query=${answer.questionID}`)}}><b>Question: </b>{answer.question}</div><br />
                    <div className="answeredByName">
                    <span className="answeredBy">{answer.fullName}</span>
                    <span className="answeredBy"  style={{ marginLeft: '10px'}}>({answer.Class} - {answer.branch})
                    {
                        answer.isAdmin === true && (
                            <>
                                &nbsp;
                                <MdVerified className="verifiedIcon" />
                            </>
                        )
                    }
                    {
                        answer.isAdmin === false && answer.isCollegeId === true && (
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


                <div key={answer.id}>
                <div className="answerOnTopQAns">
                    <span className="answer" dangerouslySetInnerHTML={{ __html: answer.answer }} />
                </div>
                {answer.removed !=0 && (
                    <div style={{color: 'red'}}>Removed by moderators</div>
                )}
                {answer.tagsForAnswer && (
                <>
                    <p className="tagClassPTag">
                    {answer.tagsForAnswer.map(tag => (
                        <span onClick={() => getTagContents(tag)} className="tagClass">{tag}</span>
                    ))} 
                    </p>
                </>
                )}
                
                
            
                <div>
                    {
                        answer.liked === true && (
                        <>
                            <BiLike className="likeIcon liked" onClick={() => removeLike(answer._id)} />
                            <span className="vote_count"> {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                            
                        </>
                        )
                    }
                    {
                        answer.liked === false && (
                        <>
                            <BiLike className="likeIcon" onClick={() => likeAnswer(answer._id, answer.answeredById)} />
                            <span className="vote_count"> {answer.likeCount}</span>
                            <span>&nbsp; &nbsp;</span>
                        </>
                        )
                    }
                    
                    {
                        answer.disliked === true && (
                            <>
                                <BiDislike className="dislikeIcon disliked" onClick={() => removeDislike(answer._id)} />
                                <span className="vote_count"> {answer.dislikeCount}</span>
                                <span>&nbsp; &nbsp;</span>
                            </>
                        )
                    }
                    {
                        answer.disliked === false && (
                            <>
                                <BiDislike className="dislikeIcon" onClick={() => dislikeAnswer(answer._id)} />
                                <span className="vote_count"> {answer.dislikeCount}</span>
                                <span>&nbsp; &nbsp;</span>
                            </>
                        )
                    } 
                    
               
                    <BiCommentDetail className="commentIcon" onClick={() => getComments(answer._id, answer.answeredById, answer.answer, answer.questionID)} />
                    <span className="comment_count"> {answer.commentCount}</span>
                    <span>&nbsp; &nbsp;</span>

                    
                    <Dropdown style={{display: 'inline'}}>
                        <Dropdown.Toggle as={CustomToggle} />
                        <Dropdown.Menu className="dropdown-styling" size="sm" title="">

                          <Dropdown.Item onClick={() => deleteAnswer(answer._id)}>
                              <MdBlock style={{fontSize: '1.1rem'}}  /> Delete answer
                            </Dropdown.Item>
                        
                            <Dropdown.Item onClick={() => openUpdateModal(answer._id, answer.answer, answer.tagsForAnswer) }>
                              <RiProfileFill style={{fontSize: '1.1rem'}}  /> Update answer
                            </Dropdown.Item>
                            
                        </Dropdown.Menu>
                    </Dropdown>


                    {
                        answer.saved === true && (
                        <span>
                            <BiBookmark onClick={() => removeSave(answer._id)} className="bookmark saved" />
                        </span>
                        )
                    }
                    {
                        answer.saved === false && (
                        <span>
                            <BiBookmark onClick={() => saveAnswer(answer._id)} className="bookmark" />
                        </span>
                        )
                    }
                    
                </div>

                <PureModal
                    header={<p dangerouslySetInnerHTML={{ __html: answerForComment }} />}

                    className="modal-body"

                width={"1000px"}
                scrollable={true}
                  footer={
                    <form onSubmit={writeComment} >
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
                                comment.isAdmin === false && answer.isCollegeId === true && (
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


                {/* For update answer */}
                <PureModal
                    header={"Update Answer"}

                    // className="modal-body"

                width={"500px"}
                scrollable={false}
                  

                onClose={() => {
                    setModalForUpdateAnswer(false);
                    return true;
                }}
                closeButton={<AiFillCloseCircle style={{fontSize: '2rem'}} />}
                closeButtonPosition="header"

                  isOpen={modalForUpdateAnswer}
                >
                  
                <div>      
                <form onSubmit={updateAnswer}>
                    <div className="form-group" >
                        {/* <textarea type="text" value={answerForUpdate} onChange={(e) => setAnswerForUpdate(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="1"
                        placeholder="Update your answer..." rows="3" ></textarea> */}

                        <CKEditor
                            editor={ ClassicEditor }
                            data={answerForUpdate}
                            config={{
                                removePlugins: ["EasyImage","ImageUpload","MediaEmbed"]
                            }}
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setAnswerForUpdate(data)
                            }}
                        />

                        <Tags 
                            tagifyRef={tagifyRef1}
                            settings={settings}
                            {...tagifyProps}
                            defaultValue={tagsForAnswerUpdate}
                            onChange={onChange} />

                        <br />
                        <button type="submit" className="btn btn-secondary">Update</button>
                        
                    </div>
                </form>
                </div>


                </PureModal>
        
                </div>

                </div>
                ))}
                <Pagination
                    initialPage={currentPage}
                    itemsPerPage={pagePostsLimit}
                    onPageСhange={(pageNumber) => setCurrentPage(pageNumber)}
                    totalItems={answers.length}
                    pageNeighbours={1}
                    withProgressBar={true}
                />
            </>
            )}
        </div>  

        <ToastContainer /> 
        </>
        )}
        else{
            return(
                <p className="container"><b>No answers yet</b></p>
            )
        }
    }
}

export default Answered
