import React from "react";
import "./Timeline.css";
import "./UserPage.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getFromServer,
  sendToServerAuthenticated,
} from "../helpers/apiFunctions";
import Post from "../components/Post";
import WhoToFollow from "../components/WhoToFollow";

const ENDPOINT_FOLLOW_USER = "http://localhost:5000/user/followuser";

function UserPage(props) {
  // We need to initalize a null user.
  // The react engine will fall back to this if the state hasn't changed.
  const nullUser = {
    username: "",
    userbio: "",
    followers: "",
    following: "",
  };

  const [pageUserId, setPageUserId] = useState(null);
  const [pageUser, setPageUser] = useState(nullUser);
  const [pageUserPosts, setPageUserPosts] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [followButtonText, setFollowButtonText] = useState("Follow");

  const updatePageUserId = (userid) => {
    setPageUserId(userid);
  };

  const updatePageUserPosts = (arr) => {
    setPageUserPosts(arr);
  };

  const updatePageUser = (obj) => {
    setPageUser(obj);
  };

  const updateFollowButtonText = (str) => {
    setFollowButtonText(str);
  };

  // Run on first load to get the userid and set the state.
  useEffect(() => {
    // Get the userid from the URL.
    // Use trycatch in case a query is not passed.
    try {
      updatePageUserId(searchParams.get("id"));
      // console.log("USERID (First Load):", pageUserId);
      console.log("********UseEffect1*******************");
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Run whenever the userId for the current page has changed.
  // When this happens, we send a GET request to the server so that we can
  // populate this page with data about this user (e.g. their tweets and so on...)
  useEffect(() => {
    // console.log("USERID (STATE CHANGE):", pageUserId);
    // Send a GET request to the server so that we can get the data
    // we need to render this users page.

    if (pageUserId != null) {
      const ENDPOINT_USERPAGE =
        "http://localhost:5000/user/userpage/" + pageUserId;
      getFromServer(ENDPOINT_USERPAGE).then((data) => {
        console.log("*** RESPONSE FROM SERVER ***");
        console.log(data);
        updatePageUserPosts(data.posts);
        updatePageUser(data.user);

        if (data.user.followers.includes(props.userid)) {
          updateFollowButtonText("Unfollow");
        }

        console.log("EU2", pageUserPosts);
        // TODO - update page state with this data (username, bio etc...)
        // then populate the rest of the JSX with this information.
      });
    }
  }, [pageUserId]);

  const displayPosts = () => {
    const divs = [];
    if (pageUserPosts != null) {
      for (let object of pageUserPosts) {
        Object.assign(object, {accessToken: props.accessToken, clientuserid: props.userid})
        divs.push(<Post data={object}></Post>);
      }
    }

    return <div id="timeline-feed">{divs}</div>;
  };

  const handleFollowButton = () => {
    console.log("follow");
    sendToServerAuthenticated(ENDPOINT_FOLLOW_USER, props.accessToken, {
      sender: props.userid,
      userToFollow: pageUserId,
    }).then((data) => {
      console.log("*** FOLLOW BUTTON RESPONSE FROM SERVER ***");
      console.log(data.user.followers);

      // Set the state of the follow button based on whether the client is following the profile.
      if (data.user.clientIsFollowing === true) {
        console.log("IF");
        updateFollowButtonText("Unfollow");
      } else {
        console.log("Else");
        updateFollowButtonText("Follow");
      }

      // for (let userid of data.user.followers) {
      //     if (userid === props.userid) {
      //         console.log("MATCH!!!!")
      //         updateFollowButtonText("Unfollow");
      //     }
      // }
    });
  };

  // Function to display the follow button to the client
  // The button is dynamic. It should display a different text depending on whether the client is following the user.
  const renderFollowButton = () => {
    // Go through followers array and see if the client userID is within the array
    // console.log(pageUser);
    // console.log(props.userid)

    // for (let userid of pageUser.followers) {
    //     if (userid === props.userid) {
    //         console.log("IS FOLLOWING")
    //         updateFollowButtonText("Unfollow");
    //     }
    // }

    return (
      <button
        onClick={() => handleFollowButton()}
        className="button-01"
        id="button-follow"
      >
        {followButtonText}
      </button>
    );
  };

  return (
    <div id="page-root">
      <div id="grid-container">
        <div id="col-left">
          <h2>Explore</h2>
          <WhoToFollow {...props}></WhoToFollow>
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
  );
}

export default UserPage;
