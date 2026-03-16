'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Shield, Zap, Target, ChevronRight, CheckCircle2,
  AlertTriangle, TrendingUp, Lightbulb, Star, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScenarioCard } from './ScenarioCard';
import { RiskChart } from './RiskChart';
import {
  getRiskBadgeClass,
  getRecommendationColor,
  getRecommendationLabel,
  getRiskColor,
} from '@/lib/utils';
import type { DecisionResults } from '@/types';

interface ResultsPanelProps {
  results: DecisionResults | null;
  isLoading: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-3">
          <div className="h-5 bg-white/10 rounded-md animate-pulse w-1/3" />
          <div className="h-4 bg-white/5 rounded-md animate-pulse w-full" />
          <div className="h-4 bg-white/5 rounded-md animate-pulse w-3/4" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
        <Brain className="h-8 w-8 text-indigo-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Ready to analyze</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          Fill in your decision details on the left and click &ldquo;Analyze My Decision&rdquo; to get AI-powered insights.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {['Life Impact Prediction', 'Risk Analysis', 'Scenario Simulation'].map(f => (
          <span key={f} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-slate-400">
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function ResultsPanel({ results, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
          <div>
            <h2 className="text-xl font-bold text-white">Analyzing...</h2>
            <p className="text-slate-400 text-sm">AI is processing your decision</p>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-full">
        <EmptyState />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm h-full overflow-y-auto"
    >
      <div className="p-6 border-b border-white/10 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">AI Analysis</h2>
            <p className="text-slate-400 text-sm">Confidence: {results.confidenceScore}%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${getRecommendationColor(results.recommendationStrength)}`}>
              {getRecommendationLabel(results.recommendationStrength)}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadgeClass(results.riskLevel)}`}>
              {results.riskLevel.toUpperCase()} RISK
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-400" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm leading-relaxed">{results.summary}</p>
              <Separator className="my-4" />
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-white text-sm font-medium">{results.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Life Impact Radar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" /> Life Impact Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskChart lifeImpact={results.lifeImpact} />
              <div className="grid grid-cols-2 gap-3 mt-4">
                {Object.entries(results.lifeImpact)
                  .filter(([k]) => k !== 'overall')
                  .map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 capitalize">{key}</span>
                        <span className="text-white font-medium">{value}/100</span>
                      </div>
                      <Progress value={value} className="h-1.5" />
                    </div>
                  ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm font-medium">Overall Impact Score</span>
                  <span className="text-2xl font-bold text-indigo-400">{results.lifeImpact.overall}<span className="text-sm text-slate-400">/100</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Factors */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-400" /> Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.riskFactors.map((factor, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{factor.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadgeClass(factor.level)}`}>
                      {factor.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{factor.description}</p>
                  <div className="flex items-start gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{factor.mitigation}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Scenarios */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" /> Scenario Simulations
          </h3>
          <div className="space-y-3">
            {results.scenarios.map((scenario, i) => (
              <ScenarioCard key={i} scenario={scenario} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" /> Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Star className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" /> Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {results.actionItems.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold">
                      {i + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
