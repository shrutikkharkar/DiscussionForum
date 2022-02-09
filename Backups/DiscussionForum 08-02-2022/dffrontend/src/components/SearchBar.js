import React, { useState } from "react";
import "./SearchBar.css";
import {useHistory} from 'react-router-dom'
import { MdSearch, MdClose } from "react-icons/md";

function SearchBar({ placeholder, data }) {

  const history = useHistory();

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      if(value.question){
        return value.question.toLowerCase().includes(searchWord.toLowerCase());
      }
      if(value.tagName){
        return value.tagName.toLowerCase().includes(searchWord.toLowerCase());
      }
      
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  function gotoAnswers(questionId) {
    history.push( `/topqans/?query=${questionId}` );
    clearInput()
  }

  function getTagContents(tagName){
    history.push( `/tagPage/?tagName=${tagName}` );
    window.location.reload()
  }

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  function searchForResults(wordEntered){
    history.push(`/searchResult/?query=${wordEntered}`)
    clearInput()
  }

  return (
    <div className="search">
      <div className="searchInputs" style={{border: '1px solid gainsboro'}}>
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <></>
          ) : (
            <MdClose id="clearBtn" onClick={clearInput} />
          )}
        </div>
        <MdSearch className="searchButton" onClick={() => searchForResults(wordEntered) } />
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <>

              {value.question && (
                <p className="dataItem"  onClick={() => gotoAnswers(value._id)}> {value.question} </p>
              )}

              {value.tagName && (
                <p className="dataItem" style={{color: 'blue'}}  onClick={() => getTagContents(value.tagName)}># {value.tagName} </p>
              )}

              </> 
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
