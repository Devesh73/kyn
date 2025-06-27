import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Home from './screens/Home';
import Users from './screens/Users';
import PrototypePage from './screens/PrototypePage';

function AppContent() {
  const location = useLocation();
  const isPrototype = location.pathname === '/prototype';

  return (
    <>
      {!isPrototype && <Header />}
      <main className={isPrototype ? "h-screen" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/prototype" element={<PrototypePage />} />
        </Routes>
      </main>
      {!isPrototype && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
