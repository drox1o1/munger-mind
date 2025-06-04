import { env } from '@/env';
export type Provider = 'gemini' | 'openai';
const provider: Provider = env.LLM_PROVIDER ?? 'gemini';
export async function callLLM({
  prompt,
  maxTokens = 2048,
  temperature = 0.25,
}: {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        ...(env.OPENAI_ORG_ID ? { 'OpenAI-Organization': env.OPENAI_ORG_ID } : {}),
      },
      body: JSON.stringify({
        model: maxTokens > 4096 ? 'gpt-4o' : 'gpt-3.5-turbo-16k',
        messages: [{ role: 'system', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${env.GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature,
        max_output_tokens: maxTokens,
      }),
    },
  ).then((r) => r.json());
  if (!res?.candidates?.[0]?.output) throw new Error('Gemini empty');
  return res.candidates[0].output as string;
}
