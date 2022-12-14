import React from 'react';
import { useState, useEffect } from 'react';
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './Settings.css'

const ENDPOINT_GET_SETTINGS = "http://localhost:5000/user/settingspage";
const ENDPOINT_SET_AVATAR = "http://localhost:5000/user/setavatar";
const ENDPOINT_UPDATE_USERNAME = "http://localhost:5000/user/updateusername";
const ENDPOINT_UPDATE_PASSWORD = "http://localhost:5000/user/updatepassword";

function Settings(props) {
    const [avatarList, setAvatarList] = useState(null);
    const [currentAvatarSelection, setCurrentAvatarSelection] = useState(null);
    const [username, setUsername] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);

    const updateAvatarList = (object) => {
        setAvatarList(object)
    }

    const updateCurrentAvatarSelection = (id) => {
        setCurrentAvatarSelection(id)
    }

    // Gets the values of the input fields and updates the state.
    const handleUsernameInput = event => {
        setUsername(event.target.value)
    }
    const handlePassword1Input = event => {
        setPassword1(event.target.value)
    }
    const handlePassword2Input = event => {
        setPassword2(event.target.value)
    }


    useEffect(() => {
        getAvatarsFromServer();
    }, [])


    // Refresh page when avatarList is updated
    useEffect(() => {
        console.log("avatarlist update: ", avatarList)
    }, [avatarList])


    const getAvatarsFromServer = () => {
        let userid = props.userid;
        sendToServerAuthenticated(ENDPOINT_GET_SETTINGS, props.accessToken, { userid })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                updateAvatarList(data.avatars);
            }))
    }


    const displayAvatarContainer = () => {
        const avatarDivs = [];
        if (avatarList != null) {
            for (const avatar of Object.keys(avatarList)) {
                let avatarid = avatar;
                let avatarUrl = avatarList[avatar] + '.jpeg';
                let imgDiv = <img src={avatarUrl} className='avatar-img' id={avatarid}></img>

                if (avatarid === currentAvatarSelection) {
                    imgDiv = <img src={avatarUrl} className='avatar-img-selected' id={avatarid}></img>
                }
                avatarDivs.push(imgDiv)
            }
        }

        return (
            <div id="avatar-container" onClick={handleClick}>
                {avatarDivs}
            </div>
        )
    }


    // Find out which avatar the user has clicked.
    const handleClick = event => {
        const validTargets = ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"]
        console.log(event.target)
        // If the user has selected an avatar then add an outline to the selected avatar
        if (validTargets.includes(event.target.id)) {
            updateCurrentAvatarSelection(event.target.id)
            // event.target.style.border = "2px solid yellow";
            // console.log("Clicked avatar")
        }
    }


    const handleUpdateAvatarButton = () => {
        if (currentAvatarSelection != null) {
            let userid = props.userid;
            sendToServerAuthenticated(ENDPOINT_SET_AVATAR, props.accessToken, { userid, currentAvatarSelection })
                .then((data => {
                    console.log("*** RESPONSE FROM SERVER ***");
                    // updateAvatarList(data);
                }))
        }
    }

    const updateUsername = () => {
        event.preventDefault();
        let userid = props.userid;
        console.log(username)
        sendToServerAuthenticated(ENDPOINT_UPDATE_USERNAME, props.accessToken, { userid, username })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data);
                if (data.response === 200) {
                    console.log("success")
                    props.updateUsername(data.newusername);
                }
            }))
    }


    const updatePassword = () => {
        event.preventDefault();
        let userid = props.userid;
        sendToServerAuthenticated(ENDPOINT_UPDATE_PASSWORD, props.accessToken, { userid, password1, password2 })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data);
            }))
    }






    return (
        <div id="settings-page">
            <div id="settings-container">
                <h2>Update Avatar</h2>
                {displayAvatarContainer()}
                <button className="button-01" onClick={() => { handleUpdateAvatarButton() }}>Update Avatar</button>
                <div id="general-settings-container">
                    <h2>Update Username</h2>
                    <form id="username-form">
                        <label>Username</label>
                        <input name="username" type="text" id="username" className="textbox" placeholder="Type your username" onChange={handleUsernameInput} ></input>
                        <button onClick={() => updateUsername()}>Update Username</button>
                    </form>

                    <h2>Update Password</h2>
                    <form id="password-form">
                        <label>Password</label>
                        <input name="password1" type="text" id="password1" className="textbox" placeholder="Type your password" onChange={handlePassword1Input}></input>
                        <label>Password (Verify)</label>
                        <input name="password2" type="text" id="password2" className="textbox" placeholder="Type your password again" onChange={handlePassword2Input}></input>
                        <button onClick={() => updatePassword()}>Update Password</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Settings