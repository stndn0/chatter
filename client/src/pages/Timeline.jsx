import React from 'react';
import Post from '../components/Post';
import PostComposer from '../components/PostComposer';
import UserProfile from '../components/UserProfile';
import './Timeline.css'

export default function Timeline(props) {
    const displayPosts = (props) => {
        return (
            <div id='timeline-feed'>
                <Post></Post>
                <Post></Post>
                <Post></Post>
                <Post></Post>
            </div>
        )
    }


    return (
        <div id="page-root">
            <div id="grid-container">
                <div id="col-left">

                </div>

                <div id="timeline">
                    <h2>Home</h2>
                    <PostComposer></PostComposer>

                    { /* Dynamically render different posts on the users timeline */}
                    {displayPosts(props)}

                </div>

                <div id="col-right">
                    <UserProfile></UserProfile>
                </div>
            </div>

        </div>
    )
}
