import React from 'react'
import './Post.css'

export default function Post(data) {
    console.log("Inside Post Component")
    const postData = data.data;

    return (
        <div id='post-container'>
            <div id='post'>
                <div className="post-profile-pic"></div>

                <div id="post-content">
                    <div className="post-username">{postData.username}</div>

                    <div className="post-body">{postData.post} {postData.date}  {postData.time}</div>

                    {/* <div className="post-data">{postData.date}  {postData.time}</div> */}

                    <div className="post-social-row">
                        <div id='reply'>🗨️</div>
                        <div id='boost'>🔁</div>
                        <div id='like'>💗</div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
