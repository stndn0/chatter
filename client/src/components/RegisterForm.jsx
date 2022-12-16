import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { sendToServer } from '../helpers/apiFunctions';
import './LoginForm.css';

// Login form contents is sent to the back end
const postRoute = "http://localhost:5000/auth/register"


export function RegisterForm() {
    const [username, setUsername] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);

    // Gets the values of the input fields and updates the state.
    const handleUsernameInput = event => {
        setUsername(event.target.value)
    }
    const handlePassword1Input = event => {
        setPassword1(event.target.value)
    }
    const handlePassword2Input = event => {
        setPassword2(event.target.value)
    }

    // Post username and password to server and handle response from server.
    const registerToServer = () => {
        // Stop the page from reloading when the user clicks the Login button.
        // See: https://stackoverflow.com/questions/63880605/react-js-how-to-prevent-page-reload-once-click-on-the-link-right-now-the-whole
        event.preventDefault();

        console.log("SENDING TO SERVER")

        sendToServer(postRoute, { username, password1, password2 })
            .then((data) => {
                console.log(data);
            })
    };



    return (
        <div id="login-form-container">
            <h1>Register</h1>

            <form id="form">
                <div id="user-details">
                    <label>Username</label>
                    <input name="username" type="text" id="username" className="textbox" placeholder="Type your username" onChange={handleUsernameInput}></input>
                    <label>Password</label>
                    <input name="password1" type="text" id="password1" className="textbox" placeholder="Type your password" onChange={handlePassword1Input}></input>
                    <label>Password (Verify)</label>
                    <input name="password2" type="text" id="password2" className="textbox" placeholder="Type your password again" onChange={handlePassword2Input}></input>
                </div>

                <div id="buttons-container">
                    <button name="Register" id="button-login01" onClick={() => registerToServer()} >Register</button>
                    <Link to="/login">Login Page</Link>
                </div>

                <p></p>
            </form>
        </div>
    )
}
