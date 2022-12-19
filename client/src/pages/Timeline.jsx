import React from 'react';
import PostComposer from '../components/PostComposer';
import UserProfile from '../components/UserProfile';
import './Timeline.css'

export default function Timeline() {
    return (
        <div id="page-root">
            <div id="grid-container">
                <div id="col-left">

                </div>

                <div id="timeline">
                    <h2>Home</h2>
                    <PostComposer></PostComposer>
                </div>

                <div id="col-right">
                    <UserProfile></UserProfile>
                </div>
            </div>

        </div>
    )
}
