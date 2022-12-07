import React from 'react';
import './Navbar.css';
import notificationIcon01 from '../assets/icons/notifications-circle.svg';
import logoutIcon01 from '../assets/icons/log-out-outline.svg';
import user from '../assets/icons/user.png';

function Navbar() {
    return (
        <div id="navbar-container">
            <div id="navbar-parent">
                <div id="navbar-lhs">
                    <p className='logo'>chatter 🦜</p>
                </div>
                <div id="navbar-rhs">
                    <div id="user-contents">
                        <button id="create-post">New Post</button>
                        <img src={notificationIcon01} className="icon"></img>
                        <img src={logoutIcon01} className="icon"></img>
                        <img src={user} className="icon-user"></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar