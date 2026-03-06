import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 720 }}>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>Terms of Service</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.8 }}>
        Last updated: March 2026. By using the Political Ideology Profiler, you agree to these terms.
      </p>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>1. What This Tool Is</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          The Political Ideology Profiler is a free, educational quiz that estimates your political
          leanings based on your answers to 24 questions. It is not a scientific diagnosis, professional
          assessment, or official political classification. Results are approximate and should be
          treated as a starting point for reflection, not a definitive label.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>2. Acceptable Use</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          You may use this site for personal, educational, and non-commercial purposes. You agree not to:
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 2, paddingLeft: 'var(--spacing-lg)', fontSize: 14 }}>
          <li>Misrepresent quiz results as official or scientific classifications</li>
          <li>Use the tool to harass, profile, or discriminate against others</li>
          <li>Attempt to manipulate aggregate statistics by submitting false data</li>
          <li>Interfere with the operation of the site or its infrastructure</li>
          <li>Scrape or bulk-download data in a way that disrupts the service</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>3. Data Collection &amp; Privacy</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          If you accept cookies, we collect anonymized quiz scores (economic score, social score,
          personality type, and country) to build aggregate statistics. No personal information
          is collected. Your full quiz results stay on your device. For full details, see
          our <Link to="/privacy" style={{ color: 'var(--color-accent)' }}>Privacy Policy</Link>.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>4. Accounts</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Account creation is optional. If you create an account, you are responsible for
          keeping your login credentials secure. You can delete your account and all associated
          data at any time from the Profile page or by contacting us.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>5. Advertising</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          This site displays advertisements through Google AdSense. Ads are served by Google and
          its partners. We do not control ad content. If you see an ad that seems inappropriate,
          you can report it through Google's ad feedback tools. You can opt out of personalized
          ads through your browser settings or Google's Ad Settings.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>6. Intellectual Property</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          The quiz questions, scoring algorithms, design, and original content of this site are
          the property of the Political Ideology Profiler. Historical figure descriptions and
          placements are based on publicly available information and scholarly interpretation.
          You may share your personal results freely.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>7. Disclaimer of Warranties</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          This tool is provided "as is" without warranties of any kind, express or implied.
          We do not guarantee the accuracy, completeness, or reliability of quiz results.
          Political ideology is complex and cannot be fully captured by any quiz. We are not
          responsible for decisions made based on quiz results.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>8. Limitation of Liability</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          To the maximum extent permitted by law, the Political Ideology Profiler and its
          operators shall not be liable for any indirect, incidental, or consequential damages
          arising from your use of the site or reliance on quiz results.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>9. Changes to These Terms</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          We may update these terms from time to time. Changes will be posted on this page with
          an updated date. Continued use of the site after changes constitutes acceptance of
          the new terms.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>10. Contact</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          For questions about these terms, contact us at the email listed on
          our <Link to="/about" style={{ color: 'var(--color-accent)' }}>About page</Link>.
        </p>
      </div>
    </div>
  );
}
