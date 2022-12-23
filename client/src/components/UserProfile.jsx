import React from 'react';
import { setUserBio } from '../helpers/apiFunctions';
import './UserProfile.css'

function UserProfile(props) {
    const textareaRef = React.useRef(null);
    const [value, setValue] = React.useState("");

    // Text area that dynamically expands horiontally based on user input.
    const MIN_TEXTAREA_HEIGHT = 100;
    React.useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textareaRef.current.style.height = "inherit";
        // Set the height of the text area.
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT)}px`;
    }, [value]);


    // Update the client side state of the user bio whenever the user types in the textbox
    const updateBioState = (event) => {
        setValue(event.target.value);
        props.updateBio(event.target.value)
        console.log(props.userBio)
    }

    // Send props.userBio to the server where it will be updated.
    // This function is triggered when the user clicks the 'update bio' button.
    const sendUpdatedBioToServer = () => {
        let bio = props.userBio;
        let userid = props.userid;

        setUserBio(props.accessToken, { userid, bio })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data);
            }))
    }


    const textArea = () => {
        // If the user hasn't entered a bio then the text area should contain placeholder test.
        let textAreaPlaceholder = props.userBio;
        if (props.userBio === undefined) {
            textAreaPlaceholder = "This area is for your personal bio. Click here to fill it out.";
        }
        else {
            textAreaPlaceholder = props.userBio;
        }

        return (
            <div className='user-bio'>
                <textarea
                    id='user-bio-text'
                    placeholder={textAreaPlaceholder}
                    spellCheck="false"
                    onChange={updateBioState}
                    ref={textareaRef}
                    style={{
                        minHeight: MIN_TEXTAREA_HEIGHT,
                        resize: "none"
                    }}
                    value={value}
                > </textarea>
            </div>
        )
    }

    return (
        <div id='userprofile-container'>
            <div id="user-profile">
                <div className='username'>{props.username}</div>
                {textArea()}
            </div>
            <button className="button-01" onClick={() => sendUpdatedBioToServer()}>Update Bio</button>
        </div>
    )
}

export default UserProfile