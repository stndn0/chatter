import React from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import './Navbar.css';
import notificationIcon01 from '../assets/icons/notifications-circle.svg';
import logoutIcon01 from '../assets/icons/log-out-outline.svg';
import user from '../assets/icons/user.png';


function Navbar(props) {
    const navigate = useNavigate();   // We use this hook to redirect the user to the timeline upon login.

    const logout = (props) => {
        props.updateAccessToken(null);
        navigate("/login")
        console.log("*** Logout *** ")
    }

    const goToTimeline = (props) => {
        if (props.accessToken != null && props.accessToken != undefined) {
            navigate("/timeline")
        }
        else {
            navigate("/login")
        }
    }

    return (
        <div id="navbar-container">
            <div id="navbar-parent">
                <div id="navbar-lhs">
                    <p className='logo' onClick={() => goToTimeline(props)}>Chatter 🦜</p>
                </div>
                <div id="navbar-rhs">
                    <div id="user-contents">
                        {/* <p>Test accessToken: {props.accessToken}</p> */}
                        {/* <button id="create-post">New Post</button> */}
                        <img src={notificationIcon01} className="icon"></img>
                        <img src={logoutIcon01} className="icon" onClick={() => logout(props)}></img>
                        <img src={user} className="icon-user"></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar