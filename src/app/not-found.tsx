import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-50">
      <h1 className="text-9xl font-black text-primary/10">404</h1>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Page not found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      <Button asChild className="rounded-full h-12 px-8 font-bold">
        <Link href="/">
          <Home className="h-4 w-4 mr-2" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}