import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trackEvent, Events } from '../utils/analytics';
import EvolutionChart from '../charts/EvolutionChart';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const {
    user,
    profile,
    results,
    authLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearResults,
    removeAccount,
  } = useAuth();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [ageBand, setAgeBand] = useState(profile?.age_band || '');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const result = mode === 'signup'
      ? await signUp(email, password)
      : await signIn(email, password);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === 'signup') {
      trackEvent(Events.ACCOUNT_CREATED);
      if (result.needsEmailVerification) {
        setNotice('Account created. Check your email to verify your account before signing in.');
      }
    }

    trackEvent(Events.PROFILE_VIEWED);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteData = async () => {
    await clearResults();
    setShowDeleteConfirm(false);
  };

  const handleDeleteAccount = async () => {
    await removeAccount();
    navigate('/');
  };

  const handleProfileSave = async () => {
    setError('');
    try {
      await updateProfile({
        display_name: displayName,
        country,
        age_band: ageBand,
      });
      setNotice('Profile updated.');
    } catch (updateError) {
      setError(updateError.message || 'Unable to update profile.');
    }
  };

  const latest = useMemo(() => (results.length ? results[0] : null), [results]);

  if (!user) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 440 }}>
        <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </h1>

        <div className="card">
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Password</label>
              <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginBottom: 'var(--spacing-md)' }}>{error}</p>}
            {notice && <p style={{ color: 'var(--color-success)', fontSize: 13, marginBottom: 'var(--spacing-md)' }}>{notice}</p>}
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }} disabled={authLoading}>
              {authLoading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: 14, color: 'var(--color-text-secondary)' }}>
            {mode === 'login' ? (
              <>Don't have an account? <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-body)' }} onClick={() => setMode('signup')}>Sign up</button></>
            ) : (
              <>Already have an account? <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-body)' }} onClick={() => setMode('login')}>Log in</button></>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>Your Profile</span>
          <h1 style={{ fontSize: 36 }}>Ideology Profile</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{user.email}</p>
        </div>
        <button className="btn btn-sm btn-secondary" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Profile details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-md)' }}>
          <input className="input-field" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <input className="input-field" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <input className="input-field" placeholder="Age band" value={ageBand} onChange={(e) => setAgeBand(e.target.value)} />
        </div>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <button className="btn btn-sm btn-primary" onClick={handleProfileSave}>Save Profile</button>
        </div>
      </div>

      {latest ? (
        <>
          <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
              <div><span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Cluster</span><h3 style={{ margin: 0 }}>{latest.cluster}</h3></div>
              <div><span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Economic</span><div style={{ fontSize: 28, fontWeight: 700 }}>{latest.economic > 0 ? '+' : ''}{latest.economic}</div></div>
              <div><span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Social</span><div style={{ fontSize: 28, fontWeight: 700 }}>{latest.social > 0 ? '+' : ''}{latest.social}</div></div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Result history</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--spacing-lg)' }}>
              {results.length} quiz{results.length > 1 ? ' results' : ' result'} saved.
            </p>
            {results.length >= 2 && <EvolutionChart results={[...results].reverse()} />}
            {results.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span className="mono" style={{ fontSize: 13 }}>{new Date(r.timestamp).toLocaleString()}</span>
                <span style={{ fontSize: 14 }}>{r.cluster}</span>
                <span className="mono" style={{ fontSize: 13 }}>E:{r.economic} S:{r.social}</span>
              </div>
            ))}
          </div>
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

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
        <Link to="/quiz" className="btn btn-primary">Retake Quiz</Link>
        <Link to="/debate/new" className="btn btn-secondary">Start a Debate</Link>
      </div>

      <div className="card" style={{ borderColor: 'var(--color-danger)', borderStyle: 'dashed' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-md)' }}>Data Management</h3>
        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
        {notice && <p style={{ color: 'var(--color-success)' }}>{notice}</p>}
        {!showDeleteConfirm ? (
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setShowDeleteConfirm(true)}>Delete My Data</button>
            <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--spacing-md)' }}>Are you sure? This action cannot be undone.</p>
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
