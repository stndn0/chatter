import React from 'react'
import { useState } from 'react'
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './PostComposer.css'

const ENDPOINT_NEW_POST = "http://localhost:5000/user/newpost";

function PostComposer(props) {
    const [post, setPost] = useState(null);
    const handleTextInput = (event) => {
        setPost(event.target.value)
        console.log("Post: ", post)
    }

    const placeholderText = "What's up, " + props.username + "? Start typing here..."

    const sendPostToServer = () => {
        let userid = props.userid

        sendToServerAuthenticated(ENDPOINT_NEW_POST, props.accessToken, { userid, post })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data);
            }))
    }

    return (
        <div id='post-composer-container'>
            <input id='composer-field' onChange={handleTextInput} placeholder={placeholderText}></input>
            <button onClick={() => sendPostToServer()}>Post</button>
        </div>
    )
}

export default PostComposer