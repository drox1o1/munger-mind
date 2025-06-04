import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

export const supabaseServer = () =>
  createServerSupabaseClient({ cookies, headers }); 