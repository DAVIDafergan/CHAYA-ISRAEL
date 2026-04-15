
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
        <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
          <Image
            src="/HERO1.png"
            alt="Chaya Israel charity hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 pt-8 pb-16 md:pt-12 md:pb-24 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-tight mb-8 break-words max-w-full px-4">
            Chaya <span className="text-primary">Israel</span>
          </h1>
          
          <div className="space-y-8 md:space-y-12 w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
              <Button size="lg" asChild className="h-16 md:h-24 px-8 md:px-16 rounded-full font-black bg-primary text-white shadow-xl text-lg md:text-2xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                <Link href="/donate" className="flex items-center gap-3">
                  Donate now <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 md:h-24 px-8 md:px-16 rounded-full font-black border-2 md:border-4 border-primary/20 text-primary text-lg md:text-2xl hover:bg-primary/5 transition-all" asChild>
                <Link href="/causes">Our causes</Link>
              </Button>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                asChild 
                className="h-20 md:h-28 px-8 md:px-12 rounded-[2rem] md:rounded-[3rem] border-2 md:border-4 border-primary/10 bg-white shadow-lg hover:shadow-glow-blue hover:border-primary/40 transition-all group"
              >
                <Link href={user ? "/account" : "/login"} className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-3 text-slate-900 group-hover:text-primary transition-colors">
                    <User className="h-6 w-6 md:h-8 md:w-8 group-hover:scale-110 transition-transform" />
                    <span className="text-base md:text-2xl font-black tracking-tight uppercase">Donor Portal</span>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    (My Giving)
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-32 bg-slate-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight luxury-gradient-text mb-6">About Us</h2>
            <h3 className="text-xl md:text-4xl font-black tracking-tight text-slate-800 max-w-4xl mx-auto leading-tight px-4">
              24 Years of Broad Chesed Activity
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-xl bg-white ring-4 ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-base md:text-xl font-black tracking-tight text-primary uppercase">Executive director</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-xl bg-white ring-4 ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-base md:text-xl font-black tracking-tight text-primary uppercase">Co-director</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12 md:mt-24">
            <Button variant="outline" className="rounded-full h-14 md:h-20 px-12 md:px-24 font-black border-2 md:border-4 border-primary/20 text-primary hover:bg-primary/5 text-lg md:text-2xl transition-all" asChild>
              <Link href="/mission">Our Full Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partner with Community Leaders Section */}
      <section className="py-16 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight luxury-gradient-text mb-6">Community Leaders</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-base md:text-2xl text-foreground font-medium leading-relaxed tracking-tight opacity-90 px-4">
                Community leaders know the needs of their congregations best. They ensure your donations make the biggest possible impact where it is needed most.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 max-w-6xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-primary/5 shadow-xl bg-white space-y-8 flex flex-col group hover:border-accent/30 transition-all duration-500">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="relative w-20 h-20 md:w-32 md:h-32 overflow-hidden rounded-full border-4 border-primary/10 shadow-md shrink-0">
                  <Image src="/reuven-elbaz.png" alt="Rabbi Reuven Elbaz" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-lg md:text-3xl font-black text-foreground leading-tight tracking-tight">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-black text-sm md:text-lg tracking-tight opacity-80">Director of Or Hachaim</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 h-12 w-12 text-accent/10" />
                <p className="text-foreground/80 text-sm md:text-xl leading-relaxed relative z-10 font-medium italic">
                  I am proud to testify on behalf of the Chaya Israel Foundation. The foundation supports newlyweds, orphaned grooms and brides, widows and other disadvantaged members of the community.
                </p>
              </div>
              <div className="pt-6 mt-auto">
                 <Button size="lg" asChild className="rounded-full h-14 md:h-20 w-full font-black bg-primary text-white shadow-lg text-lg md:text-2xl border-b-4 border-primary-foreground/20 hover:scale-102 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>

            <div className="glass-card p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-primary/5 shadow-xl bg-white space-y-8 flex flex-col group hover:border-accent/30 transition-all duration-500">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="relative w-20 h-20 md:w-32 md:h-32 overflow-hidden rounded-full border-4 border-primary/10 shadow-md shrink-0">
                  <Image src="/Avichai Amosi.png" alt="Avichai Amosi" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-lg md:text-3xl font-black text-foreground leading-tight tracking-tight">Avichai Amosi</h4>
                  <p className="text-primary font-black text-sm md:text-lg tracking-tight opacity-80">Merkaz Chesed Sderot</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 h-12 w-12 text-accent/10" />
                <p className="text-foreground/80 text-sm md:text-xl leading-relaxed relative z-10 font-medium italic">
                  Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support!
                </p>
              </div>
              <div className="pt-6 mt-auto">
                 <Button size="lg" asChild className="rounded-full h-14 md:h-20 w-full font-black bg-primary text-white shadow-lg text-lg md:text-2xl border-b-4 border-primary-foreground/20 hover:scale-102 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area Call-to-Action */}
      <section className="py-24 md:py-40 bg-foreground text-white relative overflow-hidden px-4">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full -ml-48 -mb-48 blur-[100px]" />
        <div className="container mx-auto px-6 text-center relative z-10 space-y-12 md:space-y-20">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight break-words max-w-full">
              Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
            </h2>
            <p className="text-base md:text-2xl text-white/70 max-w-4xl mx-auto font-medium leading-relaxed">
              Allow us to serve as your messenger by distributing charity to those in Israel who are most in need.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" asChild className="rounded-full h-16 md:h-24 px-12 md:px-24 font-black bg-primary text-white shadow-xl text-xl md:text-3xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full h-16 md:h-24 px-12 md:px-24 font-black bg-white/5 border-2 border-white/25 text-white text-xl md:text-3xl hover:bg-white/15 transition-all">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
