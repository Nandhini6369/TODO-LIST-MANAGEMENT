import React from 'react';

const Logout = ({ onLogout }) => (
  <button
    style={{
      position: 'fixed',
      top: 24,
      right: 24,
      background: '#e53935',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      padding: '8px 16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: 2001,
    }}
    onClick={onLogout}
  >
    Logout
  </button>
);

export default Logout;
