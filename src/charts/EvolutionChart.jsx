import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

export default function EvolutionChart({ results = [] }) {
  if (results.length < 2) return null;

  const data = results.map((r, i) => ({
    index: i + 1,
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    economic: r.economic ?? r.latestEconomic,
    social: r.social ?? r.latestSocial,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" fontSize={11} fontFamily="var(--font-mono)" />
          <YAxis domain={[-10, 10]} fontSize={11} fontFamily="var(--font-mono)" />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-mono)' }} />
          <Line
            type="monotone" dataKey="economic" name="Economic Axis"
            stroke="var(--color-economic-left)" strokeWidth={2} dot={{ r: 4 }}
          />
          <Line
            type="monotone" dataKey="social" name="Social Axis"
            stroke="var(--color-social-prog)" strokeWidth={2} dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
