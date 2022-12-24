import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { getFromServer } from '../helpers/apiFunctions';
import './Post.css'

export default function Post(data) {
    const navigate = useNavigate();   // We use this hook to redirect the user to the timeline upon login.
    console.log("Inside Post Component")
    const postData = data.data;
    const date = new Date(postData.date).toLocaleDateString();
    const time = new Date(postData.date).toLocaleTimeString('en-US');

    // Called when the user clicks on a username in the timeline.
    // Tell the server to get information about that username so that we can 
    // display their page.
    const goToUserProfile = (userid) => {
        // event.preventDefault();
        // const ENDPOINT_USERPAGE = "http://localhost:5000/user/userpage/" + userid;
        // getFromServer(ENDPOINT_USERPAGE)
        //     .then((data => {
        //         console.log("*** RESPONSE FROM SERVER ***");
        //         console.log(data)
        //     }))

        navigate({
            pathname: '/userpage',
            search: '?id=' + userid,
            id: userid
        })
    }

    return (
        <div id='post-container'>
            <div id='post'>
                <div className="post-profile-pic"></div>

                <div id="post-content">
                    <div className="post-username" onClick={() => goToUserProfile(postData.userid)}>{postData.username}</div>

                    <div className="post-body">{postData.post}</div>



                    <div className="post-bottom-row">
                        {/* <div id='boost'>🔁</div> */}
                        <div id="post-social-items">
                            <div id='like'>💗</div>
                            <div id='reply'>🗨️</div>
                        </div>
                        <div className="post-time"> {date} at {time}</div>
                    </div>

                </div>
            </div>
        </div>
    )
}
