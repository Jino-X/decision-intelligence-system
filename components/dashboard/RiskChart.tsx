'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { LifeImpact } from '@/types';

interface RiskChartProps {
  lifeImpact: LifeImpact;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 shadow-xl">
        <p className="text-white font-semibold text-sm">{payload[0].value}/100</p>
      </div>
    );
  }
  return null;
};

export function RiskChart({ lifeImpact }: RiskChartProps) {
  const data = [
    { subject: 'Financial', score: lifeImpact.financial, fullMark: 100 },
    { subject: 'Career', score: lifeImpact.career, fullMark: 100 },
    { subject: 'Personal', score: lifeImpact.personal, fullMark: 100 },
    { subject: 'Social', score: lifeImpact.social, fullMark: 100 },
    { subject: 'Health', score: lifeImpact.health, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <Radar
            name="Impact"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
