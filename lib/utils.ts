import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLevel, RecommendationStrength, ImpactType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getRiskColor(level: RiskLevel | string): string {
  switch (level) {
    case 'low': return 'text-emerald-400';
    case 'medium': return 'text-amber-400';
    case 'high': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getRiskBadgeClass(level: RiskLevel | string): string {
  switch (level) {
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getImpactColor(impact: ImpactType | string): string {
  switch (impact) {
    case 'positive': return 'text-emerald-400';
    case 'neutral': return 'text-slate-400';
    case 'negative': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getRecommendationColor(strength: RecommendationStrength | string): string {
  switch (strength) {
    case 'strongly-recommended': return 'text-emerald-400';
    case 'recommended': return 'text-green-400';
    case 'neutral': return 'text-amber-400';
    case 'not-recommended': return 'text-orange-400';
    case 'strongly-not-recommended': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getRecommendationLabel(strength: RecommendationStrength | string): string {
  switch (strength) {
    case 'strongly-recommended': return 'Strongly Recommended';
    case 'recommended': return 'Recommended';
    case 'neutral': return 'Neutral';
    case 'not-recommended': return 'Not Recommended';
    case 'strongly-not-recommended': return 'Strongly Not Recommended';
    default: return 'Unknown';
  }
}

export function getDecisionTypeLabel(type: string): string {
  switch (type) {
    case 'job-switch': return 'Job Switch';
    case 'relocation': return 'Relocation';
    case 'custom': return 'Custom Decision';
    default: return type;
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
