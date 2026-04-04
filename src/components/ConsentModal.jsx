import { useState, useEffect } from 'react'

export default function ConsentModal({ onConsent }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consented = localStorage.getItem('ideologycompass_consented')
    if (!consented) setVisible(true)
  }, [])

  function handleConsent() {
    localStorage.setItem('ideologycompass_consented', '1')
    setVisible(false)
    if (onConsent) onConsent()
  }

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Before You Begin</h2>
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>
          Your quiz responses may constitute <strong>political opinions</strong>, which is a category of <strong>sensitive personal information</strong> under the Australian Privacy Act 1988.
        </p>
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>
          By proceeding, you consent to Ideology Compass collecting and processing your responses to generate your political profile. Your data is stored securely and you may request deletion at any time.
        </p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
          This quiz is for educational and entertainment purposes only. Results do not constitute political advice.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleConsent} style={{ background: '#1d4ed8', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            I Agree &amp; Continue
          </button>
          <a href="/privacy" style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', color: '#374151', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}