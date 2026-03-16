'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, getImpactColor } from '@/lib/utils';
import type { Scenario } from '@/types';

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
}

const impactConfig = {
  positive: {
    icon: TrendingUp,
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/20',
    gradientClass: 'from-emerald-500/5',
  },
  neutral: {
    icon: Minus,
    badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    borderClass: 'border-white/10',
    gradientClass: 'from-slate-500/5',
  },
  negative: {
    icon: TrendingDown,
    badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
    borderClass: 'border-red-500/20',
    gradientClass: 'from-red-500/5',
  },
};

export function ScenarioCard({ scenario, index }: ScenarioCardProps) {
  const config = impactConfig[scenario.impact] ?? impactConfig.neutral;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'rounded-xl border bg-gradient-to-br to-transparent p-5 space-y-3',
        config.borderClass,
        config.gradientClass
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', config.badgeClass)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-semibold text-white text-sm">{scenario.title}</h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">Probability</span>
          <span className="text-sm font-bold text-white">{scenario.probability}%</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-300 text-sm leading-relaxed">{scenario.description}</p>

      {/* Probability bar */}
      <div className="w-full bg-white/5 rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scenario.probability}%` }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
          className={cn(
            'h-1.5 rounded-full',
            scenario.impact === 'positive' ? 'bg-emerald-500' :
            scenario.impact === 'negative' ? 'bg-red-500' : 'bg-slate-500'
          )}
        />
      </div>

      {/* Details */}
      {scenario.details?.length > 0 && (
        <ul className="space-y-1.5">
          {scenario.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
