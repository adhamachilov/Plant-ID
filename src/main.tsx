import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/flipCard.css';

// Define a global base URL for assets that works in both development and production
window.BASE_URL = window.location.hostname === 'localhost' ? '' : '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
