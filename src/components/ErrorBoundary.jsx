import React from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, marginBottom: 'var(--spacing-md)' }}>Something went wrong</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)', maxWidth: 480, margin: '0 auto var(--spacing-xl)' }}>
            An unexpected error occurred. Try refreshing the page or navigating back to the home page.
          </p>
          {this.state.error && (
            <pre style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)',
              fontSize: 12, textAlign: 'left', maxWidth: 560, margin: '0 auto var(--spacing-xl)',
              overflow: 'auto', color: 'var(--color-text-secondary)',
            }}>
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
            <Link to="/" className="btn btn-secondary" onClick={() => this.setState({ hasError: false, error: null })}>
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
