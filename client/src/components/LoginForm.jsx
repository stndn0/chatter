import React from 'react';
import { useState } from 'react'
import { Link } from "react-router-dom"
import { sendToServer } from '../helpers/apiFunctions';
import './LoginForm.css';

// Login form contents is sent to the back end
const postRoute = "http://localhost:5000/auth/login"


export function LoginForm() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

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

    console.log("SENDING TO SERVER")

    sendToServer(postRoute, { username, password })
      .then((data) => {
        console.log(data);
      })
  };


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
          <Link to="/register">Register</Link>
        </div>

        <p></p>
        {/* {console.log(password)} */}
      </form>
    </div>
  )
}

