import React from 'react';
import './LoginForm.css';

// Login form contents is sent to the back end
const postRoute = "http://localhost:5000/auth/login"

export function LoginForm() {
  return (
    <div id="login-form-container">
      <h1>Login</h1>

      <form id="form" action={postRoute} method="POST">
        <div id="user-details">
          <label>Username</label>
          <input name="username" type="text" id="username" className="textbox" placeholder="Type your username"></input>
          <label>Password</label>
          <input name="password" type="text" id="password" className="textbox" placeholder="Type your password"></input>
        </div>


        <div id="buttons-container">
          <button name="login" id="button-login01">LOGIN</button>
          <button id="button-login01">LOGIN (TEST)</button>
        </div>

        <p></p>
      </form>
    </div>
  )
}

