'use client';

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="overflow-x-hidden pt-32 md:pt-40 bg-white min-h-screen">
      {/* Header Section */}
      <section className="pb-10 md:pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black luxury-gradient-text mb-2 tracking-tight leading-none">
            About Us
          </h1>
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground/70 tracking-tight">
            Our Mission
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-[28px] md:rounded-[48px] border border-primary/5 bg-slate-50/30 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12" />
              <div className="relative z-10 space-y-4 md:space-y-6 text-base md:text-xl leading-relaxed font-medium text-foreground/80">
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
      <section className="py-12 md:py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight luxury-gradient-text">About Us</h2>
            <div className="h-1 w-16 bg-accent mx-auto mt-3 rounded-full" />
            <p className="text-2xl md:text-3xl font-bold mt-4 tracking-tight text-slate-800">24 Years of Broad Chesed Activity</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-4xl mx-auto">
            {/* Rabbi Avraham Kramer */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-56 h-56 md:w-[320px] md:h-[320px] overflow-hidden rounded-full border-[4px] md:border-[8px] border-white shadow-2xl bg-white ring-3 md:ring-[6px] ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    priority
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl md:text-2xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-base md:text-base font-bold text-primary">Executive Director</p>
              </div>
            </div>
            
            {/* Dr. Shilo Kramer */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-56 h-56 md:w-[320px] md:h-[320px] overflow-hidden rounded-full border-[4px] md:border-[8px] border-white shadow-2xl bg-white ring-3 md:ring-[6px] ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    priority
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl md:text-2xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-base md:text-base font-bold text-primary">Co-director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner with Community Leaders */}
      <section className="py-12 md:py-24 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight luxury-gradient-text">Partner with Community Leaders</h2>
            <div className="max-w-3xl mx-auto mt-4 space-y-3">
              <p className="text-base md:text-lg text-foreground font-medium leading-relaxed tracking-tight opacity-90">
                The community leaders know the ins & outs of their congregations. They know better than anyone where the donations are needed most & where they can make the biggest impact.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto">
            <div className="glass-card p-8 md:p-10 rounded-[28px] md:rounded-[40px] border border-primary/5 shadow-xl bg-white space-y-5 flex flex-col group hover:border-accent/30">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-full border-[2px] md:border-[4px] border-primary/10 shadow-lg shrink-0">
                  <Image src="/reuven-elbaz.png" alt="Rabbi Reuven Elbaz" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-black text-foreground leading-tight tracking-tight">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-bold text-xs md:text-xs">Director of the Or Hachaim Organization</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 md:h-10 md:w-10 text-accent/10" />
                <div className="space-y-3 text-foreground/80 text-sm md:text-base leading-relaxed relative z-10 font-medium">
                  <p>
                    "I am proud to testify on behalf of the Chaya Israel Foundation. The Foundation supports newlyweds, orphaned grooms and brides, widows and other disadvantaged members of the community. It's a great mitzva to support this organization so that it can continue to support those in need with even greater force and impact. May all those that support and help the Foundation be blessed by G-d with abundance, blessings, success, and all the good things. Amen"
                  </p>
                  <p className="font-black text-foreground pt-1 tracking-tight">Rabbi Reuven Elbaz</p>
                </div>
              </div>
              <div className="pt-2 mt-auto">
                <Button size="lg" className="rounded-full w-full font-black h-14 md:h-14 text-base md:text-lg shadow-lg border-b-4 border-primary-foreground/20 bg-primary hover:bg-primary/90 tracking-tight" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-[28px] md:rounded-[40px] border border-primary/5 shadow-xl bg-white space-y-5 flex flex-col group hover:border-accent/30">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-full border-[2px] md:border-[4px] border-primary/10 shadow-lg shrink-0">
                  <Image src="/Avichai%20Amosi.png" alt="Avichai Amosi" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-black text-foreground leading-tight tracking-tight">Avichai Amosi</h4>
                  <p className="text-primary font-bold text-xs md:text-xs">Director of Merkaz Chesed Sderot</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 md:h-10 md:w-10 text-accent/10" />
                <div className="space-y-3 text-foreground/80 text-sm md:text-base leading-relaxed relative z-10 font-medium">
                  <p>
                    "Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support! May G-d bless all those that have helped under-privileged communities with food & shelter and enable them to celebrate the Jewish Holidays as they were meant to be celebrated."
                  </p>
                </div>
              </div>
              <div className="pt-2 mt-auto">
                <Button size="lg" className="rounded-full w-full font-black h-14 md:h-14 text-base md:text-lg shadow-lg border-b-4 border-primary-foreground/20 bg-primary hover:bg-primary/90 tracking-tight" asChild>
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Our Mission CTA */}
      <section className="py-16 md:py-32 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full -ml-40 -mb-40 blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-2xl">Support Our <br /> Mission</h2>
          <p className="text-base md:text-xl text-white/60 max-w-xl mx-auto font-medium">Join us in making a real difference in the lives of those who need it most.</p>
          <Button size="lg" className="rounded-full px-10 md:px-20 h-14 md:h-16 text-base md:text-xl font-black bg-primary text-white hover:bg-white hover:text-primary transition-all shadow-xl border-b-4 border-primary-foreground/20 tracking-tight" asChild>
            <Link href="/donate">Partner With Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
