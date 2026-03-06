import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

function CustomAngleTick({ payload, x, y, textAnchor }) {
  const words = payload.value.split(' ');
  return (
    <text
      x={x} y={y} textAnchor={textAnchor}
      fontSize={10} fontFamily="var(--font-mono)" fill="var(--color-text-secondary)"
    >
      {words.length > 1 ? (
        <>
          <tspan x={x} dy={0}>{words[0]}</tspan>
          <tspan x={x} dy={12}>{words.slice(1).join(' ')}</tspan>
        </>
      ) : (
        <tspan>{payload.value}</tspan>
      )}
    </text>
  );
}

export default function RadarAnalysis({ radarScores = [], secondaryScores = null, labels = ['You', 'Comparison'] }) {
  if (!radarScores.length) return null;

  // Merge secondary scores into chart data if provided
  const chartData = secondaryScores
    ? radarScores.map(d => {
        const match = secondaryScores.find(s => s.dimension === d.dimension);
        return { ...d, value2: match ? match.value : 0 };
      })
    : radarScores;

  return (
    <div style={{ width: '100%', height: 380 }}>
      <ResponsiveContainer>
        <RadarChart data={chartData} outerRadius="70%">
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={<CustomAngleTick />}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
            }}
          />
          <Radar
            name={labels[0]}
            dataKey="value"
            stroke="var(--color-accent)"
            fill="var(--color-accent)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          {secondaryScores && (
            <Radar
              name={labels[1]}
              dataKey="value2"
              stroke="var(--color-economic-left)"
              fill="var(--color-economic-left)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
