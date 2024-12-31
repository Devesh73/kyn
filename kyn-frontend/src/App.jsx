import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Headers from './components/Header'
import Footer from './components/Footer'
import  Button  from './components/Button'

function App() {
  

  return (
    <>
      <Headers />
      <div className="flex justify-center mt-8">
        <Button onClick={() => alert("Button Clicked!")}>Get Started</Button>
      </div>
      <Footer />
    </>
  )
}

export default App
