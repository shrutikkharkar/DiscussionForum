import React, { Component } from 'react'
import axios from 'axios'
import './Navbar.css'
import UserIconAndActions from './UserIconAndActions'

const UserTemplate = props =>(
  <p>{props.users.userName}</p>
)

class Navbar extends Component {
  
  constructor(props) {
    super(props)
  
    this.state = {
       users: [],
       name: ''
      //  logined: true
    }
  }
  // 6107a2aee36f650cbc6c1849
  componentDidMount() {
    axios.get('http://localhost:3001/users/get/')
        .then(response => {
          this.setState({ users: response.data });
        })
        .catch(function (error){
            console.log(error);
        })
    }


// setLoggedInUser(props){

//   this.setState({ logined: this.props.logined });

// }
userList(){
  return this.state.users.map(function(currentUser, i){
      return <UserTemplate users={currentUser} key={i} />;
  })
}

home(){
  window.location.href = '/';
}

onSearch(){
  window.location.href = '/searchResult';
}
  render() {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        {/* {this.setLoggedInUser()}   */}
        <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", marginBottom: "2%"}}>
        <p onClick={this.home} className="logo">VCETDFORUM</p>
          <form onSubmit={this.onSearch} className="form-inline searchForm justify-content-centre" >
            <input className="searchBox" type="text" placeholder="Search" />
            <a href="/searchResult" type="submit" className="searchButton"><i className="fa fa-search"></i></a>
          </form>
          <UserIconAndActions className="UserIconAndActions"/>
          {/* <span className="userNameSpan"  style={{position:"absolute", top: "1rem", right: "1rem"}}>
            <i className='fas fa-user-circle userNameIcon' style={{fontSize:'30px'}}></i>
            <span>

            <p classname="userName" style={{marginLeft:'10px',
                                              marginRight:'20px',
                                              fontSize:'1.1rem'}}><UserIconAndActions /></p>
            </span>
          </span> */}
        </nav>
        

        </>
    )
  }
}

export default Navbar

