import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import Login from './pages/Login';

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
      <Login />
    </div>
  )
}

export default App
