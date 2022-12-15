import React from 'react';
import './LoginForm.css';
import { useState } from 'react'

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

  async function sendToServer(url, data) {
    const options = {
      method: 'POST',
      // Headers consist of meta data. We're telling the server that we're sending a JSON.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const response = await fetch(url, options);
    return response.json();
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
          <button name="login" id="button-login01" onClick={() => loginToServer()} >LOGIN</button>
          <button id="button-login02">LOGIN (TEST)</button>
          <button id="button-login02">Register</button>
        </div>

        <p></p>
        {/* {console.log(password)} */}
      </form>
    </div>
  )
}

