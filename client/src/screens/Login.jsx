import React from 'react';
import { loginWithGoogle } from '../services/api';


const Login = () => (
  <div style={{
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `url('/public/bg.jpg') no-repeat center center fixed`,
    backgroundSize: 'cover',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
      padding: '48px 32px',
      minWidth: 340,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      justifyContent: 'center',
    }}>
      <h2 style={{ margin: 0, color: '#1976d2' }}>Login to Todo App</h2>
      <button
        onClick={loginWithGoogle}
        style={{
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 32px',
          fontWeight: 'bold',
          fontSize: 18,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#222'}
        onMouseOut={e => e.currentTarget.style.background = '#111'}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 24, height: 24, filter: 'invert(1)' }} />
        Sign in with Google
      </button>
    </div>
  </div>
);

export default Login;
