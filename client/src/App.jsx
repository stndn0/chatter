import { useState } from 'react'
import { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";

import './index.css'
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Timeline from './pages/Timeline';
import UserPage from './pages/UserPage';
import FullPost from './pages/FullPost';
import Settings from './pages/Settings';

function App() {
  // Store back-end data
  const [data, setData] = useState(null)
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userid, setuserID] = useState(null);
  const [username, setUsername] = useState(null);
  const [userBio, setUserbio] = useState(null);
  const [refreshPage, setRefreshPage] = useState(null);

  const updateAccessToken = (token) => { setAccessToken(token) }
  const updateRefreshToken = (token) => { setRefreshToken(token) }
  const updateUserID = (id) => { setuserID(id) }
  const updateUsername = (username) => { setUsername(username) }
  const updateBio = (bio) => { setUserbio(bio) }
  const updateRefreshPage = () => { setRefreshPage(refreshPage + 1) }

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
      <Navbar accessToken={accessToken} updateAccessToken={updateAccessToken} userid={userid} updateUserID={updateUserID} />
      <Routes>
        {/* <Route path="/" element={<Login accessToken={accessToken} updateAccessToken={updateAccessToken} refreshToken={refreshToken} updateRefreshToken={updateRefreshToken} />}></Route> */}

        <Route path="/login" element={<Login accessToken={accessToken} updateAccessToken={updateAccessToken} refreshToken={refreshToken} updateRefreshToken={updateRefreshToken} username={username} updateUsername={updateUsername} updateBio={updateBio} userid={userid} updateUserID={updateUserID} />}></Route>

        <Route path="/timeline" element={<Timeline accessToken={accessToken} username={username} updateUsername={updateUsername} userBio={userBio} updateBio={updateBio} userid={userid} updateUserID={updateUserID} refreshPage={refreshPage} updateRefreshPage={updateRefreshPage}/>}></Route>

        <Route path="/register" element={<Register></Register>}></Route>

        <Route path="/userpage" element={<UserPage accessToken={accessToken} userid={userid}></UserPage>}></Route>

        <Route path="/fullpost" element={<FullPost accessToken={accessToken} userid={userid}></FullPost>}></Route>

        <Route path="/settings" element={<Settings accessToken={accessToken} userid={userid} updateUsername={updateUsername}></Settings>}></Route>
      </Routes>
    </div>
  )
}

export default App
