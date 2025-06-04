import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Star, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r min-h-screen p-4">
          <nav className="space-y-2">
            <Link href="/home">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Markets
              </Button>
            </Link>
            <Link href="/watchlist">
              <Button variant="ghost" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Watchlist
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
} 