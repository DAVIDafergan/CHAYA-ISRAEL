
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section - Image at the top, content below */}
      <section className="relative w-full pt-20">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <Image
            src="/HERO1.png"
            alt="Chaya Israel charity hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="container mx-auto px-6 py-12 md:py-20 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-10">
            Chaya <span className="text-primary">Israel</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Button size="lg" asChild className="h-12 md:h-16 px-8 md:px-12 rounded-full font-black bg-primary text-white shadow-2xl text-sm md:text-lg border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
              <Link href="/donate" className="flex items-center gap-2">
                Donate now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 md:h-16 px-8 md:px-12 rounded-full font-black border-primary/20 text-primary text-sm md:text-lg hover:bg-primary/5 transition-all" asChild>
              <Link href="/causes">Our causes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 md:py-32 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight luxury-gradient-text mb-6">About Us</h2>
            <h3 className="text-xl md:text-4xl font-bold tracking-tight text-slate-800 max-w-3xl mx-auto leading-tight">
              24 Years of Broad Chesed Activity
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 max-w-5xl mx-auto">
            {/* Rabbi Avraham Kramer */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-48 h-48 md:w-[320px] md:h-[320px] overflow-hidden rounded-full border-[4px] md:border-[8px] border-white shadow-2xl bg-white ring-2 md:ring-[8px] ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-xs md:text-base font-bold tracking-tight text-primary">Executive director</p>
              </div>
            </div>
            
            {/* Dr. Shilo Kramer */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-48 h-48 md:w-[320px] md:h-[320px] overflow-hidden rounded-full border-[4px] md:border-[8px] border-white shadow-2xl bg-white ring-2 md:ring-[8px] ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-xs md:text-base font-bold tracking-tight text-primary">Co-director</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12 md:mt-20">
            <Button variant="outline" className="rounded-full h-12 md:h-14 px-10 md:px-16 font-black border-primary/20 text-primary hover:bg-primary/5 text-sm md:text-base transition-all shadow-sm" asChild>
              <Link href="/mission">About us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partner with Community Leaders Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight luxury-gradient-text mb-4">Partner with community leaders</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-sm md:text-lg text-foreground font-medium leading-relaxed tracking-tight">
                Community leaders know the needs of their congregations best. They ensure your donations make the biggest possible impact where it is needed most.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Rabbi Reuven Elbaz */}
            <div className="glass-card p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-primary/5 shadow-2xl bg-white space-y-6 flex flex-col group hover:border-accent/30 transition-all duration-700">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full border-[3px] md:border-[5px] border-primary/10 shadow-xl shrink-0">
                  <Image src="/ראובן אלבז.png" alt="Rabbi Reuven Elbaz" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-lg md:text-2xl font-black text-foreground leading-tight tracking-tight">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-bold text-xs md:text-sm tracking-tight">Director of the Or Hachaim organization</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 md:h-12 md:w-12 text-accent/10" />
                <p className="text-foreground/80 text-sm md:text-base leading-relaxed relative z-10 font-medium italic">
                  I am proud to testify on behalf of the Chaya Israel Foundation. The foundation supports newlyweds, orphaned grooms and brides, widows and other disadvantaged members of the community. It's a great mitzva to support this important organization so that it can continue to support those in need with even greater force and impact.
                </p>
              </div>
              <div className="pt-4 mt-auto">
                 <h5 className="font-black text-foreground text-base md:text-lg mb-6">Rabbi Reuven Elbaz</h5>
                 <Button size="lg" asChild className="rounded-full h-12 md:h-14 w-full font-black bg-primary text-white shadow-glow-blue text-sm md:text-base border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>

            {/* Avichai Amosi */}
            <div className="glass-card p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-primary/5 shadow-2xl bg-white space-y-6 flex flex-col group hover:border-accent/30 transition-all duration-700">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full border-[3px] md:border-[5px] border-primary/10 shadow-xl shrink-0">
                  <Image src="/Avichai Amosi.png" alt="Avichai Amosi" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-lg md:text-2xl font-black text-foreground leading-tight tracking-tight">Avichai Amosi</h4>
                  <p className="text-primary font-bold text-xs md:text-sm tracking-tight">Director of Merkaz Chesed Sderot</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 md:h-12 md:w-12 text-accent/10" />
                <p className="text-foreground/80 text-sm md:text-base leading-relaxed relative z-10 font-medium italic">
                  Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support! May G-d bless all those that have helped under-privileged communities with food and shelter.
                </p>
              </div>
              <div className="pt-4 mt-auto">
                 <h5 className="font-black text-foreground text-base md:text-lg mb-6">Avichai Amosi</h5>
                 <Button size="lg" asChild className="rounded-full h-12 md:h-14 w-full font-black bg-primary text-white shadow-glow-blue text-sm md:text-base border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area Call-to-Action */}
      <section className="py-20 md:py-40 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full -mr-64 -mt-64 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full -ml-64 -mb-64 blur-[120px]" />
        <div className="container mx-auto px-6 text-center relative z-10 space-y-8 md:space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-2xl">
              Please help us give life to those who rely on YOU
            </h2>
            <p className="text-base md:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed">
              Allow us to serve as your messenger by distributing charity to those in Israel who are most in need.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button size="lg" asChild className="rounded-full h-14 md:h-18 px-12 md:px-20 font-black bg-primary text-white shadow-2xl text-base md:text-xl border-b-4 border-primary-foreground/20 hover:scale-110 transition-all">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full h-14 md:h-18 px-12 md:px-20 font-black bg-white/5 border-white/20 text-white text-base md:text-xl hover:bg-white/10 transition-all">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
