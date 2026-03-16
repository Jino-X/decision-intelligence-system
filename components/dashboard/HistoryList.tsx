'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronRight, Brain, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getRiskBadgeClass,
  getRecommendationColor,
  getRecommendationLabel,
  getDecisionTypeLabel,
  formatRelativeTime,
  truncateText,
} from '@/lib/utils';
import type { Decision } from '@/types';

interface HistoryListProps {
  decisions: Decision[];
  onDelete: (id: string) => Promise<void>;
  onSelect?: (decision: Decision) => void;
}

export function HistoryList({ decisions, onDelete, onSelect }: HistoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  if (decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
          <Brain className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">No decisions yet</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Your analyzed decisions will appear here. Head to the dashboard to get started.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/dashboard">Analyze a Decision</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {decisions.map((decision, index) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all p-5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left content */}
                <button
                  className="flex-1 text-left space-y-2 min-w-0"
                  onClick={() => onSelect?.(decision)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {getDecisionTypeLabel(decision.inputs.decisionType)}
                    </Badge>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadgeClass(decision.results.riskLevel)}`}>
                      {decision.results.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-indigo-300 transition-colors">
                    {decision.inputs.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {truncateText(decision.results.summary, 120)}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(decision.createdAt)}
                    </span>
                    <span className={`font-medium ${getRecommendationColor(decision.results.recommendationStrength)}`}>
                      {getRecommendationLabel(decision.results.recommendationStrength)}
                    </span>
                    <span className="text-slate-500">
                      Score: {decision.results.lifeImpact.overall}/100
                    </span>
                  </div>
                </button>

                {/* Right actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {onSelect && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onSelect(decision)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => setDeleteId(decision.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <DialogTitle>Delete Decision</DialogTitle>
            </div>
            <DialogDescription>
              This will permanently delete this decision analysis from your history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
