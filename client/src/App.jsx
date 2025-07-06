
import React, { useState, useEffect } from 'react';
import TaskList from './screens/TaskList';
import Login from './screens/Login';
import Logout from './components/Logout';
import '../public/bootstrap.css';
import './bg.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check for token in URL (after Google login)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    if (token) {
      localStorage.setItem('token', token);
      if (name) {
        setUserName(decodeURIComponent(name));
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);
      }
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, '/');
    } else if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111',
          color: '#fff',
          padding: '16px 32px',
          borderRadius: 8,
          fontSize: 20,
          zIndex: 3000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          fontWeight: 600,
          letterSpacing: 1,
        }}>
          Welcome, {userName || 'User'}!
        </div>
      )}
      {isAuthenticated ? (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginTop: 32,
            marginBottom: 16,
          }}>
            <h2 className="display-6 fw-bold text-dark mb-0" style={{letterSpacing: 1, marginRight: 24}}>My Tasks</h2>
            <Logout onLogout={handleLogout} />
          </div>
          <TaskList hideTitle />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
