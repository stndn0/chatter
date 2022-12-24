import React from 'react';
import './Timeline.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { getFromServer } from '../helpers/apiFunctions';

function UserPage(props) {
    const [pageUserId, setPageUserId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const updatePageUserId = (userid) => {
        setPageUserId(userid)
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

        const ENDPOINT_USERPAGE = "http://localhost:5000/user/userpage/" + pageUserId;
        getFromServer(ENDPOINT_USERPAGE)
            .then((data => {
                console.log("*** RESPONSE FROM SERVER ***");
                console.log(data)

                // TODO - update page state with this data (username, bio etc...)
                // then populate the rest of the JSX with this information.
            }))
    }, [pageUserId])


    return (
        <div id="page-root">
            <div id="grid-container">
                <div id="col-left">
                    <h2>Trending</h2>
                </div>

                <div id="timeline">
                    <h2>{pageUserId}'s Profile</h2>

                </div>

                <div id="col-right">
                    <h2>About</h2>

                </div>
            </div>

        </div>
    )
}

export default UserPage