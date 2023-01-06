import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Post from '../components/Post';
import PostComposer from '../components/PostComposer';
import UserProfile from '../components/UserProfile';
import { sendToServerAuthenticated } from '../helpers/apiFunctions';
import './Timeline.css'

const ENDPOINT_GET_TIMELINE = "http://localhost:5000/user/gettimelineposts";

export default function Timeline(props) {
    const [timelinePosts, setTimelinePosts] = useState([]);

    // https://reactjs.org/docs/hooks-effect.html
    // When the page initially loads this hook will query the server for tweets 
    // that get displayed on the timeline.
    useEffect(() => {
        getPostsFromServer();
    }, [])  // Empty array - useEffect will only run on first render of page


    // Whenever the 'timelinePosts' state gets updated we tell React to 
    // re-render parts of the page with the new information.
    useEffect(() => {
        console.log("\n\nNew value of timeline posts is: ", timelinePosts)
    }, [timelinePosts])


    // Save server response to state
    const updateTimelinePosts = (arr) => {
        // Clear existing array and then copy the contents of arr to it.
        setTimelinePosts([...arr])
        // const newArr = timelinePosts.slice();
        // newArr.push(arr);
        // setTimelinePosts(newArr);
    }


    const getPosts = () => {
        console.log(timelinePosts);
    }


    // Ask the server to send posts for the user
    const getPostsFromServer = () => {
        console.log("getPostsFromServer();")
        let userid = props.userid

        // Send endpoint, user token for authentication and user id to server.
        // Server will return a fresh batch of timeline content.
        sendToServerAuthenticated(ENDPOINT_GET_TIMELINE, props.accessToken, { userid })
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                updateTimelinePosts(data.posts);
            }))
    }


    const displayPosts = () => {
        const divs = [];

        for (let object of timelinePosts)  {
            Object.assign(object, {accessToken: props.accessToken, clientuserid: props.userid})
            divs.push(<Post data={object} ></Post>);
        }

        console.log(divs)

        return (
            <div id='timeline-feed'>
                {divs}
            </div>
        )
    }


    return (
        <div id="page-root">
            <div id="grid-container">
                <div id="col-left">
                    <h2>Trending</h2>
                </div>

                <div id="timeline">
                    <h2>Home</h2>
                    <PostComposer {...props}></PostComposer>

                    { /* Dynamically render different posts on the users timeline */}
                    {displayPosts(props)}

                </div>

                <div id="col-right">
                    <h2>Explore</h2>
                    <UserProfile {...props}></UserProfile>
                </div>
            </div>

        </div>
    )
}
