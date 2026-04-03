import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, login, createAccount, logout, deleteUserData, deleteAccount, getUserResults, hydrateSession } from '../utils/authStore';
import { trackEvent, Events } from '../utils/analytics';
import EvolutionChart from '../charts/EvolutionChart';

export default function ProfilePage() {
  const [session, setSession] = useState(getSession());
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'signup'
      ? await createAccount(email, password)
      : await login(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      const hydrated = await hydrateSession();
      setSession(hydrated || result.user);
      if (mode === 'signup') trackEvent(Events.ACCOUNT_CREATED);
      trackEvent(Events.PROFILE_VIEWED);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSession(null);
  };

  const handleDeleteData = () => {
    deleteUserData();
    setSession(getSession());
    setShowDeleteConfirm(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setSession(null);
    navigate('/');
  };

  // Not logged in — show auth form
  if (!session) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 440 }}>
        <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </h1>

        <div className="card">
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 'var(--spacing-md)' }}>{error}</p>
            )}
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
            {mode === 'signup' && (
              <p style={{ marginTop: 'var(--spacing-sm)', color: 'var(--color-text-secondary)', fontSize: 12 }}>
                You may need to verify your email before first login, depending on Supabase settings.
              </p>
            )}
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: 14, color: 'var(--color-text-secondary)' }}>
            {mode === 'login' ? (
              <>Don't have an account? <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-body)' }} onClick={() => setMode('signup')}>Sign up</button></>
            ) : (
              <>Already have an account? <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-body)' }} onClick={() => setMode('login')}>Log in</button></>
            )}
          </p>
        </div>

        <div className="privacy-notice">
          Your email is used only for authentication and is never linked to your quiz results. All quiz data is anonymized.
          You can delete your account and all associated data at any time.
        </div>
      </div>
    );
  }

  // Logged in — show profile
  const results = getUserResults();
  const profile = results.length ? {
    latestCluster: results[results.length - 1].cluster,
    latestEconomic: results[results.length - 1].economic,
    latestSocial: results[results.length - 1].social,
    closestFigures: results[results.length - 1].closestFigures || [],
    topIssues: results[results.length - 1].topIssues || [],
  } : null;

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Your Profile
          </span>
          <h1 style={{ fontSize: 36 }}>Ideology Profile</h1>
        </div>
        <button className="btn btn-sm btn-secondary" onClick={handleLogout}>Log Out</button>
      </div>

      {profile ? (
        <>
          {/* Current ideology */}
          <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
              <div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Type</span>
                <h3 style={{ fontSize: 22 }}>{profile.latestCluster}</h3>
              </div>
              <div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Economic</span>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)', color: profile.latestEconomic < 0 ? 'var(--color-economic-left)' : 'var(--color-economic-right)' }}>
                  {profile.latestEconomic > 0 ? '+' : ''}{profile.latestEconomic}
                </div>
              </div>
              <div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Social</span>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)', color: profile.latestSocial < 0 ? 'var(--color-social-prog)' : 'var(--color-social-cons)' }}>
                  {profile.latestSocial > 0 ? '+' : ''}{profile.latestSocial}
                </div>
              </div>
            </div>
          </div>

          {/* Historical figures */}
          {profile.closestFigures?.length > 0 && (
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Closest Historical Figures</h3>
              {profile.closestFigures.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < profile.closestFigures.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ fontSize: 14 }}>{f.name}</span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>distance: {f.distance?.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Top issues */}
          {profile.topIssues?.length > 0 && (
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Top Policy Issues</h3>
              <ol style={{ paddingLeft: 'var(--spacing-lg)', fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 2 }}>
                {profile.topIssues.map((issue, i) => <li key={i}>{issue}</li>)}
              </ol>
            </div>
          )}

          {/* Evolution timeline */}
          {results.length > 0 && (
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>How Your Ideology Has Evolved</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--spacing-lg)' }}>
                {results.length} quiz{results.length > 1 ? ' results' : ' result'} recorded.
              </p>

              {results.length >= 2 && <EvolutionChart results={results} />}

              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                {results.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}>
                    <span className="mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: 14 }}>{r.cluster}</span>
                    <span className="mono" style={{ fontSize: 13 }}>
                      E:{r.economic} S:{r.social}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h3>No Results Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
            Take the quiz while logged in to start tracking your ideology.
          </p>
          <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
        <Link to="/quiz" className="btn btn-primary">Retake Quiz</Link>
        <Link to="/debate/new" className="btn btn-secondary">Start a Debate</Link>
      </div>

      {/* Data management */}
      <div className="card" style={{ borderColor: 'var(--color-danger)', borderStyle: 'dashed' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-md)' }}>Data Management</h3>
        {!showDeleteConfirm ? (
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setShowDeleteConfirm(true)}>
              Delete My Data
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--spacing-md)' }}>
              Are you sure? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button className="btn btn-sm btn-danger" onClick={handleDeleteData}>Delete Data Only</button>
              <button className="btn btn-sm btn-danger" onClick={handleDeleteAccount}>Delete Entire Account</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
