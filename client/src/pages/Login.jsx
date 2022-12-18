import React from 'react'
import { LoginForm } from '../components/LoginForm';
import './Login.css';

export default function Login(props) {
    return (
        <div id="page-container">
            <LoginForm accessToken= {props.accessToken} updateAccessToken={props.updateAccessToken} refreshToken={props.refreshToken} updateRefreshToken={props.updateRefreshToken} />
        </div>
    )
}
