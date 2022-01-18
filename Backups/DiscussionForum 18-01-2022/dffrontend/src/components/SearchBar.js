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
      return value.question.toLowerCase().includes(searchWord.toLowerCase());
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

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <MdSearch />
          ) : (
            <MdClose id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              
                <p className="dataItem"  onClick={() => gotoAnswers(value._id)}> {value.question} </p>
              
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
