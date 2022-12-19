import React from 'react'
import './Post.css'

export default function Post() {
    return (
        <div id='post-container'>
            <div id='post'>
                <div className="post-profile-pic"></div>

                <div id="post-content">
                    <div className="post-username">Username</div>

                    <div className="post-body">Body</div>

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
