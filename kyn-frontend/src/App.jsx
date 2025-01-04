import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
// import MultiFactor from './screens/Multifactor';
import Home from './screens/Home';
import Users from './screens/Users';

function App() {
  return (
    <Router>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/multifactor" element={<MultiFactor />} /> */}
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
