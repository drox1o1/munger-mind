import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <ul>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {todos?.map((todo: any) => (
        <li key={todo.id}>{todo}</li>
      ))}
    </ul>
  );
}
