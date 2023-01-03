import React from 'react';
import { useState, useEffect } from 'react';
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './Settings.css'

const ENDPOINT_GET_SETTINGS = "http://localhost:5000/user/settingspage";

function Settings(props) {
    const [avatarList, setAvatarList] = useState(null);

    const updateAvatarList = (object) => {
        setAvatarList(object)
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
            console.log("INNER ALIST", avatarList);

            for (const avatar of Object.keys(avatarList)) {
                let avatarid = avatar;
                let avatarUrl = avatarList[avatar] + '.jpeg';
                let imgDiv = <img src={avatarUrl} className='avatar-img'></img>
                avatarDivs.push(imgDiv)
                console.log(avatarid, avatarUrl)
            }

            console.log(avatarDivs)

            // for (let avatar of avatarList) {
            //     let div = <img src={avatar}></img>
            // }
        }


        return (
            <div id="avatar-container">
                {avatarDivs}
            </div>
        )
    }


    return (
        <div id="settings-page">
            <div id="settings-container">
                <h2>Update Avatar</h2>
                {displayAvatarContainer()}
                <div id="general-settings-container">
                    <h2>Update Username</h2>
                    <h2>Update Password</h2>
                </div>
            </div>

        </div>
    )
}

export default Settings