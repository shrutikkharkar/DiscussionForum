import React, { useCallback, useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AskQuestion.css'
import {useHistory} from 'react-router-dom'
import Tagify from '@yaireo/tagify'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import AskQuestionSvg from '../Images/AskQuestion.svg'
import { useMediaQuery } from 'react-responsive'

function AskQuestion() {

    useEffect(() => {
        getAllTagNames()
    }, []);

    const BEPORT = process.env.REACT_APP_BEPORT
    const BEHOST = process.env.REACT_APP_BEHOST
    const FEPORT = process.env.REACT_APP_FEPORT
    const FEHOST = process.env.REACT_APP_FEHOST

    const history = useHistory();
    const [question, setQuestion] = useState('')
    const [allTagNames, setAllTagNames] = useState([]);

    const tagifyRef1 = useRef()

    const [tagifySettings, setTagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState({})

    const baseTagifySettings = {
        blacklist: ["xxx", "yyy", "zzz"],
        maxTags: 6,
        whitelist: allTagNames,
        placeholder: "add tags (optional)",
        dropdown: {
          enabled: 0 // a;ways show suggestions dropdown
        }
    }

    const settings = {
        ...baseTagifySettings,
        ...tagifySettings
    }


    var [getTagsForQuestion, setTagsForQuestion] = useState([]);
    const onChange = useCallback(e => {
        setTagsForQuestion(e.detail.tagify.value)
    }, [])

    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

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

    async function submitQuestion(e){
        e.preventDefault()

        try{
        let tagsForQuestion = getTagsForQuestion.map(a => a.value);
        const questioned = {question, tagsForQuestion}

        axios.post(`${BEHOST}:${BEPORT}/question/post`, questioned)
        .then(response => {
            toast.success('Question submitted successfully!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            history.push('/')
        })
        }
        catch (err) {
            toast.dark(err.response, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error(err);
        }
    }

    return (
    <div className="container searchResultDiv">
        <div className="row" >
            <div className="col-md-6 askQuestionMainDiv" >
                <div className="askQuestionDiv" >
                <form onSubmit={submitQuestion}>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Didn't find answer to your question? Post your question here!</label>
                        <textarea placeholder="Ask your question here!" onChange={(e) => setQuestion(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        <Tags 
                            tagifyRef={tagifyRef1}
                            settings={settings}
                            {...tagifyProps}
                            onChange={onChange} />
                    </div>
                    <br />
                    <button type="submit" className="btn btn-secondary">Post</button>
                </form>
                </div>
            </div>

            {!isPortrait && (
            <div className="col-md-6" >
                <img
                    src={AskQuestionSvg}
                    style={{ height: '100%', width: '100%'}}
                    alt="Ask question"
                />    
            </div>
            )}

        </div>
        <ToastContainer />
    </div>
    )
}

export default AskQuestion
