'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DecisionForm } from '@/components/dashboard/DecisionForm';
import { ResultsPanel } from '@/components/dashboard/ResultsPanel';
import { useDecision } from '@/hooks/useDecision';
import type { DecisionInputs } from '@/types';

export default function DashboardPage() {
  const { results, isLoading, analyze } = useDecision();

  const handleAnalyze = async (inputs: DecisionInputs) => {
    await analyze(inputs, true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Decision Engine</h1>
        <p className="text-slate-400 mt-1">
          Describe your decision and let AI simulate the outcomes for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="lg:sticky lg:top-20"
        >
          <ResultsPanel results={results} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}
