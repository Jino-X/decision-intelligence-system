'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { History, RefreshCw, Loader2 } from 'lucide-react';
import { HistoryList } from '@/components/dashboard/HistoryList';
import { ResultsPanel } from '@/components/dashboard/ResultsPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { Decision } from '@/types';

export default function HistoryPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const { toast } = useToast();

  const fetchDecisions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/decisions');
      const data = await res.json();
      if (res.ok) {
        setDecisions(data.decisions ?? []);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load history.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Network error', description: 'Could not fetch decisions.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/decisions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDecisions(prev => prev.filter(d => d.id !== id));
        if (selectedDecision?.id === id) setSelectedDecision(null);
        toast({ title: 'Deleted', description: 'Decision removed from history.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Network error', description: 'Could not delete decision.' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <History className="h-7 w-7 text-indigo-400" />
            Decision History
          </h1>
          <p className="text-slate-400 mt-1">
            {isLoading ? 'Loading...' : `${decisions.length} decision${decisions.length !== 1 ? 's' : ''} analyzed`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDecisions} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/4 mb-3" />
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : selectedDecision ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => setSelectedDecision(null)}
            >
              ← Back to History
            </Button>
            <HistoryList
              decisions={[selectedDecision]}
              onDelete={handleDelete}
              onSelect={setSelectedDecision}
            />
          </div>
          <div className="lg:sticky lg:top-20">
            <ResultsPanel results={selectedDecision.results} isLoading={false} />
          </div>
        </div>
      ) : (
        <HistoryList
          decisions={decisions}
          onDelete={handleDelete}
          onSelect={setSelectedDecision}
        />
      )}
    </div>
  );
}
