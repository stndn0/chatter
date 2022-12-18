import { useState } from 'react'
import { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";

import './index.css'
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Store back-end data
  const [data, setData] = useState(null)
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const updateAccessToken = (token) => { setAccessToken(token)}
  const updateRefreshToken = (token) => { setRefreshToken(token)}
  
  // Make a test call to the back-end
  useEffect(() => {
    fetch("/api")
      .then(response => response.json())
      .then(
        data => {
          setData(data)
        }
      )
  }, [])  // Empty array - useEffect will only run on first render of page

  return (
    <div className="App">
      <Navbar accessToken={accessToken} updateAccessToken={updateAccessToken} />
      <Routes>
        <Route path="/" element={<Login accessToken={accessToken} updateAccessToken={updateAccessToken} refreshToken={refreshToken} updateRefreshToken={updateRefreshToken} />}></Route>
        <Route path="/login" element={<Login accessToken={accessToken} updateAccessToken={updateAccessToken} refreshToken={refreshToken} updateRefreshToken={updateRefreshToken}/>}></Route>
        <Route path="/register" element={<Register accessToken={accessToken} updateAccessToken={updateAccessToken} refreshToken={refreshToken} updateRefreshToken={updateRefreshToken}/>}></Route>
      </Routes>
    </div>
  )
}

export default App
