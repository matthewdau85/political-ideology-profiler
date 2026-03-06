import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import figures from '../data/figures';

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const isUser = payload.isUser;
  return (
    <g>
      <circle
        cx={cx} cy={cy}
        r={isUser ? 8 : 5}
        fill={isUser ? 'var(--color-accent)' : 'var(--color-text)'}
        opacity={isUser ? 1 : 0.35}
        stroke={isUser ? '#fff' : 'none'}
        strokeWidth={isUser ? 2 : 0}
      />
      {(isUser || payload.showLabel) && (
        <text x={cx + 12} y={cy + 4} fontSize={11} fill="var(--color-text)" fontFamily="var(--font-mono)">
          {payload.label}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 13,
    }}>
      <strong>{d.label}</strong>
      <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
        Economic: {d.x} | Social: {d.y}
      </div>
    </div>
  );
};

export default function IdeologyScatter({ economic, social, closestFigures = [], showAllFigures = false }) {
  const userData = [{ x: economic, y: social, label: 'You', isUser: true }];

  const figureData = (showAllFigures ? figures : closestFigures).map(f => ({
    x: f.economic,
    y: f.social,
    label: f.name,
    isUser: false,
    showLabel: closestFigures.some(cf => cf.name === f.name || cf.id === f.id),
  }));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" dataKey="x" domain={[-10, 10]} tickCount={5} fontSize={11} fontFamily="var(--font-mono)" />
            <YAxis type="number" dataKey="y" domain={[-10, 10]} tickCount={5} fontSize={11} fontFamily="var(--font-mono)" />
            <ReferenceLine x={0} stroke="var(--color-border)" strokeWidth={1} />
            <ReferenceLine y={0} stroke="var(--color-border)" strokeWidth={1} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={figureData} shape={<CustomDot />} />
            <Scatter data={userData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mono" style={{
        display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
        fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 4,
      }}>
        <span>X: Left-leaning (-10) to Right-leaning (+10)</span>
        <span>Y: Progressive (-10) to Conservative (+10)</span>
      </div>
    </div>
  );
}
