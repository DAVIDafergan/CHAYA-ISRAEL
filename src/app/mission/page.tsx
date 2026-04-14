'use client';

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="overflow-x-hidden pt-32 md:pt-48 bg-white min-h-screen">
      {/* Header Section */}
      <section className="pb-12 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black luxury-gradient-text mb-4 tracking-tight leading-none">
            About Us
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-10 text-foreground/70 tracking-tight">
            Our Mission
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-10 md:p-16 rounded-[32px] md:rounded-[64px] border border-primary/5 bg-slate-50/30 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-6 md:space-y-8 text-lg md:text-2xl leading-relaxed font-medium text-foreground/80">
                <p>
                  Chaya Israel Foundation was established by Rabbi Avraham Kramer in 2004,
                  to alleviate poverty in Israel and to assist those who are truly in need. The
                  foundation provides essential food and assistance to hundreds of families
                  including orphans, widows, families in distress, soldiers and families of
                  wounded soldiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership - Circular Portraits */}
      <section className="py-20 md:py-40 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight luxury-gradient-text">About Us</h2>
            <div className="h-1.5 w-24 bg-accent mx-auto mt-6 rounded-full" />
            <p className="text-3xl md:text-5xl font-bold mt-8 tracking-tight text-slate-800">24 Years of Broad Chesed Activity</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 max-w-5xl mx-auto">
            {/* Rabbi Avraham Kramer */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative w-64 h-64 md:w-[380px] md:h-[380px] overflow-hidden rounded-full border-[6px] md:border-[10px] border-white shadow-2xl bg-white ring-4 md:ring-[10px] ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    priority
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-xl md:text-2xl font-black text-primary uppercase tracking-wider">Executive Director</p>
              </div>
            </div>
            
            {/* Dr. Shilo Kramer */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative w-64 h-64 md:w-[380px] md:h-[380px] overflow-hidden rounded-full border-[6px] md:border-[10px] border-white shadow-2xl bg-white ring-4 md:ring-[10px] ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    priority
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-xl md:text-2xl font-black text-primary uppercase tracking-wider">Co-director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner with Community Leaders */}
      <section className="py-20 md:py-40 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight luxury-gradient-text">Partner with Community Leaders</h2>
            <div className="max-w-4xl mx-auto mt-8 space-y-6">
              <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed tracking-tight opacity-95">
                The community leaders know the ins & outs of their congregations. They know better than anyone where the donations are needed most & where they can make the biggest impact.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
            <div className="glass-card p-10 md:p-14 rounded-[40px] md:rounded-[64px] border border-primary/5 shadow-xl bg-white space-y-8 flex flex-col group hover:border-accent/30">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="relative w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-full border-[3px] md:border-[5px] border-primary/10 shadow-lg shrink-0">
                  <Image src="/reuven-elbaz.png" alt="Rabbi Reuven Elbaz" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-bold text-sm md:text-base uppercase tracking-widest">Director of the Or Hachaim Organization</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 h-12 w-12 md:h-16 md:w-16 text-accent/10" />
                <div className="space-y-6 text-foreground/85 text-lg md:text-xl leading-relaxed relative z-10 font-medium italic">
                  <p>
                    "I am proud to testify on behalf of the Chaya Israel Foundation. The Foundation supports newlyweds, orphaned grooms and brides, widows and other disadvantaged members of the community. It's a great mitzva to support this organization so that it can continue to support those in need with even greater force and impact."
                  </p>
                  <p className="font-black text-foreground pt-2 tracking-tight not-italic">Rabbi Reuven Elbaz</p>
                </div>
              </div>
              <div className="pt-4 mt-auto">
                <Button size="lg" className="rounded-full w-full font-black h-20 md:h-24 text-xl md:text-3xl shadow-lg border-b-4 border-primary-foreground/20 bg-primary hover:bg-primary/90 tracking-tight" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>

            <div className="glass-card p-10 md:p-14 rounded-[40px] md:rounded-[64px] border border-primary/5 shadow-xl bg-white space-y-8 flex flex-col group hover:border-accent/30">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="relative w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-full border-[3px] md:border-[5px] border-primary/10 shadow-lg shrink-0">
                  <Image src="/Avichai Amosi.png" alt="Avichai Amosi" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">Avichai Amosi</h4>
                  <p className="text-primary font-bold text-sm md:text-base uppercase tracking-widest">Director of Merkaz Chesed Sderot</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 h-12 w-12 md:h-16 md:w-16 text-accent/10" />
                <div className="space-y-6 text-foreground/85 text-lg md:text-xl leading-relaxed relative z-10 font-medium italic">
                  <p>
                    "Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support! May G-d bless all those that have helped under-privileged communities with food & shelter and enable them to celebrate the Jewish Holidays as they were meant to be celebrated."
                  </p>
                  <p className="font-black text-foreground pt-2 tracking-tight not-italic">Avichai Amosi</p>
                </div>
              </div>
              <div className="pt-4 mt-auto">
                <Button size="lg" className="rounded-full w-full font-black h-20 md:h-24 text-xl md:text-3xl shadow-lg border-b-4 border-primary-foreground/20 bg-primary hover:bg-primary/90 tracking-tight" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Our Mission CTA */}
      <section className="py-24 md:py-48 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full -ml-48 -mb-48 blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10 space-y-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none drop-shadow-2xl">Support Our <br /> Mission</h2>
          <p className="text-xl md:text-3xl text-white/70 max-w-3xl mx-auto font-medium">Join us in making a real difference in the lives of those who need it most.</p>
          <Button size="lg" className="rounded-full px-12 md:px-24 h-20 md:h-28 text-2xl md:text-4xl font-black bg-primary text-white hover:bg-white hover:text-primary transition-all shadow-xl border-b-4 border-primary-foreground/20 tracking-tight" asChild>
            <Link href="/donate">Partner With Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
