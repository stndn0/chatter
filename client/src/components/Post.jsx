import React from 'react'
import './Post.css'

export default function Post(data) {
    console.log("Inside Post Component")
    const postData = data.data;
    const date = new Date(postData.date).toLocaleDateString();
    const time = new Date(postData.date).toLocaleTimeString('en-US');

    return (
        <div id='post-container'>
            <div id='post'>
                <div className="post-profile-pic"></div>

                <div id="post-content">
                    <div className="post-username">{postData.username}</div>

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
