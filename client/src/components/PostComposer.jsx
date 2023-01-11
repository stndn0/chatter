import React from 'react'
import { useState } from 'react'
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './PostComposer.css'

const ENDPOINT_NEW_POST = "http://localhost:5000/user/newpost";

function PostComposer(props) {
    const [post, setPost] = useState(null);
    const handleTextInput = (event) => {
        setPost(event.target.value)
    }

    const placeholderText = "What's up, " + props.username + "? Start typing here..."

    const sendPostToServer = () => {
        event.preventDefault();
        let userid = props.userid;

        console.log("Send post to server")

        sendToServerAuthenticated(ENDPOINT_NEW_POST, props.accessToken, { userid, post })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data);
                // Tell application to reload contents of the page.
                props.updateRefreshPage();
                console.log(props.refreshPage)
            }))
    }

    return (
        <div id='post-composer-container'>
            <input id='composer-field' onChange={handleTextInput} placeholder={placeholderText}></input>
            <button id="button-post" className='button-01' onClick={() => sendPostToServer()}>Post</button>
        </div>
    )
}

export default PostComposer