import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getSession, hydrateSession } from './utils/authStore';
import CookieConsent from './components/CookieConsent';
import { Analytics } from '@vercel/analytics/react';

// Eagerly load core pages
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';

// Lazy load secondary pages for performance
const ResultsPage = lazy(() => import('./components/ResultsPage'));
const ResultPermalink = lazy(() => import('./components/ResultPermalink'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const MethodologyPage = lazy(() => import('./components/MethodologyPage'));
const DeepAnalysis = lazy(() => import('./components/DeepAnalysis'));
const CountryComparison = lazy(() => import('./components/CountryComparison'));
const PricingSection = lazy(() => import('./components/PricingSection'));
const DebatePage = lazy(() => import('./components/DebatePage'));
const FriendCompare = lazy(() => import('./components/FriendCompare'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const GlobalIdeologyMap = lazy(() => import('./components/GlobalIdeologyMap'));
const IdeologyStatsAPI = lazy(() => import('./components/IdeologyStatsAPI'));
const PrivacyPage = lazy(() => import('./components/PrivacyPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const InsightsPage = lazy(() => import('./components/InsightsPage'));

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-3xl) 0' }}>
      <span className="mono" style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Loading...</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    hydrateSession().then((user) => {
      if (user) setSession(user);
    }).catch(() => {});
  }, []);

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="nav-logo">
            <span className="nav-logo-text">Ideology Compass</span>
          </Link>
          <div className="nav-links">
            <Link to="/quiz" className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}>Quiz</Link>
            <Link to="/methodology" className={`nav-link ${location.pathname === '/methodology' ? 'active' : ''}`}>Methodology</Link>
            <Link to="/map" className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}>Map</Link>
            <Link to="/insights" className={`nav-link ${location.pathname === '/insights' ? 'active' : ''}`}>Insights</Link>
            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              {session ? 'Profile' : 'Log In'}
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/result/:id" element={<ResultPermalink />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/deep-analysis" element={<DeepAnalysis />} />
            <Route path="/deep-analysis/:id" element={<DeepAnalysis />} />
            <Route path="/country-comparison" element={<CountryComparison />} />
            <Route path="/country-comparison/:id" element={<CountryComparison />} />
            <Route path="/pricing" element={<PricingSection />} />
            <Route path="/debate/new" element={<DebatePage />} />
            <Route path="/debate/:id" element={<DebatePage />} />
            <Route path="/compare/:id" element={<FriendCompare />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/map" element={<GlobalIdeologyMap />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/api/ideology-stats" element={<IdeologyStatsAPI />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={
              <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
                <h2 style={{ fontSize: 36, marginBottom: 'var(--spacing-md)' }}>Page Not Found</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <span className="mono footer-label">Ideology Compass</span>
              <span className="footer-copy">A political quiz and analysis tool</span>
            </div>
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/methodology">Methodology</Link>
              <Link to="/insights">Insights</Link>
              <Link to="/api/ideology-stats">Stats</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      <CookieConsent />
      <Analytics />

      <style>{`
        .app { min-height: 100vh; display: flex; flex-direction: column; }
        .app-nav {
          border-bottom: 1px solid var(--color-border);
          padding: var(--spacing-md) 0;
          background: var(--color-surface);
          position: sticky; top: 0; z-index: 100;
        }
        .nav-logo { display: flex; align-items: center; gap: var(--spacing-sm); text-decoration: none; }
        .nav-logo-text {
          font-family: var(--font-heading); font-size: 16px; font-weight: 600;
          color: var(--color-text);
        }
        .nav-links { display: flex; gap: var(--spacing-lg); align-items: center; }
        .nav-link {
          font-size: 13px; color: var(--color-text-secondary); text-decoration: none;
          transition: color 0.15s; font-family: var(--font-mono);
        }
        .nav-link:hover, .nav-link.active { color: var(--color-text); }
        main { flex: 1; }
        .app-footer {
          border-top: 1px solid var(--color-border); padding: var(--spacing-xl) 0;
          margin-top: auto;
        }
        .footer-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md); }
        .footer-left { display: flex; flex-direction: column; gap: 2px; }
        .footer-label { font-size: 12px; color: var(--color-text); }
        .footer-copy { font-size: 12px; color: var(--color-text-secondary); }
        .footer-links { display: flex; gap: var(--spacing-lg); }
        .footer-links a { font-size: 12px; color: var(--color-text-secondary); }
        .footer-links a:hover { color: var(--color-text); }
        @media (max-width: 768px) {
          .nav-links { gap: var(--spacing-md); }
          .nav-link { font-size: 12px; }
          .nav-logo-text { font-size: 14px; }
          .footer-content { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
