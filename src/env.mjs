import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
  ALPHAVANTAGE_KEY: z.string().min(1),
  GEMINI_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_ORG_ID: z.string().optional(),
  LLM_PROVIDER: z.enum(['gemini', 'openai']).optional(),
});

export const env = envSchema.parse(process.env);
