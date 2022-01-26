import React, { useCallback, useState, useRef } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from 'react-router-dom'
import Tagify from '@yaireo/tagify'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS

function SearchResult() {

    const history = useHistory();
    const [question, setQuestion] = useState('')

    const tagifyRef1 = useRef()

    const [tagifySettings, setTagifySettings] = useState([])
    const [tagifyProps, setTagifyProps] = useState({})

    const baseTagifySettings = {
        blacklist: ["xxx", "yyy", "zzz"],
        maxTags: 6,
        //backspace: "edit",
        placeholder: "add tags",
        dropdown: {
          enabled: 0 // a;ways show suggestions dropdown
        }
    }

    const settings = {
        ...baseTagifySettings,
        ...tagifySettings
    }


    var [getTagsForQuestion, setTagsForQuestion] = useState();
    const onChange = useCallback(e => {
        setTagsForQuestion(e.detail.tagify.value)
    }, [])


    

    async function submitQuestion(e){
        e.preventDefault()

        try{
        let tagsForQuestion = getTagsForQuestion.map(a => a.value);
        const questioned = {question, tagsForQuestion}

        axios.post('http://localhost:3001/question/post', questioned)
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
        <div>
            <div className="container w-75">
            <form onSubmit={submitQuestion}>
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Didn't find answer to your question? Post your question here!</label>
                    <textarea onChange={(e) => setQuestion(e.target.value)} class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
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
            <ToastContainer />
        </div>
    )
}

export default SearchResult
