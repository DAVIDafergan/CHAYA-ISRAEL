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
        
        <div className="container mx-auto px-6 pt-10 pb-16 md:pt-16 md:pb-32 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-tight mb-10 break-words max-w-full px-4">
            Chaya <span className="text-primary">Israel</span>
          </h1>
          
          <div className="space-y-10 md:space-y-14 w-full max-w-4xl px-4">
            <div className="flex flex-col sm:flex-row justify-center gap-5 md:gap-10">
              <Button size="lg" asChild className="h-16 md:h-24 px-10 md:px-20 rounded-full font-black bg-primary text-white shadow-xl text-xl md:text-3xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                <Link href="/donate" className="flex items-center gap-3">
                  Donate now <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 md:h-24 px-10 md:px-20 rounded-full font-black border-2 md:border-4 border-primary/20 text-primary text-xl md:text-3xl hover:bg-primary/5 transition-all" asChild>
                <Link href="/causes">Our causes</Link>
              </Button>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                asChild 
                className="h-20 md:h-32 px-10 md:px-14 rounded-[2.5rem] md:rounded-[4rem] border-2 md:border-4 border-primary/10 bg-white shadow-lg hover:shadow-glow-blue hover:border-primary/40 transition-all group"
              >
                <Link href={user ? "/account" : "/login"} className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-3 text-slate-900 group-hover:text-primary transition-colors">
                    <User className="h-7 w-7 md:h-10 md:w-10 group-hover:scale-110 transition-transform" />
                    <span className="text-lg md:text-3xl font-black tracking-tight uppercase">Donor Portal</span>
                  </div>
                  <span className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    (My Giving)
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 md:py-40 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 md:mb-32">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight luxury-gradient-text mb-8">About Us</h2>
            <h3 className="text-2xl md:text-5xl font-black tracking-tight text-slate-800 max-w-5xl mx-auto leading-tight px-4">
              24 Years of Broad Chesed Activity
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-xl bg-white ring-4 ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-lg md:text-2xl font-black tracking-tight text-primary uppercase">Executive director</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-xl bg-white ring-4 ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-lg md:text-2xl font-black tracking-tight text-primary uppercase">Co-director</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-20 md:mt-32">
            <Button variant="outline" className="rounded-full h-18 md:h-24 px-14 md:px-28 font-black border-2 md:border-4 border-primary/20 text-primary hover:bg-primary/5 text-xl md:text-3xl transition-all" asChild>
              <Link href="/mission">Our Full Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Area Call-to-Action */}
      <section className="py-24 md:py-48 bg-foreground text-white relative overflow-hidden px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full -ml-48 -mb-48 blur-[120px]" />
        <div className="container mx-auto px-4 text-center relative z-10 space-y-16 md:space-y-24">
          <div className="space-y-10">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight break-words max-w-full px-4">
              Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
            </h2>
            <p className="text-lg md:text-3xl text-white/70 max-w-5xl mx-auto font-medium leading-relaxed px-4">
              Allow us to serve as your messenger by distributing charity to those in Israel who are most in need.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button size="lg" asChild className="rounded-full h-18 md:h-28 px-14 md:px-28 font-black bg-primary text-white shadow-xl text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full h-18 md:h-28 px-14 md:px-28 font-black bg-white/5 border-2 border-white/25 text-white text-2xl md:text-4xl hover:bg-white/15 transition-all">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
