'use client';

import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/utils/supabase/client';

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        onClick={() =>
          supabaseBrowser().auth.signInWithOAuth({ provider: 'github' })
        }
      >
        Sign in with GitHub
      </Button>
    </div>
  );
} 