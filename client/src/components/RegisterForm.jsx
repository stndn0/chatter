import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { sendToServer } from '../helpers/apiFunctions';
import './LoginForm.css';
import loading01 from '../assets/anims/loading01.svg';

// Login form contents is sent to the back end
const postRoute = "http://localhost:5000/auth/register"


export function RegisterForm(props) {
    const [username, setUsername] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);
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
        updateIsLoading(true);
        updateServerResponse("")

        sendToServer(postRoute, { username, password1, password2 })
            .then((data) => {
                console.log("*** RESPONSE FROM SERVER ***")
                updateIsLoading(false);
                console.log(data);
                if (data.response === 403) {
                    updateServerResponse("This username might already be taken or your passwords could be incorrect. Please try again.")
                }
                else {
                    updateServerResponse("Successful registration! You may now log in.")
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
                    <button name="Register" className="button-01" id="button-login" onClick={() => registerToServer()} >Register</button>
                    <Link to="/login" id='sign-up'>Login</Link>
                </div>

                <div id="server-feedback-container">
                    <p id="server-feedback-text">{serverResponse}</p>
                </div>

                {loadingAnimation()}
            </form>
        </div>
    )
}
