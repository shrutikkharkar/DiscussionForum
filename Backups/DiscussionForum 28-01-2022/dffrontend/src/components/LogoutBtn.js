import axios from 'axios'
import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext';
import IsAdminContext from '../context/IsAdminContext'
import {useHistory} from 'react-router-dom'
import './Navbar.css'

function LogoutBtn() {
    const {getLoggedIn} = useContext(AuthContext);
    const {getIsAdmin} = useContext(IsAdminContext);

    const history = useHistory();

    async function logout() {
        await axios.get('http://localhost:3001/user/logout');
        await getLoggedIn();
        await getIsAdmin();
        history.push('/');
    }
    return (
    <span className="logoutBtnClass">
        <button onClick={logout} className="btn btn-secondary btn-md active"
        style={{marginLeft:'1em', marginRight:'1em'}}>
            Logout
        </button>
    </span>
    )
}

export default LogoutBtn
