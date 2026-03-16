import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResultsPanel } from '@/components/dashboard/ResultsPanel';
import type { DecisionResults } from '@/types';

const mockResults: DecisionResults = {
  summary: 'This is a test decision summary with sufficient detail.',
  recommendation: 'You should proceed with this decision.',
  recommendationStrength: 'recommended',
  lifeImpact: {
    financial: 75,
    career: 80,
    personal: 65,
    social: 70,
    health: 60,
    overall: 72,
  },
  riskLevel: 'medium',
  riskFactors: [
    {
      category: 'Financial',
      level: 'medium',
      description: 'Short-term cash flow risk.',
      mitigation: 'Build an emergency fund.',
    },
  ],
  scenarios: [
    {
      title: 'Best Case',
      description: 'Everything goes well.',
      probability: 30,
      impact: 'positive',
      details: ['Higher salary', 'Better culture', 'Growth opportunities'],
    },
    {
      title: 'Most Likely',
      description: 'A realistic outcome.',
      probability: 55,
      impact: 'neutral',
      details: ['Moderate growth', 'Adjustment period'],
    },
    {
      title: 'Worst Case',
      description: 'Things do not go as planned.',
      probability: 15,
      impact: 'negative',
      details: ['Role mismatch', 'Team conflict'],
    },
  ],
  keyInsights: ['Insight one', 'Insight two', 'Insight three'],
  actionItems: ['Action one', 'Action two', 'Action three'],
  confidenceScore: 85,
};

describe('ResultsPanel', () => {
  it('renders empty state when no results', () => {
    render(<ResultsPanel results={null} isLoading={false} />);
    expect(screen.getByText('Ready to analyze')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ResultsPanel results={null} isLoading={true} />);
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  it('renders AI Analysis header when results present', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
  });

  it('renders recommendation strength', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('renders risk level badge', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('MEDIUM RISK')).toBeInTheDocument();
  });

  it('renders decision summary', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText(mockResults.summary)).toBeInTheDocument();
  });

  it('renders recommendation text', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText(mockResults.recommendation)).toBeInTheDocument();
  });

  it('renders overall impact score', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('renders scenario cards', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('Best Case')).toBeInTheDocument();
    expect(screen.getByText('Most Likely')).toBeInTheDocument();
    expect(screen.getByText('Worst Case')).toBeInTheDocument();
  });

  it('renders key insights', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('Insight one')).toBeInTheDocument();
  });

  it('renders action items', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('Action one')).toBeInTheDocument();
  });

  it('renders confidence score', () => {
    render(<ResultsPanel results={mockResults} isLoading={false} />);
    expect(screen.getByText('Confidence: 85%')).toBeInTheDocument();
  });
});
