import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import './Login.css';

export default function Register(props) {
  return (
    <div id="page-container">
      <RegisterForm accessToken= {props.accessToken} updateAccessToken={props.updateAccessToken} />
    </div>
  )
}
