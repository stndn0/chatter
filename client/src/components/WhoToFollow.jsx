import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './WhoToFollow.css';

const ENDPOINT_EXPLORE_USERS = "http://localhost:5000/user/exploreusers";

function WhoToFollow(props) {
    const navigate = useNavigate();
    const [usersToFollow, setUsersToFollow] = useState([]);

    const updateUsersToFollow = (arr) => {
        // Clear existing array and then copy the contents of arr to it.
        setUsersToFollow([...arr])
    }

    useEffect(() => {
        populateExploreTab();
    }, [])


    // When we get a response from the server we can draw the sidebar div
    useEffect(() => {
        renderExploreTab();
    }, [usersToFollow])


    const populateExploreTab = () => {
        let userid = props.userid;

        console.log("Send to server")

        sendToServerAuthenticated(ENDPOINT_EXPLORE_USERS, props.accessToken, { userid })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                if (data.response === 200) {
                    console.log("Response 200")
                    updateUsersToFollow(data.data);
                }
            }))
    }

    const goToUserProfile = (userid) => {
        navigate({
            pathname: '/userpage',
            search: '?id=' + userid,
            id: userid
        })
    }

    const renderExploreTab = () => {
        if (usersToFollow != null) {
            const divs = [];

            for (let obj of usersToFollow) {
                let div =
                    <div className="userToFollow-parent">
                        <div className="userToFollow-lhs">
                            <img className="userToFollow-avatar" src={obj.avatar + ".jpeg"}></img>
                            <div className="userToFollow-name">{obj.username}</div>
                        </div>
                        <button className="button-01 userToFollow-btn" onClick={() => goToUserProfile(obj.userid)}>View User</button>
                    </div>

                divs.push(div)
            }
            return (divs)
        }
    }

    return (
        <div className="userToFollow-container">
            {renderExploreTab()}
            {/* <div className="userToFollow-parent">
                <div className="userToFollow-lhs">
                    <div className="userToFollow-avatar">AV</div>
                    <div className="userToFollow-name">USER</div>
                </div>
                <button className="button-01 userToFollow-btn">Follow</button>
            </div>

            <div className="userToFollow-parent">
                <div className="userToFollow-lhs">
                    <div className="userToFollow-avatar">AV</div>
                    <div className="userToFollow-name">USER</div>
                </div>
                <button className="button-01 userToFollow-btn">Follow</button>
            </div>

            <div className="userToFollow-parent">
                <div className="userToFollow-lhs">
                    <div className="userToFollow-avatar">AV</div>
                    <div className="userToFollow-name">USER</div>
                </div>
                <button className="button-01 userToFollow-btn">Follow</button>
            </div> */}

        </div>
    )
}

export default WhoToFollow