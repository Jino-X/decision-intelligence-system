'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { DecisionInputs, DecisionResults } from '@/types';

interface UseDecisionReturn {
  results: DecisionResults | null;
  isLoading: boolean;
  error: string | null;
  analyze: (inputs: DecisionInputs, save?: boolean) => Promise<void>;
  reset: () => void;
}

export function useDecision(): UseDecisionReturn {
  const [results, setResults] = useState<DecisionResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyze = useCallback(async (inputs: DecisionInputs, save = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, saveToHistory: save }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? 'Analysis failed. Please try again.');
      }

      setResults(data.results);
      toast({ title: 'Analysis complete', description: 'Your decision has been analyzed.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      toast({ variant: 'destructive', title: 'Analysis failed', description: message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, isLoading, error, analyze, reset };
}
