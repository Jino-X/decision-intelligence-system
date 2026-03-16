import {
  cn,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  getRiskColor,
  getRiskBadgeClass,
  getImpactColor,
  getRecommendationColor,
  getRecommendationLabel,
  getDecisionTypeLabel,
  capitalizeFirst,
  truncateText,
} from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('resolves Tailwind conflicts', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(75000)).toBe('$75,000');
  });

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to human-readable', () => {
    const result = formatDate('2024-01-15T00:00:00.000Z');
    expect(result).toMatch(/January|Jan/);
    expect(result).toMatch(/2024/);
  });
});

describe('formatRelativeTime', () => {
  it('returns "just now" for very recent times', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('just now');
  });

  it('returns minutes ago for recent times', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
  });

  it('returns hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');
  });

  it('returns days ago for older times', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago');
  });
});

describe('getRiskColor', () => {
  it('returns emerald for low risk', () => {
    expect(getRiskColor('low')).toBe('text-emerald-400');
  });

  it('returns amber for medium risk', () => {
    expect(getRiskColor('medium')).toBe('text-amber-400');
  });

  it('returns red for high risk', () => {
    expect(getRiskColor('high')).toBe('text-red-400');
  });

  it('returns slate for unknown risk', () => {
    expect(getRiskColor('unknown')).toBe('text-slate-400');
  });
});

describe('getRiskBadgeClass', () => {
  it('returns correct classes for each risk level', () => {
    expect(getRiskBadgeClass('low')).toContain('emerald');
    expect(getRiskBadgeClass('medium')).toContain('amber');
    expect(getRiskBadgeClass('high')).toContain('red');
  });
});

describe('getImpactColor', () => {
  it('returns emerald for positive impact', () => {
    expect(getImpactColor('positive')).toBe('text-emerald-400');
  });

  it('returns red for negative impact', () => {
    expect(getImpactColor('negative')).toBe('text-red-400');
  });

  it('returns slate for neutral impact', () => {
    expect(getImpactColor('neutral')).toBe('text-slate-400');
  });
});

describe('getRecommendationColor', () => {
  it('returns correct colors for each strength', () => {
    expect(getRecommendationColor('strongly-recommended')).toBe('text-emerald-400');
    expect(getRecommendationColor('recommended')).toBe('text-green-400');
    expect(getRecommendationColor('neutral')).toBe('text-amber-400');
    expect(getRecommendationColor('not-recommended')).toBe('text-orange-400');
    expect(getRecommendationColor('strongly-not-recommended')).toBe('text-red-400');
  });
});

describe('getRecommendationLabel', () => {
  it('returns human-readable labels', () => {
    expect(getRecommendationLabel('strongly-recommended')).toBe('Strongly Recommended');
    expect(getRecommendationLabel('neutral')).toBe('Neutral');
    expect(getRecommendationLabel('strongly-not-recommended')).toBe('Strongly Not Recommended');
  });
});

describe('getDecisionTypeLabel', () => {
  it('formats decision type labels', () => {
    expect(getDecisionTypeLabel('job-switch')).toBe('Job Switch');
    expect(getDecisionTypeLabel('relocation')).toBe('Relocation');
    expect(getDecisionTypeLabel('custom')).toBe('Custom Decision');
  });
});

describe('capitalizeFirst', () => {
  it('capitalizes the first character', () => {
    expect(capitalizeFirst('hello world')).toBe('Hello world');
  });

  it('handles empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });
});

describe('truncateText', () => {
  it('returns text unchanged if within limit', () => {
    expect(truncateText('short text', 100)).toBe('short text');
  });

  it('truncates and appends ellipsis', () => {
    const result = truncateText('This is a long text that should be truncated', 20);
    expect(result).toMatch(/…$/);
    expect(result.length).toBeLessThanOrEqual(21);
  });
});
