import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defensive check for potential environment telemetry
if (typeof window !== 'undefined') {
  (window as any).app = (window as any).app || {};
}

createRoot(document.getElementById('root')!).render(
    <App />
);
