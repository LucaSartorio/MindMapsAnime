import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // inizializza i18next prima del primo render
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
