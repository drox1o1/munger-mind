import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getQuote } from '@/lib/alphaClient';
import { callLLM } from '@/lib/llm';

const researchParamsSchema = z.object({
  topic: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    const validatedParams = researchParamsSchema.parse({ topic });
    const quote = await getQuote(validatedParams.topic);
    const prompt = `SYSTEM: You are an equity research analyst...\nDATA:${JSON.stringify(quote)}\nUSER: write report`;
    const report = await callLLM({ prompt, maxTokens: 4096 });

    return NextResponse.json(
      { report },
      {
        headers: {
          'Cache-Control': 's-maxage=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid topic parameter' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 