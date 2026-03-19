import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { persistUrlParamsAndClean } from './utils/urlParams';

// persist any URL params into localStorage and clean the address bar
// (keeps only session_id) before React mounts to avoid flashes
try {
  persistUrlParamsAndClean();
} catch (e) {
  // ignore errors during init
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
