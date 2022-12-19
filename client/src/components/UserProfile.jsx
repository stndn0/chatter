import React from 'react';
import './UserProfile.css'

function UserProfile(props) {
    return (
        <div id='userprofile-container'>
            <div id="user-profile">
                <div className='username'>Username</div>
                <div className='user-bio'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
            </div>

            <div id="settings">

            </div>
        </div>
    )
}

export default UserProfile