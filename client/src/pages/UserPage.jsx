import React from 'react';
import './Timeline.css';
import './UserPage.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { getFromServer, sendToServerAuthenticated } from '../helpers/apiFunctions';
import Post from '../components/Post';

const ENDPOINT_FOLLOW_USER = "http://localhost:5000/user/followuser";

function UserPage(props) {
    // We need to initalize a null user. 
    // The react engine will fall back to this if the state hasn't changed.
    const nullUser = {
        username: "",
        userbio: "",
        followers: "",
        following: ""
    }

    const [pageUserId, setPageUserId] = useState(null);
    const [pageUser, setPageUser] = useState(nullUser);
    const [pageUserPosts, setPageUserPosts] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const updatePageUserId = (userid) => {
        setPageUserId(userid);
    }

    const updatePageUserPosts = (arr) => {
        setPageUserPosts(arr);
    }

    const updatePageUser = (obj) => {
        setPageUser(obj);
    }

    // Run on first load to get the userid and set the state.
    useEffect(() => {
        // Get the userid from the URL. 
        // Use trycatch in case a query is not passed.
        try {
            updatePageUserId(searchParams.get('id'));
            console.log("USERID (First Load):", pageUserId);
        } catch (error) {
            console.log(error)
        }
    }, [])


    // Run whenever the userId for the current page has changed.
    // When this happens, we send a GET request to the server so that we can
    // populate this page with data about this user (e.g. their tweets and so on...)
    useEffect(() => {
        console.log("USERID (STATE CHANGE):", pageUserId);
        // Send a GET request to the server so that we can get the data
        // we need to render this users page.

        if (pageUserId != null) {
            const ENDPOINT_USERPAGE = "http://localhost:5000/user/userpage/" + pageUserId;
            getFromServer(ENDPOINT_USERPAGE)
                .then((data => {
                    console.log("*** RESPONSE FROM SERVER ***");
                    console.log(data)
                    updatePageUserPosts(data.posts);
                    updatePageUser(data.user);
                    console.log(pageUserPosts);
                    // TODO - update page state with this data (username, bio etc...)
                    // then populate the rest of the JSX with this information.
                }))
        }
    }, [pageUserId])


    const displayPosts = () => {
        const divs = [];
        if (pageUserPosts != null) {
            for (let object of pageUserPosts) {
                divs.push(<Post data={object}></Post>);
            }
            console.log(pageUserPosts)
        }

        return (
            <div id='timeline-feed'>
                {divs}
            </div>
        )
    }


    const handleFollowButton = () => {
        console.log("follow")
        sendToServerAuthenticated(ENDPOINT_FOLLOW_USER, props.accessToken, { "sender": props.userid, "userToFollow": pageUserId })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data)
            }))
    }


    // Function to display the follow button to the client
    // The button is dynamic. It should display a different text depending on whether the client is following the user.
    const renderFollowButton = () => {
        console.log("Page user")
        console.log(pageUser.followers)
        let buttonText = "Follow"

        // Go through followers array and see if the client userID is within the array
        for (let userid of pageUser.followers) {
            if (userid === props.userid) {
                buttonText = "Unfollow";
            }
        }

        return(
            <button onClick={() => handleFollowButton()} className='button-01' id='button-follow'>{buttonText}</button>
        )

    }

    return (
        <div id="page-root">
            <div id="grid-container">
                <div id="col-left">
                    <h2>Trending</h2>
                </div>

                <div id="timeline">
                    <div id="userbox">
                        <h2>{pageUser.username}'s Profile</h2>
                        {/* <button onClick={() => handleFollowButton()} className='button-01' id='button-follow'>Follow</button> */}
                        {renderFollowButton()}
                    </div>
                    {displayPosts(props)}

                </div>

                <div id="col-right">
                    <h2>About</h2>
                    <p>{pageUser.userbio}</p>
                </div>
            </div>

        </div>
    )
}

export default UserPage