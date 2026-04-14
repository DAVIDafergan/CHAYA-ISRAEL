'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative w-full pt-20">
        <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
          <Image
            src="/HERO1.png"
            alt="Chaya Israel charity hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="container mx-auto px-6 pt-6 pb-16 md:pt-4 md:pb-20 text-center flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-none mb-12 drop-shadow-sm">
            Chaya <span className="text-primary">Israel</span>
          </h1>
          
          <div className="space-y-8 md:space-y-10 w-full max-w-5xl">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              <Button size="lg" asChild className="h-20 md:h-24 px-12 md:px-24 rounded-full font-black bg-primary text-white shadow-2xl text-xl md:text-3xl border-b-4 border-primary-foreground/20 hover:scale-110 transition-all duration-500">
                <Link href="/donate" className="flex items-center gap-4">
                  Donate now <ArrowRight className="h-8 w-8 md:h-10 md:w-10" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-20 md:h-24 px-12 md:px-24 rounded-full font-black border-primary/20 text-primary text-xl md:text-3xl hover:bg-primary/5 transition-all duration-500" asChild>
                <Link href="/causes">Our causes</Link>
              </Button>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                asChild 
                className="h-24 md:h-24 px-10 md:px-16 rounded-[3rem] border-primary/10 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:shadow-glow-blue hover:border-primary/40 hover:scale-105 transition-all duration-500 group border-2"
              >
                <Link href={user ? "/account" : "/login"} className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-3 text-slate-900 group-hover:text-primary transition-all duration-500">
                    <User className="h-6 w-6 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                    <span className="text-xl md:text-2xl font-black tracking-tight uppercase">Donor Portal</span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60 group-hover:text-primary/70 group-hover:opacity-100 transition-all">
                    (My Giving)
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 md:py-48 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight luxury-gradient-text mb-8">About Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 max-w-4xl mx-auto leading-tight">
              24 Years of Broad Chesed Activity
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative w-64 h-64 md:w-[380px] md:h-[380px] overflow-hidden rounded-full border-[6px] md:border-[10px] border-white shadow-2xl bg-white ring-2 md:ring-[10px] ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-xl md:text-2xl font-bold tracking-tight text-primary">Executive director</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative w-64 h-64 md:w-[380px] md:h-[380px] overflow-hidden rounded-full border-[6px] md:border-[10px] border-white shadow-2xl bg-white ring-2 md:ring-[10px] ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-xl md:text-2xl font-bold tracking-tight text-primary">Co-director</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-16 md:mt-32">
            <Button variant="outline" className="rounded-full h-20 md:h-22 px-14 md:px-24 font-black border-primary/20 text-primary hover:bg-primary/5 text-xl md:text-2xl transition-all shadow-sm" asChild>
              <Link href="/mission">About us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partner with Community Leaders Section */}
      <section className="py-24 md:py-48 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight luxury-gradient-text mb-8">Partner with community leaders</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed tracking-tight">
                Community leaders know the needs of their congregations best. They ensure your donations make the biggest possible impact where it is needed most.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
            <div className="glass-card p-10 md:p-16 rounded-[40px] md:rounded-[64px] border border-primary/5 shadow-2xl bg-white space-y-8 flex flex-col group hover:border-accent/30 transition-all duration-700">
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border-[4px] md:border-[6px] border-primary/10 shadow-xl shrink-0">
                  <Image src="/reuven-elbaz.png" alt="Rabbi Reuven Elbaz" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-bold text-base md:text-lg tracking-tight">Director of the Or Hachaim organization</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 h-12 w-12 md:h-16 md:w-16 text-accent/10" />
                <p className="text-foreground/80 text-lg md:text-xl leading-relaxed relative z-10 font-medium italic">
                  I am proud to testify on behalf of the Chaya Israel Foundation. The foundation supports newlyweds, orphaned grooms and brides, widows and other disadvantaged members of the community. It's a great mitzva to support this important organization.
                </p>
              </div>
              <div className="pt-6 mt-auto">
                 <h5 className="font-black text-foreground text-xl md:text-2xl mb-8">Rabbi Reuven Elbaz</h5>
                 <Button size="lg" asChild className="rounded-full h-20 md:h-24 w-full font-black bg-primary text-white shadow-glow-blue text-xl md:text-3xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>

            <div className="glass-card p-10 md:p-16 rounded-[40px] md:rounded-[64px] border border-primary/5 shadow-2xl bg-white space-y-8 flex flex-col group hover:border-accent/30 transition-all duration-700">
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full border-[4px] md:border-[6px] border-primary/10 shadow-xl shrink-0">
                  <Image src="/Avichai Amosi.png" alt="Avichai Amosi" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">Avichai Amosi</h4>
                  <p className="text-primary font-bold text-base md:text-lg tracking-tight">Director of Merkaz Chesed Sderot</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 h-12 w-12 md:h-16 md:w-16 text-accent/10" />
                <p className="text-foreground/80 text-lg md:text-xl leading-relaxed relative z-10 font-medium italic">
                  Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support! May G-d bless all those that have helped under-privileged communities.
                </p>
              </div>
              <div className="pt-6 mt-auto">
                 <h5 className="font-black text-foreground text-xl md:text-2xl mb-8">Avichai Amosi</h5>
                 <Button size="lg" asChild className="rounded-full h-20 md:h-24 w-full font-black bg-primary text-white shadow-glow-blue text-xl md:text-3xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area Call-to-Action */}
      <section className="py-24 md:py-60 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/15 rounded-full -mr-80 -mt-80 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full -ml-80 -mb-80 blur-[150px]" />
        <div className="container mx-auto px-6 text-center relative z-10 space-y-12 md:space-y-20">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-tight drop-shadow-2xl">
              Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
            </h2>
            <p className="text-2xl md:text-4xl text-white/70 max-w-5xl mx-auto font-medium leading-relaxed">
              Allow us to serve as your messenger by distributing charity to those in Israel who are most in need.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Button size="lg" asChild className="rounded-full h-22 md:h-28 px-14 md:px-32 font-black bg-primary text-white shadow-2xl text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-110 transition-all duration-500">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full h-22 md:h-28 px-14 md:px-32 font-black bg-white/5 border-white/25 text-white text-2xl md:text-4xl hover:bg-white/15 transition-all duration-500">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
