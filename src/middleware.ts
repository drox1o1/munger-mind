// import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
// import { createServerClient } from '@supabase/ssr';
// import { createClient } from '@supabase/supabase-js';
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function middleware(req: Request) {
//   // Middleware logic here
// }

export const config = { matcher: ['/app/:path*'] }; 