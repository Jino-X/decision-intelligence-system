import { NextRequest } from 'next/server';

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/openai', () => ({
  analyzeDecision: jest.fn(),
}));

jest.mock('@/lib/firestore', () => ({
  saveDecision: jest.fn(),
}));

const { auth } = jest.requireMock('@/auth') as { auth: jest.Mock };
const { analyzeDecision } = jest.requireMock('@/lib/openai') as { analyzeDecision: jest.Mock };
const { saveDecision } = jest.requireMock('@/lib/firestore') as { saveDecision: jest.Mock };

const mockResults = {
  summary: 'Test summary',
  recommendation: 'Test recommendation',
  recommendationStrength: 'recommended',
  lifeImpact: { financial: 70, career: 75, personal: 65, social: 60, health: 55, overall: 68 },
  riskLevel: 'medium',
  riskFactors: [],
  scenarios: [],
  keyInsights: [],
  actionItems: [],
  confidenceScore: 80,
};

const validInputs = {
  decisionType: 'job-switch',
  title: 'Should I switch my job',
  context: 'I have been offered a new role with better pay and growth opportunities.',
  currentSalary: 80000,
  proposedSalary: 100000,
};

async function callRoute(body: object) {
  const { POST } = await import('@/app/api/analyze/route');
  const req = new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return POST(req);
}

describe('POST /api/analyze', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it('returns 400 for invalid inputs', async () => {
    auth.mockResolvedValue(null);
    const res = await callRoute({ inputs: { title: 'Hi' } });
    expect(res.status).toBe(400);
  });

  it('returns 503 when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    auth.mockResolvedValue(null);
    const res = await callRoute({ inputs: validInputs });
    expect(res.status).toBe(503);
  });

  it('returns 200 with results for valid request', async () => {
    auth.mockResolvedValue(null);
    analyzeDecision.mockResolvedValue(mockResults);
    const res = await callRoute({ inputs: validInputs });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toBeDefined();
    expect(data.results.summary).toBe('Test summary');
  });

  it('saves decision when user is authenticated and saveToHistory is true', async () => {
    auth.mockResolvedValue({ user: { id: 'user-123' } });
    analyzeDecision.mockResolvedValue(mockResults);
    saveDecision.mockResolvedValue('decision-abc');

    const res = await callRoute({ inputs: validInputs, saveToHistory: true });
    expect(res.status).toBe(200);
    expect(saveDecision).toHaveBeenCalledWith('user-123', validInputs, mockResults);
    const data = await res.json();
    expect(data.decisionId).toBe('decision-abc');
  });

  it('does not save when saveToHistory is false', async () => {
    auth.mockResolvedValue({ user: { id: 'user-123' } });
    analyzeDecision.mockResolvedValue(mockResults);

    await callRoute({ inputs: validInputs, saveToHistory: false });
    expect(saveDecision).not.toHaveBeenCalled();
  });

  it('still returns results even if saving fails', async () => {
    auth.mockResolvedValue({ user: { id: 'user-123' } });
    analyzeDecision.mockResolvedValue(mockResults);
    saveDecision.mockRejectedValue(new Error('Firestore error'));

    const res = await callRoute({ inputs: validInputs, saveToHistory: true });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toBeDefined();
  });

  it('returns 500 when OpenAI throws', async () => {
    auth.mockResolvedValue(null);
    analyzeDecision.mockRejectedValue(new Error('OpenAI error'));

    const res = await callRoute({ inputs: validInputs });
    expect(res.status).toBe(500);
  });
});
