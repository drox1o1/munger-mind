import { z } from 'zod';

const envSchema = z.object({
  ALPHAVANTAGE_KEY: z.string().min(1),
  GEMINI_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  ALPHAVANTAGE_KEY: process.env.ALPHAVANTAGE_KEY,
  GEMINI_KEY: process.env.GEMINI_KEY,
}); 