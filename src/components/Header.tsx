'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/causes", label: "Causes" },
  { href: "/mission", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 p-4 md:p-5",
        isScrolled && "p-2 md:p-3"
      )}>
        <div className={cn(
            "container mx-auto flex h-20 md:h-24 items-center justify-between rounded-full border border-white/40 bg-white/95 px-6 md:px-10 shadow-2xl backdrop-blur-2xl transition-all duration-500",
            isScrolled && "shadow-glow-blue border-primary/10 h-18 md:h-20"
        )}>
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 transition-all duration-500 hover:scale-105">
            <Image 
              src="/Logo.png" 
              alt="CHAYA ISRAEL Logo" 
              width={280} 
              height={90} 
              priority 
              className="h-10 md:h-14 w-auto isolate bg-transparent"
            />
          </Link>
          
          <nav className="hidden items-center justify-center gap-6 text-sm md:text-base font-black md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3 py-1.5 transition-all duration-300",
                  pathname === link.href ? "text-primary" : "text-foreground/60 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild size="lg" className="hidden md:flex rounded-full h-10 md:h-12 px-6 md:px-10 text-sm md:text-base font-black shadow-glow-blue border-b-4 border-primary-foreground/20 bg-primary text-white hover:bg-primary/90">
              <Link href="/donate" className="flex items-center gap-2">
                Donate <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-full md:hidden h-10 px-5 text-xs font-black shadow-lg bg-primary text-white hover:bg-primary/90">
              <Link href="/donate">Donate</Link>
            </Button>
            <div className="md:hidden">
              <button 
                type="button"
                className="rounded-full h-10 w-10 bg-black/5 flex items-center justify-center text-primary relative z-[101]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
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
            <nav className="flex flex-col gap-5 text-xl font-black">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={cn(
                  "py-1",
                  pathname === link.href ? "text-primary" : "text-foreground"
                )}>
                  {link.label}
                </Link>
              ))}
              <Button asChild size="lg" className="rounded-full h-14 text-lg font-black mt-6 bg-primary text-white hover:bg-primary/90">
                <Link href="/donate" onClick={() => setIsOpen(false)}>Donate Now</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
