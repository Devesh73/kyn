import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Headers from './components/Header';
import Footer from './components/Footer';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import MultiFactor from './screens/Multifactor';

function App() {
  return (
    <Router>
      <Headers />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Multifactor" element={<MultiFactor />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;