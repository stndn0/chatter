import React from 'react';
import './LoginForm.css';

export function LoginForm() {
  return (
    <div id="login-form-container">
      <h2>Login</h2>

      <form id="user-details">
        <label>Username</label>
        <input type="text" id="username" className="textbox" placeholder="Type your username"></input>
        <label>Password</label>
        <input type="text" id="password" className="textbox" placeholder="Type your password"></input>
      </form>

      <div id="buttons-container">
        <button id="button-login01">LOGIN</button>
        <button id="button-login01">LOGIN (TEST)</button>
      </div>
    </div>
  )
}

