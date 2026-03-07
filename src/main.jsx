import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { validateClientEnv } from './utils/env';
import './index.css';

const envStatus = validateClientEnv();

function EnvironmentError({ details }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ maxWidth: 760, border: '1px solid #ef4444', borderRadius: 12, padding: 24, background: '#fff5f5' }}>
        <h1 style={{ marginTop: 0 }}>Configuration error</h1>
        <p>The app is missing required environment variables and cannot safely run in production.</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{details}</pre>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        {envStatus.ok ? <App /> : <EnvironmentError details={envStatus.message} />}
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
