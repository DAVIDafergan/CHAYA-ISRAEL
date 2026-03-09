
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Lock, User, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "The security system is not ready. Please refresh the page.",
      });
      return;
    }

    setIsAuthenticating(true);
    try {
      // Map username CHAYA123 to the required email format
      const loginEmail = username.trim().toLowerCase() === 'chaya123' 
        ? 'chaya123@chayaisrael.com' 
        : (username.trim().includes('@') ? username.trim() : `${username.trim()}@chayaisrael.com`);
        
      await signInWithEmailAndPassword(auth, loginEmail, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back, manager.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid credentials. Please check your manager id and password.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials. Please make sure the account chaya123@chayaisrael.com is created in the Firebase console.";
      }

      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-slate-500 font-bold tracking-widest text-xs">Loading security...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 pt-32 pb-24">
      <Card className="w-full max-w-md rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-0 overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="mx-auto bg-white/20 p-4 rounded-full w-fit mb-4 relative z-10">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight relative z-10">Admin access</CardTitle>
          <p className="text-primary-foreground/70 text-sm font-medium relative z-10">Please enter your manager credentials</p>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground tracking-widest px-1">Manager id</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="text" 
                  placeholder="e.g. CHAYA123" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  className="h-14 pl-14 rounded-2xl bg-slate-50 border-0 px-6 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
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
              disabled={isAuthenticating}
              className="w-full h-14 rounded-full font-black text-base shadow-xl bg-primary hover:bg-primary/90 transition-all mt-4 border-b-4 border-primary-foreground/20"
            >
              {isAuthenticating ? "Authenticating..." : "Login to dashboard"}
            </Button>
          </form>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
             <p className="text-[10px] text-slate-400 font-bold tracking-widest leading-relaxed">
               Only authorized managers can access this dashboard. All login attempts are recorded for security purposes.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
