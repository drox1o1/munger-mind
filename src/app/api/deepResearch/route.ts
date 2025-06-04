import { NextResponse } from 'next/server';
import { z } from 'zod';
import { deepResearch } from '@/lib/gemini/deepResearch';

const researchParamsSchema = z.object({
  topic: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    const validatedParams = researchParamsSchema.parse({ topic });
    const report = await deepResearch(validatedParams.topic);

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