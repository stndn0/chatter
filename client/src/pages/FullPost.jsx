import React from "react";
import "../components/Post.css";
import "./FullPost.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getFromServer, sendToServerAuthenticated, } from "../helpers/apiFunctions";
import Post from '../components/Post';
import ReplyComposer from "../components/ReplyComposer";

export default function Reply(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [postID, setPostID] = useState(null);
  const [postData, setPostData] = useState(null);
  const [replies, setReplies] = useState(null);

  const updatePostID = (postid) => {
    setPostID(postid);
  };

  const updatePostData = (data) => {
    let postData = data;
    Object.assign(postData, {accessToken: props.accessToken, clientuserid: props.userid})
    setPostData(data);
  };

  const updatePostReplies = (arr) => {
    setReplies(arr);
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
          updatePostReplies(data.replyPosts)
          console.log("REPLY POSTS")
          console.log(data.replyPosts);

        });
      }
    }
    catch (error) {
      console.log(error);
    }
  }, [postID]);


  // When the post data is acquired, ping the server for replies to this post (if any)
  // useEffect(() => {
  //   try {
  //     if (postID != null) {

  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [replies])


  const displayUserPost = () => {
    if (postData != null) {
      console.log("Postdata:", postData)
      return (
        <Post data={postData}></Post>
      )
    }
  }

  const displayReplyComposer = () => {
    if (postData != null) {
      return (
        <ReplyComposer postID={postID} {...props}></ReplyComposer>
      )
    }
  }

  const displayReplies = () => {
    if (replies != null) {
      const replyDivs = [];

      console.log("Loop through replies...")
      for (let object of replies) {
        if (object != null) {
          console.log("Obj:", object)
          replyDivs.push(<Post data={object}></Post>);
        }
      }

      return (
        <div id='timeline-feed'>
          {replyDivs}
        </div>
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
          <h2>Reply</h2>
          {displayReplyComposer()}
          <h2>Replies</h2>
          {displayReplies()}
        </div>

        <div id="col-right">
          <h2>About</h2>
        </div>
      </div>
    </div>
  );
}
