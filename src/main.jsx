import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { validateClientEnv } from './utils/env';
import { registerServiceWorker } from './utils/pwa';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const envStatus = validateClientEnv();
registerServiceWorker();

function ConfigErrorPage({ status }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: 860, border: '1px solid #ef4444', borderRadius: 12, padding: 24, background: '#fff' }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Configuration error</h1>
        <p style={{ marginTop: 0 }}>
          The app is missing required environment variables and cannot safely run.
        </p>

        <div style={{ margin: '16px 0', padding: 12, borderRadius: 8, background: '#fff5f5', border: '1px solid #fecaca' }}>
          <strong>Missing variables</strong>
          <ul style={{ marginBottom: 0 }}>
            {status.details.map((line) => (
              <li key={line}><code>{line}</code></li>
            ))}
          </ul>
        </div>

        <h2 style={{ marginBottom: 8 }}>Operator remediation</h2>
        <ol style={{ lineHeight: 1.7 }}>
          <li>In Vercel, open Project → Settings → Environment Variables.</li>
          <li>Add/update <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> for the correct environment (Production and Preview as needed).</li>
          <li>Redeploy the app. Vite environment variables are injected at build time, so env changes do not affect already-built deployments.</li>
          <li>Confirm the new deployment is serving the latest build and that this error page no longer appears.</li>
        </ol>

        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 0 }}>
          Runtime mode: <code>{status.mode}</code>
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          {envStatus.ok ? <App /> : <ConfigErrorPage status={envStatus} />}
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
