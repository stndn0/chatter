import React from 'react';
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { sendToServer } from '../helpers/apiFunctions';
import './LoginForm.css';
import loading01 from '../assets/anims/loading01.svg';

// Login form contents is sent to the back end
const postRoute = "http://localhost:5000/auth/login"


export function LoginForm(props) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();   // We use this hook to redirect the user to the timeline upon login.
  const [serverResponse, setServerResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateServerResponse = (response) => {
    setServerResponse(response);
  }

  const updateIsLoading = bool => {
    setIsLoading(bool)
  }

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
    updateIsLoading(true);
    updateServerResponse("")

    sendToServer(postRoute, { username, password })
      .then((data) => {
        console.log("*** RESPONSE FROM SERVER ***")
        updateIsLoading(false);
        console.log(data);

        // If the response contains an access token then it means the user is authorized. Update state to reflect that.
        try {
          if (data.response === 403) {
            updateServerResponse("Invalid credentials. Please verify your username and password and try again.")
          }

          if (data.accessToken != undefined && data.refreshToken != undefined) {
            props.updateUsername(data.username)
            props.updateUserID(data.userid)
            props.updateAccessToken(data.accessToken);
            props.updateRefreshToken(data.refreshToken);
            props.updateBio(data.bio);

            // Redirect
            updateServerResponse("Successful login! You are now being redirected...")
            console.log("Redirect...")
            navigate("/timeline")

          }
        } catch (error) {
          console.log("Client: Error when setting data. Likely due to bad server response.");
          console.log(error)
        }
      })
  };


  // DUPLICATED FUNCTION TO ALLOW FOR AUTOMATIC LOGIN AS A TEST ACCOUNT
  // FOR DEVELOPMENT ONLY. TO BE DELETED IN RELEASE BUILD.
  const loginToServerDebug = (username, password) => {
    event.preventDefault();
    updateIsLoading(true);
    updateServerResponse("")

    sendToServer(postRoute, { username, password })
      .then((data) => {
        console.log("*** RESPONSE FROM SERVER ***")
        updateIsLoading(false);
        console.log(data);

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


  const loadingAnimation = () => {
    if (isLoading) {
      return (
        <div>
          <img id="loading-01" src={loading01}></img>
        </div>
      )
    }
    return (
      <div></div>
    )
  }


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
          <button className='button-01' name="login" id="button-login" onClick={() => loginToServer()} >Login</button>
          <button className='button-02' id="button-login-debug" onClick={() => loginToServerDebug("test", "1234")}>Login (Debug)</button>
          <Link to="/register" id='sign-up'>Sign up</Link>
        </div>

        <div id="server-feedback-container">
          <p id="server-feedback-text">{serverResponse}</p>
        </div>

        {loadingAnimation()}
      </form>
    </div>
  )
}

