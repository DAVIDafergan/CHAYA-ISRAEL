'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative w-full pt-20">
        <div className="relative w-full h-[45vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
          <Image
            src="/HERO1.png"
            alt="Chaya Israel charity hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="container mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-40 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.9] mb-12 break-words hyphens-auto max-w-full px-4">
            Chaya <span className="text-primary">Israel</span>
          </h1>
          
          <div className="space-y-12 md:space-y-20 w-full max-w-5xl px-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-10">
              <Button size="lg" asChild className="h-16 md:h-20 px-10 md:px-14 rounded-full font-black bg-primary text-white shadow-xl text-xl md:text-2xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all w-full sm:w-auto">
                <Link href="/donate" className="flex items-center justify-center gap-3">
                  Donate now <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 md:h-20 px-10 md:px-14 rounded-full font-black border-2 md:border-4 border-primary/20 text-primary text-xl md:text-2xl hover:bg-primary/5 transition-all shadow-md w-full sm:w-auto" asChild>
                <Link href="/causes">Our causes</Link>
              </Button>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                asChild 
                className="h-24 md:h-36 px-10 md:px-16 rounded-[3rem] border-2 border-primary/10 bg-white shadow-lg hover:shadow-glow-blue hover:border-primary/40 transition-all group"
              >
                <Link href={user ? "/account" : "/login"} className="flex flex-col items-center justify-center gap-1 md:gap-2">
                  <div className="flex items-center gap-4 text-slate-900 group-hover:text-primary transition-colors">
                    <User className="h-8 w-8 md:h-12 md:w-12 group-hover:scale-110 transition-transform" />
                    <span className="text-xl md:text-3xl font-black tracking-tight uppercase">Donor Portal</span>
                  </div>
                  <span className="text-[10px] md:text-sm font-black text-muted-foreground uppercase tracking-widest opacity-60">
                    (My Giving History)
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 md:py-48 bg-slate-50/50 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20 md:mb-40">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter luxury-gradient-text mb-10 break-words hyphens-auto">About Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-40 max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-10 md:space-y-16">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-2xl bg-white ring-4 ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-black text-foreground tracking-tight break-words">Rabbi Avraham Kramer</h3>
                <p className="text-xl md:text-3xl font-black tracking-tight text-primary uppercase">Executive director</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-10 md:space-y-16">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-2xl bg-white ring-4 ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-black text-foreground tracking-tight break-words">Dr. Shilo Kramer</h3>
                <p className="text-xl md:text-3xl font-black tracking-tight text-primary uppercase">Co-director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area Call-to-Action */}
      <section className="py-32 md:py-56 bg-foreground text-white relative overflow-hidden px-6">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full -ml-48 -mb-48 blur-[120px]" />
        <div className="container mx-auto px-4 text-center relative z-10 space-y-20 md:space-y-32">
          <div className="space-y-12">
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-tight break-words hyphens-auto max-w-full px-4">
              Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
            </h2>
            <p className="text-xl md:text-4xl text-white/70 max-w-6xl mx-auto font-medium leading-relaxed px-4">
              Allow us to serve as your messenger by distributing charity to those in Israel who are most in need.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-16">
            <Button size="lg" asChild className="rounded-full h-20 md:h-32 px-16 md:px-32 font-black bg-primary text-white shadow-2xl text-2xl md:text-5xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full h-20 md:h-32 px-16 md:px-32 font-black bg-white/5 border-2 border-white/25 text-white text-2xl md:text-5xl hover:bg-white/15 transition-all shadow-xl">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
