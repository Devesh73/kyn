
import './App.css'
import Headers from './components/Header'
import Footer from './components/Footer'
import  Button  from './components/Button'
import Dashboard from './screens/Dashboard'
import Button2 from './components/Button2'

function App() {
  

  return (
    <>
      <Headers />
      {/* <div className="flex justify-center mt-8">
        <Button onClick={() => alert("Button Clicked!")}>Get Started</Button>
      </div>
      <div className="flex justify-center mt-8">
        <Button2 onClick={() => alert("Button Clicked!")}>Get Started</Button2>
      </div> */}
      <Dashboard />
      <Footer />
    </>
  )
}

export default App
