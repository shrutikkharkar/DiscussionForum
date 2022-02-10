import React, { useState } from "react";
import "./SearchUsers.css";
import {useHistory} from 'react-router-dom'
import { MdSearch, MdClose } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

function SearchUsers({ placeholder, data }) {

const BEPORT = process.env.REACT_APP_BEPORT
const BEHOST = process.env.REACT_APP_BEHOST
const FEPORT = process.env.REACT_APP_FEPORT
const FEHOST = process.env.REACT_APP_FEHOST

  const history = useHistory();

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.fullName.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };


  async function makeUserAdmin(userId) {
    try {
      await axios.post(`${BEHOST}:${BEPORT}/user/makeUserAdmin/${userId}`)
      .then( (res) => {
        
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

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="searchUser">
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
          <table class="table table-hover">
                    <thead>
                <tr>
                  <th scope="col">Sr.no</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Class</th>
                  <th scope="col">Branch</th>
                  <th scope="col">Operate</th>
                </tr>
              </thead>
          {filteredData.slice(0, 15).map((value, key) => {
            return (
                
                
                
                <tbody>
                  <tr>
                    <th scope="row">{key+1}</th>
                    <td>{value.fullName}</td>
                    <td>{value.email}</td>
                    <td>{value.Class}</td>
                    <td>{value.branch}</td>
                    <td><button type="button" onClick={() => makeUserAdmin(value._id)} class="btn btn-secondary">Add</button></td>
                  </tr>
                </tbody>
                
              
            );
          })}
          </table> 
        </div>
      )}
      <ToastContainer />  
    </div>
  );
}

export default SearchUsers;
