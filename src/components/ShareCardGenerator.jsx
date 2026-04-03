import React, { useRef, useCallback, useState } from 'react';

export default function ShareCardGenerator({ result }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#faf9f6',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `ideology-profile-${result.cluster.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to generate image:', e);
    }
  }, [result]);

  const comparativeLine = result.comparativeInsights?.[0] || '';
  const shareText = [
    `I am a ${result.cluster}${result.typology ? ` (${result.typology})` : ''}.`,
    `Economic: ${result.economic > 0 ? '+' : ''}${result.economic} | Social: ${result.social > 0 ? '+' : ''}${result.social}.`,
    `Closest alignment: ${result.closestFigures?.[0]?.name || 'N/A'}.`,
    comparativeLine,
    'Take the Ideology Compass:',
  ].filter(Boolean).join(' ');

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/results/${result.id}` : '';

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToReddit = () => {
    window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(`I am a ${result.cluster} — Ideology Compass`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="share-generator">
      <div ref={cardRef} className="share-card" style={{
        background: '#faf9f6', padding: 32, borderRadius: 12, border: '1px solid #e2e0dc',
        maxWidth: 520, fontFamily: "'IBM Plex Sans', sans-serif",
      }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#c4a035', marginBottom: 8 }}>
          Ideology Compass
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          {result.cluster}
        </div>
        {result.typology && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#5a5a6e' }}>
            Typology: {result.typology}
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
            <span style={{ color: '#5a5a6e' }}>Economic</span>{' '}
            <span style={{ fontWeight: 600, color: result.economic < 0 ? '#2563eb' : '#dc2626' }}>
              {result.economic > 0 ? '+' : ''}{result.economic}
            </span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
            <span style={{ color: '#5a5a6e' }}>Social</span>{' '}
            <span style={{ fontWeight: 600, color: result.social < 0 ? '#7c3aed' : '#d97706' }}>
              {result.social > 0 ? '+' : ''}{result.social}
            </span>
          </div>
        </div>
        {result.closestFigures?.length > 0 && (
          <div style={{ fontSize: 13, color: '#5a5a6e', marginBottom: 8 }}>
            Closest alignment: <strong style={{ color: '#1a1a2e' }}>{result.closestFigures.map(f => f.name).join(', ')}</strong>
          </div>
        )}
        {comparativeLine && (
          <div style={{ fontSize: 12, color: '#1a1a2e' }}>
            {comparativeLine}
          </div>
        )}
      </div>

      <div className="share-actions" style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-sm btn-primary" onClick={downloadCard}>Download PNG</button>
        <button className="btn btn-sm btn-secondary" onClick={shareToTwitter}>Twitter</button>
        <button className="btn btn-sm btn-secondary" onClick={shareToReddit}>Reddit</button>
        <button className="btn btn-sm btn-secondary" onClick={shareToLinkedIn}>LinkedIn</button>
        <button className="btn btn-sm btn-secondary" onClick={() => {
          navigator.clipboard?.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}>{copied ? 'Copied!' : 'Copy Link'}</button>
      </div>
    </div>
  );
}
