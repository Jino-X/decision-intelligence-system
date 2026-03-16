export type DecisionType = 'job-switch' | 'relocation' | 'custom';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RecommendationStrength =
  | 'strongly-recommended'
  | 'recommended'
  | 'neutral'
  | 'not-recommended'
  | 'strongly-not-recommended';

export type ImpactType = 'positive' | 'neutral' | 'negative';

export interface DecisionInputs {
  decisionType: DecisionType;
  title: string;
  context: string;
  currentSalary?: number;
  proposedSalary?: number;
  currentLocation?: string;
  targetLocation?: string;
  lifestyle?: string[];
  priorities?: string[];
  timeframe?: string;
}

export interface Scenario {
  title: string;
  description: string;
  probability: number;
  impact: ImpactType;
  details: string[];
}

export interface RiskFactor {
  category: string;
  level: RiskLevel;
  description: string;
  mitigation: string;
}

export interface LifeImpact {
  financial: number;
  career: number;
  personal: number;
  social: number;
  health: number;
  overall: number;
}

export interface DecisionResults {
  summary: string;
  recommendation: string;
  recommendationStrength: RecommendationStrength;
  lifeImpact: LifeImpact;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  scenarios: Scenario[];
  keyInsights: string[];
  actionItems: string[];
  confidenceScore: number;
}

export interface Decision {
  id: string;
  userId: string;
  inputs: DecisionInputs;
  results: DecisionResults;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyzeRequest {
  inputs: DecisionInputs;
  saveToHistory?: boolean;
}

export interface AnalyzeResponse {
  results: DecisionResults;
  decisionId?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
