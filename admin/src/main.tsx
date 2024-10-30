import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './pages/Authentication/AuthProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
    <Toaster />
  </React.StrictMode>,
);
