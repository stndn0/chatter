import React from "react";
import "../components/Post.css";
import "./FullPost.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getFromServer, sendToServerAuthenticated, } from "../helpers/apiFunctions";
import Post from '../components/Post';

export default function Reply(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [postID, setPostID] = useState(null);
  const [postData, setPostData] = useState(null);

  const updatePostID = (postid) => {
    setPostID(postid);
  };

  const updatePostData = (data) => {
    setPostData(data)
  };


  // On first load, get the post id from the URL and set the state.
  useEffect(() => {
    try {
      updatePostID(searchParams.get("postid"));
    } catch (error) {
      console.log(error);
    }
  }, []);


  // When the post id is acquired, ping the server for post data for this id.
  useEffect(() => {
    try {
      if (postID != null) {
        const ENDPOINT_USERPOST = "http://localhost:5000/user/fullpost/" + postID;

        getFromServer(ENDPOINT_USERPOST).then((data) => {
          console.log("*** RESPONSE FROM SERVER ***");
          updatePostData(data.post);
          console.log(data);

        });
      }
    }
    catch (error) {
      console.log(error);
    }
  }, [postID]);


  const displayUserPost = () => {
    if (postData != null) {
      console.log("displayUserPost NOT NULL CONDITION")
      return (
        <Post data={postData}></Post>
      )
    }
  }


  return (
    <div id="page-root">
      <div id="grid-container">
        <div id="col-left">
          <h2>Trending</h2>
        </div>

        <div id="timeline">
          <div id="userbox">
            <h2>Viewing Post</h2>
          </div>
          {displayUserPost()}
        </div>

        <div id="col-right">
          <h2>About</h2>
        </div>
      </div>
    </div>
  );
}
