import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: 720 }}>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-lg)' }}>About</h1>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>What Is This?</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          The Political Ideology Profiler is a free, open quiz tool that helps you understand
          your political views. It scores you on two dimensions — economic (left to right) and
          social (progressive to conservative) — and matches you with historical political figures
          and one of eight political personality types.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          The quiz is based on established political science frameworks including the Nolan Chart,
          the Political Compass model, and Pew Research Center's political typology studies.
          It is designed as an educational tool, not a definitive classification of anyone's beliefs.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Who Made This?</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          The Political Ideology Profiler is an independent project built for educational and
          research purposes. It is not affiliated with any political party, campaign, or advocacy
          organization. The project is non-partisan and aims to help people explore and understand
          political ideology across the full spectrum.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>How It Works</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          You answer 24 questions across four areas: economic views, social values, institutions,
          and public policy. Each question has four answer options, and you rate how important
          the topic is to you. Your answers are scored and mapped onto a two-dimensional chart,
          then compared against historical figures and political personality types.
        </p>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: 'var(--spacing-md)' }}>
          For full technical details, see the <Link to="/methodology" style={{ color: 'var(--color-accent)' }}>Methodology page</Link>.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Contact</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
          For questions, feedback, data requests, or to report issues, use our contact form.
        </p>
        <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-block' }}>
          Contact Us
        </Link>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 22, marginBottom: 'var(--spacing-md)' }}>Disclaimer</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          This tool provides an approximate classification based on a limited set of questions.
          Political ideology is complex and cannot be fully captured by any quiz or model.
          Results should be treated as a starting point for reflection, not as a definitive label.
          All ideological placements of historical figures are approximations based on their
          known public positions and are subject to scholarly interpretation.
        </p>
      </div>
    </div>
  );
}
