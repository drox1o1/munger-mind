import { NextResponse } from 'next/server';
import { z } from 'zod';
import { searchSymbols } from '@/lib/alphaClient';

const searchParamsSchema = z.object({
  q: z.string().min(3),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const validatedParams = searchParamsSchema.parse({ q: query });
    const results = await searchSymbols(validatedParams.q);

    return NextResponse.json(
      { results },
      {
        headers: {
          'Cache-Control': 's-maxage=60',
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 