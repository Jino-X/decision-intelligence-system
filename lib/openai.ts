import OpenAI from 'openai';
import type { DecisionInputs, DecisionResults } from '@/types';

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function analyzeDecision(inputs: DecisionInputs): Promise<DecisionResults> {
  const openai = getOpenAIClient();
  const prompt = buildPrompt(inputs);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert life coach, financial advisor, and decision analyst. You analyze major life decisions and provide structured, evidence-based insights. Always respond with valid JSON matching the exact schema provided. Be realistic, nuanced, and data-driven.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 2500,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  const parsed = JSON.parse(content) as DecisionResults;
  return parsed;
}

function buildPrompt(inputs: DecisionInputs): string {
  const lines: string[] = [
    'Analyze the following life decision and provide a comprehensive, structured analysis:',
    '',
    `Decision Type: ${inputs.decisionType}`,
    `Title: ${inputs.title}`,
    `Context: ${inputs.context}`,
  ];

  if (inputs.currentSalary) lines.push(`Current Annual Salary: $${inputs.currentSalary.toLocaleString()}`);
  if (inputs.proposedSalary) lines.push(`Proposed Annual Salary: $${inputs.proposedSalary.toLocaleString()}`);
  if (inputs.currentLocation) lines.push(`Current Location: ${inputs.currentLocation}`);
  if (inputs.targetLocation) lines.push(`Target Location: ${inputs.targetLocation}`);
  if (inputs.lifestyle?.length) lines.push(`Lifestyle Factors: ${inputs.lifestyle.join(', ')}`);
  if (inputs.priorities?.length) lines.push(`Personal Priorities: ${inputs.priorities.join(', ')}`);
  if (inputs.timeframe) lines.push(`Decision Timeframe: ${inputs.timeframe}`);

  lines.push('');
  lines.push('Respond with a JSON object using EXACTLY this structure:');
  lines.push(`{
  "summary": "<2-3 sentence overview of the decision and its key trade-offs>",
  "recommendation": "<clear, actionable recommendation in 1-2 sentences>",
  "recommendationStrength": "<one of: strongly-recommended | recommended | neutral | not-recommended | strongly-not-recommended>",
  "lifeImpact": {
    "financial": <integer 0-100, higher = better financial outcome>,
    "career": <integer 0-100, higher = better career outcome>,
    "personal": <integer 0-100, higher = better personal fulfillment>,
    "social": <integer 0-100, higher = better social/relationship outcome>,
    "health": <integer 0-100, higher = better health outcome>,
    "overall": <integer 0-100, weighted overall life impact score>
  },
  "riskLevel": "<one of: low | medium | high>",
  "riskFactors": [
    {
      "category": "<risk category name>",
      "level": "<one of: low | medium | high>",
      "description": "<specific risk description>",
      "mitigation": "<practical mitigation strategy>"
    }
  ],
  "scenarios": [
    {
      "title": "<scenario title e.g. Best Case>",
      "description": "<2-sentence scenario description>",
      "probability": <integer 0-100>,
      "impact": "<one of: positive | neutral | negative>",
      "details": ["<key detail 1>", "<key detail 2>", "<key detail 3>"]
    }
  ],
  "keyInsights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "actionItems": ["<concrete action 1>", "<concrete action 2>", "<concrete action 3>"],
  "confidenceScore": <integer 0-100, confidence in this analysis>
}`);
  lines.push('');
  lines.push('Provide 3-5 risk factors, exactly 3 scenarios (Best Case, Most Likely, Worst Case), 3-5 key insights, and 3-5 action items.');

  return lines.join('\n');
}
