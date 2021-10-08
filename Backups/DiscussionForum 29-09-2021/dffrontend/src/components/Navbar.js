import React, { Component, useContext, useState } from 'react'
import axios from 'axios'
import './Navbar.css'
import {Link, useHistory} from 'react-router-dom'
import UserIconAndActions from './UserIconAndActions'
import AuthContext from '../context/AuthContext'
import LogoutBtn from './LogoutBtn'




function Navbar() {

const {loggedIn} = useContext(AuthContext);
const history = useHistory();
  
const [search, setSearch] = useState();

function Search(){
  history.push('/searchResult');
  // window.location.href = '/searchResult';
}

function gotoHome() {
    history.push('/');
}

    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", marginBottom: "2%"}}>
        <p className="logo" onClick={gotoHome} >VCETDFORUM</p>
          <form onSubmit={search} className="form-inline searchForm justify-content-centre" >
            <input onChange={(e) => setSearch(e.target.value)} value={search} className="searchBox" type="text" placeholder="Search" />
            <a onClick={Search} type="submit" className="searchButton"><i className="fa fa-search"></i></a>
          </form>

          {loggedIn===false && (
            <>
              <Link to = "/login" className="btn btn-primary btn-md active">Login</Link>
              <Link to = "/signup" className="btn btn-secondary btn-md active"
                    style={{marginLeft:'1em', marginRight:'1em'}}>Register</Link>
            </>
          )}
          {loggedIn===true && <LogoutBtn />}

        </nav>
        

        </>
    )
  
}

export default Navbar





// import React, { Component, useContext } from 'react'
// import axios from 'axios'
// import './Navbar.css'
// import {Link} from 'react-router-dom'
// import UserIconAndActions from './UserIconAndActions'
// import AuthContext from '../context/AuthContext'
// import LogoutBtn from './LogoutBtn'

// const {loggedIn} = useContext(AuthContext);

// const UserTemplate = props =>(
//   <p>{props.users.userName}</p>
// )

// class Navbar extends Component {
  
//   constructor(props) {
//     super(props)
  
//     this.state = {
//        users: [],
//        name: ''
//       //  logined: true
//     }
//   }
//   // 6107a2aee36f650cbc6c1849
//   componentDidMount() {
//     axios.get('http://localhost:3001/users/get/')
//         .then(response => {
//           this.setState({ users: response.data });
//         })
//         .catch(function (error){
//             console.log(error);
//         })
//     }


// // setLoggedInUser(props){

// //   this.setState({ logined: this.props.logined });

// // }
// userList(){
//   return this.state.users.map(function(currentUser, i){
//       return <UserTemplate users={currentUser} key={i} />;
//   })
// }

// home(){
//   window.location.href = '/';
// }

// onSearch(){
//   window.location.href = '/searchResult';
// }
//   render() {
//     return (
//       <>
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
//         {/* {this.setLoggedInUser()}   */}
//         <nav className="navbar navbar-light" style={{backgroundColor: "#f2f2f2", marginBottom: "2%"}}>
//         <p onClick={this.home} className="logo">VCETDFORUM</p>
//           <form onSubmit={this.onSearch} className="form-inline searchForm justify-content-centre" >
//             <input className="searchBox" type="text" placeholder="Search" />
//             <a href="/searchResult" type="submit" className="searchButton"><i className="fa fa-search"></i></a>
//           </form>

//           {loggedIn===false && (
//             <>
//               <Link to = "/login">Login</Link>
//               <Link to = "/register">Register</Link>
//             </>
//           )}
//           {loggedIn===true && (
//             <>
//               <p>Shrutik Kharkar</p>
//               <LogoutBtn />
//             </>
//           )}

//           {/* <UserIconAndActions className="UserIconAndActions"/> */}


//           {/* <span className="userNameSpan"  style={{position:"absolute", top: "1rem", right: "1rem"}}>
//             <i className='fas fa-user-circle userNameIcon' style={{fontSize:'30px'}}></i>
//             <span>

//             <p classname="userName" style={{marginLeft:'10px',
//                                               marginRight:'20px',
//                                               fontSize:'1.1rem'}}><UserIconAndActions /></p>
//             </span>
//           </span> */}
//         </nav>
        

//         </>
//     )
//   }
// }

// export default Navbar

