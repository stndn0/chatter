import React from 'react'
import './PostComposer.css'

function PostComposer(props) {
    const placeholderText = "What's up, " + props.username + "? Start typing here..."

    return (
        <div id='post-composer-container'>
            <input id='composer-field' placeholder={placeholderText}></input>
        </div>
    )
}

export default PostComposer