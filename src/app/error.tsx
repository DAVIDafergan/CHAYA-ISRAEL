'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-50">
      <div className="bg-destructive/10 p-6 rounded-full">
        <RefreshCcw className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          An unexpected error occurred. We've been notified and are working on a fix.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="rounded-full h-12 px-8 font-bold">
          Try again
        </Button>
        <Button variant="outline" asChild className="rounded-full h-12 px-8 font-bold">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}