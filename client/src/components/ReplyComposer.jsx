import React from 'react'
import { useState } from 'react'
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './PostComposer.css';
import './ReplyComposer.css';

const ENDPOINT_REPLY_POST = "http://localhost:5000/user/newreplypost";
const placeholderText = "Start typing here..."

function ReplyComposer(props) {
    const [post, setPost] = useState(null);
    const handleTextInput = (event) => {
        setPost(event.target.value)
    }

    const sendReplyToServer = () => {
        let dataToSend = {
            userid: props.userid,
            post: post,
            postIDToReplyTo: props.postID
        }

        console.log("DATA TO SEND")
        console.log(dataToSend)

        sendToServerAuthenticated(ENDPOINT_REPLY_POST, props.accessToken, dataToSend)
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data);
            }))

    }

    return (
        <div id='post-composer-container' className="reply-composer">
            <input id='composer-field' onChange={handleTextInput} placeholder={placeholderText}></input>
            <button id='button-post' className='button-01' onClick={() => sendReplyToServer()}>Reply</button>
        </div>
    )
}

export default ReplyComposer