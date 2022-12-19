import React from 'react'
import './PostComposer.css'

function PostComposer() {
    return (
        <div id='post-composer-container'>
            <input id='composer-field' placeholder="What's up, {username}?"></input>
        </div>
    )
}

export default PostComposer