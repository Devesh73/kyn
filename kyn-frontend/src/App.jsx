import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Headers from './components/Header';
import Footer from './components/Footer';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import MultiFactor from './screens/Multifactor';
import Home from './screens/Home';
import Users from './screens/Users';
import UserDetails from './components/UserDetails'; // Add this
import CommunityDetails from './components/CommunityDetails'; // Add this

function App() {
  return (
    <Router>
      <Headers />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Multifactor" element={<MultiFactor />} />
        <Route path="/users" element={<Users />} />
        
        {/* Route for User Details */}
        <Route path="/user/:userId" element={<UserDetails />} />
        
        {/* Route for Community Details */}
        <Route path="/community/:communityId" element={<CommunityDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
