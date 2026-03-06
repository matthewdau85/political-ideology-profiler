import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;

    setSending(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 640 }}>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-sm)' }}>Contact</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.8 }}>
        Questions, feedback, data requests, or issues — send us a message and we'll get back to you.
      </p>

      {status === 'success' && (
        <div className="card" style={{ borderColor: 'var(--color-success)', marginBottom: 'var(--spacing-xl)' }}>
          <p style={{ color: 'var(--color-success)', fontWeight: 500 }}>
            Message sent. We'll get back to you as soon as possible.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="card" style={{ borderColor: 'var(--color-danger)', marginBottom: 'var(--spacing-xl)' }}>
          <p style={{ color: 'var(--color-danger)', fontWeight: 500 }}>
            Something went wrong. Please try again or email us directly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
            Name
          </label>
          <input
            type="text"
            name="name"
            className="input-field"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name (optional)"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
            Email <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
            Subject
          </label>
          <select
            name="subject"
            className="input-field"
            value={form.subject}
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            <option value="">General Inquiry</option>
            <option value="Feedback">Feedback</option>
            <option value="Bug Report">Bug Report</option>
            <option value="Privacy Request">Privacy Request</option>
            <option value="Data Deletion">Data Deletion</option>
            <option value="Partnership">Partnership</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
            Message <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <textarea
            name="message"
            className="input-field"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message..."
            required
            rows={6}
            style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-body)' }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={sending || !form.email || !form.message}
          style={{ width: '100%' }}
        >
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
        For privacy-related requests, please select "Privacy Request" or "Data Deletion" as the subject.
      </p>
    </div>
  );
}
