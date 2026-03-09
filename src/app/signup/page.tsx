
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SignupForm() {
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const prefilledEmail = searchParams.get('email');
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [searchParams]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName.trim(), email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let message = "Could not create account. Please try again.";
        if (response.status === 409) {
          message = "This email is already registered.";
        } else if (data.error) {
          message = data.error;
        }
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: message,
        });
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Account created",
          description: "Please log in with your new credentials.",
        });
        router.push('/login');
      } else {
        toast({
          title: "Account created",
          description: "Welcome to the Chaya Israel family.",
        });
        router.push('/account');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-white">
      <CardHeader className="p-10 text-center pb-2">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight luxury-gradient-text">Create account</CardTitle>
        <p className="text-muted-foreground text-sm font-medium mt-2">Join us in making a difference</p>
      </CardHeader>
      <CardContent className="p-10 pt-6">
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground tracking-widest px-1 uppercase">Full name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="text" 
                placeholder="John Doe" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                className="h-14 pl-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground tracking-widest px-1 uppercase">Email address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-14 pl-14 rounded-2xl bg-slate-50 border-0 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground tracking-widest px-1 uppercase">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="password" 
                placeholder="Min. 6 characters" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6}
                className="h-14 pl-14 rounded-2xl bg-slate-50 border-0 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 rounded-full font-black text-base shadow-xl bg-primary hover:bg-primary/90 transition-all mt-4 border-b-4 border-primary-foreground/20"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign up now"}
          </Button>
        </form>
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
           <p className="text-sm text-slate-500 font-medium">
             Already have an account? <Link href="/login" className="text-primary font-black hover:underline">Login</Link>
           </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 pt-32 pb-24">
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
