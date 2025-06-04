import { env } from '@/env';

const TEMPLATE = `SYSTEM:
You are Gemini 2.5 Pro – Deep Research.
Analyze the given stock ticker and provide a comprehensive research report.
Focus on factual information, market analysis, and key metrics.
Be concise but thorough in your analysis.

USER:
Topic: {{TOPIC}}
Return Markdown sections:
1. TL;DR, 2. Financials, 3. Valuation, 4. Catalysts, 5. Risks, 6. Sources`;

export async function deepResearch(topic: string): Promise<string> {
  const prompt = TEMPLATE.replace('{{TOPIC}}', topic);

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GEMINI_KEY}`,
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.25,
        top_p: 0.9,
        max_output_tokens: 2000,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to generate research report');
  }

  const data = await response.json();
  return data.candidates[0].output;
} 