import React, { Component } from 'react'
import axios  from 'axios'

const UserDetails = props => (
<div style={{display: 'absolute'}}>    
    <span>
        <i className='fas fa-user-circle userNameIcon' style={{fontSize:'30px'}}></i>
    </span>

    <span style={{marginLeft:'10px',
                            marginRight:'20px',
                            fontSize:'1.1rem'}}>{props.user.userName}</span>
</div>
)

const LoginRegisterBtns = () => (
    <div>
        <a href="/login" className="btn btn-primary btn-md active">Login</a>
        <a href="/signup" className="btn btn-secondary btn-md active"
        style={{marginLeft:'1em', marginRight:'1em'}}>Sign Up</a>
    </div>
)

class UserIconAndActions extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             logined: false,
             user:[]

        }

    }
    
    componentDidMount(){
        axios.get('http://localhost:3001/users/get/6110da0de372a240cc6b2224')
            .then(response => {
                this.setState({ user: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    
        }

    // setUserStatus(){
    //     this.setState({logined: this.props.logined})
    // }

    userState(isLogined) {

        if(isLogined == true){
            this.setState({logined: true})
        }     

        if(this.state.logined == true){
            return <UserDetails user={this.state.user}/>
        }
        else
        {
            return <LoginRegisterBtns />
        }
    }



    render() {
        return (
            <div>
                {/* {this.setUserStatus()} */}
                {this.userState(this.props.logined)}
            </div>
        )
    }
}

export default UserIconAndActions
