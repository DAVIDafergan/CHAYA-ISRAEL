
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your account.",
      });
      router.push('/account');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your email and password.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 pt-32 pb-24">
      <Card className="w-full max-w-md rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border-0 overflow-hidden bg-white">
        <CardHeader className="p-10 text-center pb-2">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight luxury-gradient-text">Welcome back</CardTitle>
          <p className="text-muted-foreground text-sm font-medium mt-2">Login to manage your impact and receipts</p>
        </CardHeader>
        <CardContent className="p-10 pt-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground tracking-widest px-1">Email address</label>
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
              <label className="text-[10px] font-black text-muted-foreground tracking-widest px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="h-14 pl-14 rounded-2xl bg-slate-50 border-0 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-full font-black text-base shadow-xl bg-primary hover:bg-primary/90 transition-all mt-4 border-b-4 border-primary-foreground/20"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login now"}
            </Button>
          </form>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500 font-medium">
               Don't have an account? <Link href="/signup" className="text-primary font-black hover:underline">Create account</Link>
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
