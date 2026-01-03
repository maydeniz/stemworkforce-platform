// ===========================================
// Application Entry Point
// ===========================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Performance monitoring (optional)
if (import.meta.env.PROD) {
  // Add production monitoring here (e.g., Sentry, DataDog)
}

// Render application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
