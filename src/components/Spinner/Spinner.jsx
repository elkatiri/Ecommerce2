// Spinner.jsx
import React from 'react';
import './Spinner.css';

export default function Spinner({ overlay = false, className = '' }) {
  return (
    <div className={`spinner-container ${overlay ? 'overlay' : ''} ${className}`}>
      <div className="spinner" />
    </div>
  );
}
