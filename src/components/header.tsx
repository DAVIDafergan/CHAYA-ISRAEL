
'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Menu, X, User as UserIcon, LogOut, ChevronRight, UserPlus, LogIn, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import LinkNext from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/causes", label: "Causes" },
  { href: "/mission", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isUserLoading = status === 'loading';
  const isLoggedWithAccount = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 p-4 md:p-5 pointer-events-none",
        isScrolled && "p-2 md:p-3"
      )}>
        <div className={cn(
            "container mx-auto flex h-20 md:h-24 items-center justify-between rounded-full border border-white/40 bg-white/95 px-6 md:px-10 shadow-2xl backdrop-blur-2xl transition-all duration-500 pointer-events-auto",
            isScrolled && "shadow-glow-blue border-primary/10 h-18 md:h-20"
        )}>
          <LinkNext href="/" className="flex items-center gap-2 flex-shrink-0 transition-all duration-500 hover:scale-105">
            <Image 
              src="/Logo.png" 
              alt="Chaya Israel" 
              width={280} 
              height={90} 
              priority 
              className="h-10 md:h-14 w-auto isolate bg-transparent"
            />
          </LinkNext>
          
          <nav className="hidden items-center justify-center gap-6 text-sm md:text-base font-medium md:flex">
            {navLinks.map(link => (
              <LinkNext
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3 py-1.5 transition-all duration-300",
                  pathname === link.href ? "text-primary font-bold" : "text-foreground/60 hover:text-primary"
                )}
              >
                {link.label}
              </LinkNext>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!isUserLoading && (
              isLoggedWithAccount ? (
                <div className="hidden lg:flex items-center gap-3">
                  {isAdmin && (
                    <Button variant="ghost" asChild className="rounded-full h-10 px-4 font-bold text-accent hover:text-accent hover:bg-accent/5">
                      <LinkNext href="/admin/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Admin
                      </LinkNext>
                    </Button>
                  )}
                  <Button variant="ghost" asChild className={cn("rounded-full h-10 px-4 font-bold", pathname === '/account' ? "text-primary" : "text-foreground/70 hover:text-primary hover:bg-primary/5")}>
                    <LinkNext href="/account" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" /> My account
                    </LinkNext>
                  </Button>
                  <button onClick={handleLogout} className="text-[10px] font-bold tracking-tight text-foreground/30 hover:text-destructive transition-colors ml-2">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Button variant="ghost" asChild className="rounded-full h-10 px-4 font-bold text-foreground/70 hover:text-primary hover:bg-primary/5">
                    <LinkNext href="/login">Login</LinkNext>
                  </Button>
                  <Button variant="outline" asChild className="rounded-full h-10 px-4 font-bold border-primary/20 text-primary hover:bg-primary/5">
                    <LinkNext href="/signup">Sign up</LinkNext>
                  </Button>
                </div>
              )
            )}

            <Button asChild size="lg" className="hidden md:flex rounded-full h-10 md:h-12 px-6 md:px-10 text-sm md:text-base font-bold shadow-glow-blue border-b-4 border-primary-foreground/20 bg-primary text-white hover:bg-primary/90">
              <LinkNext href="/donate" className="flex items-center gap-2">
                Donate <ArrowRight className="h-4 w-4" />
              </LinkNext>
            </Button>
            
            <div className="md:hidden flex items-center gap-2">
              <button 
                type="button"
                className="rounded-full h-10 w-10 bg-black/5 flex items-center justify-center text-primary relative z-[101]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-white md:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-10">
               <Image src="/Logo.png" alt="Logo" width={180} height={50} className="h-12 w-auto"/>
               <button 
                 type="button"
                 className="h-10 w-10 flex items-center justify-center text-primary"
                 onClick={() => setIsOpen(false)}
               >
                  <X className="h-7 w-7" />
               </button>
            </div>
            <nav className="flex flex-col gap-5 text-xl font-bold">
              {navLinks.map(link => (
                <button 
                  key={link.href} 
                  onClick={() => navigate(link.href)} 
                  className={cn(
                    "py-1 text-left flex items-center justify-between",
                    pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                  <ChevronRight className="h-5 w-5 opacity-20" />
                </button>
              ))}
              
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                {isLoggedWithAccount ? (
                  <>
                    <button 
                      onClick={() => navigate('/account')} 
                      className="py-1 text-left text-foreground flex items-center gap-3"
                    >
                      <UserIcon className="h-6 w-6 text-primary" /> My account
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => navigate('/admin/dashboard')} 
                        className="py-1 text-left text-accent flex items-center gap-3"
                      >
                        <LayoutDashboard className="h-6 w-6" /> Admin dashboard
                      </button>
                    )}
                    <button onClick={handleLogout} className="text-base text-destructive/60 font-bold text-left flex items-center gap-3">
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button onClick={() => navigate('/login')} className="py-1 text-left text-foreground flex items-center gap-3">
                      <LogIn className="h-6 w-6 text-primary" /> Login
                    </button>
                    <button onClick={() => navigate('/signup')} className="py-1 text-left text-foreground flex items-center gap-3">
                      <UserPlus className="h-6 w-6 text-primary" /> Create account
                    </button>
                  </div>
                )}
              </div>

              <Button onClick={() => navigate('/donate')} size="lg" className="rounded-full h-16 text-xl font-bold mt-6 bg-primary text-white shadow-xl border-b-4 border-primary-foreground/20">
                Donate now
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
