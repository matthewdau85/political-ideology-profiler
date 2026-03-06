import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDebateById, saveDebate } from '../utils/resultsStore';
import { trackEvent, Events } from '../utils/analytics';
import { generateId } from '../utils/math';

function DebateView({ id }) {
  const debate = useMemo(() => getDebateById(id), [id]);
  const navigate = useNavigate();

  if (!debate) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>Debate not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          This debate link may be invalid or expired.
        </p>
        <Link to="/debate/new" className="btn btn-primary">Create New Debate</Link>
      </div>
    );
  }

  if (debate.user1 && debate.user2) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>Debate Complete</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          Both participants have completed the quiz.
        </p>
        <Link to={`/compare/${id}`} className="btn btn-primary">View Comparison</Link>
      </div>
    );
  }

  if (debate.user1 && !debate.user2) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 560 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Debate Challenge
          </span>
          <h2 style={{ margin: 'var(--spacing-md) 0' }}>You've Been Challenged</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            Someone wants to compare ideologies with you. Take the quiz to see how you compare.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              sessionStorage.setItem('active_debate', id);
              navigate('/quiz');
            }}
          >
            Accept Challenge — Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function NewDebate() {
  const [step, setStep] = useState('select');
  const [debateId, setDebateId] = useState('');
  const [resultId, setResultId] = useState('');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    try {
      const all = JSON.parse(localStorage.getItem('ideology_permalinks') || '{}');
      return Object.entries(all).map(([id, data]) => ({ id, ...data }));
    } catch {
      return [];
    }
  }, []);

  const createDebate = () => {
    const selected = results.find(r => r.id === resultId);
    if (!selected) return;

    const id = generateId(10);
    const debate = {
      id,
      createdAt: new Date().toISOString(),
      user1: {
        economic: selected.economic,
        social: selected.social,
        cluster: selected.cluster,
        radarScores: selected.radarScores,
        topIssues: selected.topIssues,
      },
      user2: null,
      summary: null,
    };

    saveDebate(debate);
    setDebateId(id);
    setStep('created');
    trackEvent(Events.DEBATE_CREATED, { debateId: id });
  };

  if (step === 'created') {
    const debateUrl = `${window.location.origin}/debate/${debateId}`;
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 560 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-success)' }}>
            Debate Created
          </span>
          <h2 style={{ margin: 'var(--spacing-md) 0' }}>Share This Link</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Send this link to your opponent. Once they take the quiz, you'll be able to compare results.
          </p>
          <div style={{
            background: 'var(--color-bg)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)', fontSize: 13, wordBreak: 'break-all', marginBottom: 'var(--spacing-lg)',
          }}>
            {debateUrl}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigator.clipboard?.writeText(debateUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h2>Take the Quiz First</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--spacing-md) 0' }}>
          Complete the ideology quiz before creating a debate.
        </p>
        <Link to="/quiz" className="btn btn-primary">Start Quiz</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 560 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Debate Mode
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>Challenge a Friend</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
        Select one of your results to use, then share the debate link.
      </p>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Select Your Result</h3>
        {results.map(r => (
          <label key={r.id} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm) 0', cursor: 'pointer',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <input
              type="radio"
              name="result"
              value={r.id}
              checked={resultId === r.id}
              onChange={() => setResultId(r.id)}
            />
            <span style={{ flex: 1 }}>
              <strong>{r.cluster}</strong>
              <span className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 8 }}>
                E:{r.economic} S:{r.social}
              </span>
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {new Date(r.timestamp).toLocaleDateString()}
            </span>
          </label>
        ))}

        <button
          className="btn btn-accent"
          style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
          disabled={!resultId}
          onClick={createDebate}
        >
          Create Debate Link
        </button>
      </div>
    </div>
  );
}

export default function DebatePage() {
  const { id } = useParams();

  if (id === 'new') {
    return <NewDebate />;
  }

  return <DebateView id={id} />;
}
