'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LayoutDashboard,
  Heart,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/causes", label: "Causes" },
  { href: "/mission", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const isLoggedWithAccount = user && !user.isAnonymous;
  const isAdmin = user?.email?.toLowerCase() === 'chaya123@chayaisrael.com' || user?.email?.toLowerCase() === 'davidafergan999@gmail.com';

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 p-4 md:p-5 pointer-events-none",
        isScrolled && "p-2 md:p-3"
      )}>
        <div className={cn(
            "container mx-auto flex h-20 md:h-24 items-center justify-between rounded-full border border-white/40 bg-white/95 px-6 md:px-10 shadow-2xl backdrop-blur-2xl transition-all duration-500 pointer-events-auto",
            isScrolled && "shadow-lg border-primary/10 h-18 md:h-20"
        )}>
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 transition-transform duration-500 hover:scale-105">
            <Image 
              src="/Logo.png" 
              alt="Chaya Israel" 
              width={220} 
              height={70} 
              priority 
              className="h-10 md:h-12 w-auto"
            />
          </Link>
          
          <nav className="hidden items-center justify-center gap-8 text-sm font-bold md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative transition-all duration-300",
                  pathname === link.href ? "text-primary" : "text-foreground/60 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!isUserLoading && (
              <div className="hidden lg:flex items-center gap-3">
                {isLoggedWithAccount ? (
                  <>
                    {isAdmin && (
                      <Button variant="ghost" asChild className="rounded-full h-10 px-5 font-bold text-accent hover:bg-accent/5">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" /> Admin
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" asChild className="rounded-full h-12 px-6 gap-3 border-slate-100 bg-white hover:bg-slate-50 transition-all font-bold shadow-sm">
                      <Link href="/account" className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-primary" /> My Account
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild className="rounded-full h-10 px-5 font-bold text-foreground/70 hover:text-primary">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Button asChild size="lg" className="rounded-full h-11 md:h-12 px-8 font-bold shadow-md bg-primary text-white hover:bg-primary/90 transition-all">
              <Link href="/donate" className="flex items-center gap-2">
                Donate <Heart className="h-4 w-4 fill-current" />
              </Link>
            </Button>
            
            <div className="md:hidden flex items-center">
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
               <Image src="/Logo.png" alt="Logo" width={180} height={50} className="h-10 w-auto"/>
               <button 
                 type="button"
                 className="h-10 w-10 flex items-center justify-center text-primary"
                 onClick={() => setIsOpen(false)}
               >
                  <X className="h-7 w-7" />
               </button>
            </div>
            <nav className="flex flex-col gap-4 text-xl font-bold">
              {navLinks.map(link => (
                <button 
                  key={link.href} 
                  onClick={() => navigate(link.href)} 
                  className={cn(
                    "py-3 text-left flex items-center justify-between border-b border-slate-50",
                    pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                  <ChevronRight className="h-5 w-5 opacity-20" />
                </button>
              ))}
              
              <div className="pt-6 flex flex-col gap-4">
                {isLoggedWithAccount ? (
                  <>
                    <button 
                      onClick={() => navigate('/account')} 
                      className="text-left text-foreground flex items-center gap-4 font-bold py-2"
                    >
                      <UserIcon className="h-6 w-6 text-primary" /> My Account
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => navigate('/admin/dashboard')} 
                        className="text-left text-accent flex items-center gap-4 font-bold py-2"
                      >
                        <LayoutDashboard className="h-6 w-6" /> Admin Dashboard
                      </button>
                    )}
                  </>
                ) : (
                  <Button onClick={() => navigate('/login')} variant="outline" className="rounded-full h-14 font-bold w-full">
                    Sign In
                  </Button>
                )}
              </div>

              <Button onClick={() => navigate('/donate')} size="lg" className="rounded-full h-16 text-xl font-bold mt-8 bg-primary text-white shadow-xl">
                Donate Now
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
