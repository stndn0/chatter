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
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </div>
  )
}

export default App
