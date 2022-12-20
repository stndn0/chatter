import React from 'react';
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { sendToServer } from '../helpers/apiFunctions';
import './LoginForm.css';

// Login form contents is sent to the back end
const postRoute = "http://localhost:5000/auth/login"


export function LoginForm(props) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();   // We use this hook to redirect the user to the timeline upon login.

  // Gets the values of the input fields and updates the state.
  const handleUsernameInput = event => {
    setUsername(event.target.value)
  }
  const handlePasswordInput = event => {
    setPassword(event.target.value)
  }

  // Post username and password to server and handle response from server.
  const loginToServer = () => {
    // Stop the page from reloading when the user clicks the Login button.
    // See: https://stackoverflow.com/questions/63880605/react-js-how-to-prevent-page-reload-once-click-on-the-link-right-now-the-whole
    event.preventDefault();

    sendToServer(postRoute, { username, password })
      .then((data) => {
        console.log("*** RESPONSE FROM SERVER ***")
        console.log(data);

        // If the response contains an access token then it means the user is authorized. Update state to reflect that.
        try {
          if (data.accessToken != undefined && data.refreshToken != undefined) {
            props.updateUsername(data.username)
            props.updateUserID(data.userid)
            props.updateAccessToken(data.accessToken);
            props.updateRefreshToken(data.refreshToken);
            props.updateBio(data.bio);

            // Redirect
            console.log("Redirect...")
            navigate("/timeline")

          }
        } catch (error) {
          console.log("Client: Error when setting data. Likely due to bad server response.");
          console.log(error)
        }
      })
  };


  // Testing API call. Remove later.
  // const loadTimeline = () => {
  //   event.preventDefault();
  //   const AUTH_URL = "http://localhost:5000/auth/test/";

  //   sendToServerAuthorized(AUTH_URL, props.accessToken)
  //     .then((data => {
  //       console.log("*** RESPONSE FROM SERVER ***");
  //       console.log(data);
  //     }))
  // }

  return (
    <div id="login-form-container">
      <h1>Login</h1>

      <form id="form">
        <div id="user-details">
          <label>Username</label>
          <input name="username" type="text" id="username" className="textbox" placeholder="Type your username" onChange={handleUsernameInput}></input>
          <label>Password</label>
          <input name="password" type="text" id="password" className="textbox" placeholder="Type your password" onChange={handlePasswordInput}></input>
        </div>


        <div id="buttons-container">
          <button name="login" id="button-login01" onClick={() => loginToServer()} >LOGIN</button>
          <button id="button-login02">LOGIN (TEST)</button>
          <button id="button-login02" onClick={() => loadTimeline()}>MIDDLEWARE (TEST)</button>
          <Link to="/register">Register</Link>
        </div>

        <p></p>
      </form>
    </div>
  )
}

