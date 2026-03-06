import React, { useMemo } from 'react';
import { getStats, getAllResults } from '../utils/resultsStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#dc2626', '#e85d04', '#7c3aed', '#0891b2', '#2563eb', '#1d4ed8', '#1e3a5f', '#78350f'];

export default function AdminDashboard() {
  const stats = useMemo(() => getStats(), []);
  const allResults = useMemo(() => getAllResults(), []);

  const clusterData = useMemo(() => {
    return Object.entries(stats.clusterDistribution).map(([name, count]) => ({
      name,
      count,
      percentage: stats.totalResponses > 0 ? Math.round((count / stats.totalResponses) * 100) : 0,
    })).sort((a, b) => b.count - a.count);
  }, [stats]);

  const countryData = useMemo(() => {
    return Object.entries(stats.countryDistribution).map(([name, data]) => ({
      name,
      count: data.count,
      avgEconomic: data.avgEconomic,
      avgSocial: data.avgSocial,
    })).sort((a, b) => b.count - a.count);
  }, [stats]);

  const monthlyData = useMemo(() => {
    const months = {};
    for (const r of allResults) {
      const key = new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[key] = (months[key] || 0) + 1;
    }
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [allResults]);

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
        Internal Dashboard
      </span>
      <h1 style={{ fontSize: 36, marginBottom: 'var(--spacing-xl)' }}>Research Dashboard</h1>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Responses</span>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{stats.totalResponses}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Avg Economic</span>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-heading)', color: stats.avgEconomic < 0 ? 'var(--color-economic-left)' : 'var(--color-economic-right)' }}>
            {stats.avgEconomic > 0 ? '+' : ''}{stats.avgEconomic}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Avg Social</span>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-heading)', color: stats.avgSocial < 0 ? 'var(--color-social-prog)' : 'var(--color-social-cons)' }}>
            {stats.avgSocial > 0 ? '+' : ''}{stats.avgSocial}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Countries</span>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{countryData.length}</div>
        </div>
      </div>

      {/* Cluster distribution */}
      {clusterData.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Cluster Distribution</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
            <div>
              {clusterData.map((c, i) => (
                <div key={c.name} style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{c.name}</span>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{c.count} ({c.percentage}%)</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-bg)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${c.percentage}%`, background: COLORS[i % COLORS.length], borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={clusterData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {clusterData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Responses by country */}
      {countryData.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Responses by Country</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" fontSize={11} fontFamily="var(--font-mono)" />
                <YAxis fontSize={11} fontFamily="var(--font-mono)" />
                <Tooltip contentStyle={{ fontSize: 13, fontFamily: 'var(--font-body)' }} />
                <Bar dataKey="count" fill="var(--color-text)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Country ideology averages */}
      {countryData.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Average Ideology by Country</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Country</th>
                  <th style={thStyle}>Responses</th>
                  <th style={thStyle}>Avg Economic</th>
                  <th style={thStyle}>Avg Social</th>
                </tr>
              </thead>
              <tbody>
                {countryData.map(c => (
                  <tr key={c.name}>
                    <td style={tdStyle}>{c.name}</td>
                    <td style={tdStyle}>{c.count}</td>
                    <td style={{ ...tdStyle, color: c.avgEconomic < 0 ? 'var(--color-economic-left)' : 'var(--color-economic-right)' }}>{c.avgEconomic}</td>
                    <td style={{ ...tdStyle, color: c.avgSocial < 0 ? 'var(--color-social-prog)' : 'var(--color-social-cons)' }}>{c.avgSocial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly responses */}
      {monthlyData.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Response Timeline</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" fontSize={11} fontFamily="var(--font-mono)" />
                <YAxis fontSize={11} fontFamily="var(--font-mono)" />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {stats.totalResponses === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No Data Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
            Results will appear here as users complete the quiz.
          </p>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid var(--color-border)',
  fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
  color: 'var(--color-text-secondary)',
};
const tdStyle = {
  padding: '8px 12px', borderBottom: '1px solid var(--color-border)',
};
