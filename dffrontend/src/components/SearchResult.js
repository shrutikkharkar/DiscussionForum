import React, {useState, useEffect, useContext, useRef, useCallback} from 'react'
import axios from 'axios'
import './TopQAns.css'
import {Link, useHistory} from 'react-router-dom'
import {LoaderProvider, useLoading, Puff} from '@agney/react-loading';
import VCETLogo from '../Images/VCETLogo.svg'

function SearchResult() {

    useEffect(() => {
        search()
    }, []);

    const queryParams = new URLSearchParams(window.location.search);
    const textToSearch = queryParams.get('query')

    const [searchResult, setSearchResult] = useState([])

    async function search() {
        try {
            await axios.get(`http://localhost:3001/question/search/${textToSearch}`)
            .then(response => {
                setSearchResult(response.data);
                console.log(response.data);
            })
        }
        catch (err) {
            console.error(err);
        }
    }


  return <div>

  </div>;
}

export default SearchResult;
