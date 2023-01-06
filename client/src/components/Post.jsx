import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { getFromServer, sendToServerAuthenticated } from '../helpers/apiFunctions';
import './Post.css'

export default function Post(data) {
    const navigate = useNavigate();
    const postData = data.data;

    const date = new Date(postData.date).toLocaleDateString();
    const time = new Date(postData.date).toLocaleTimeString('en-US');
    const ENDPOINT_LIKE_POST = "http://localhost:5000/user/likepost"

    // Called when the user clicks on a username in the timeline.
    // Tell the server to get information about that username so that we can 
    // display their page.
    const goToUserProfile = (userid) => {
        navigate({
            pathname: '/userpage',
            search: '?id=' + userid,
            id: userid
        })
    }

    // Called when the user clicks on the reply button for a post.
    const goToReply = (postid) => {
        navigate({
            pathname: '/fullpost',
            search: '?postid=' + postid,
            postid: postid
        })
    }


    const likePost = (postid) => {
        console.log(postData.accessToken, postid)
        let userid = postData.clientuserid;
        sendToServerAuthenticated(ENDPOINT_LIKE_POST, postData.accessToken, { postid, userid })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
            }))
    }


    return (
        <div id='post-container'>
            <div id='post'>
                <div className="post-profile-pic"></div>

                <div id="post-content">
                    {/* <div>userid is: {postData.userid}</div> */}
                    <div className="post-username" onClick={() => goToUserProfile(postData.userid)}>{postData.username}</div>

                    <div className="post-body">
                        {postData.post}
                    </div>

                    <div className="post-bottom-row">
                        {/* <div id='boost'>🔁</div> */}
                        <div id="post-social-items">
                            <div id='likes'>{postData.likes}</div>
                            <div id='like' onClick={() => likePost(postData.postid)}>💗</div>
                            <div id='reply' onClick={() => goToReply(postData.postid)}>🗨️</div>
                        </div>
                        <div className="post-time"> {date} at {time}</div>
                    </div>

                </div>
            </div>
        </div>
    )
}
