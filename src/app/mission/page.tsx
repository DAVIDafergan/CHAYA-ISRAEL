'use client';

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="overflow-x-hidden pt-28 md:pt-48 bg-white min-h-screen">
      {/* Header Section */}
      <section className="pb-10 md:pb-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black luxury-gradient-text mb-4 tracking-tight leading-tight break-words">
            About Us
          </h1>
          <h2 className="text-xl md:text-3xl font-bold mb-8 md:mb-12 text-foreground/70 tracking-tight">
            Our Mission
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-16 rounded-[32px] md:rounded-[64px] border border-primary/5 bg-slate-50/30 shadow-xl relative overflow-hidden">
              <div className="relative z-10 text-base md:text-2xl leading-relaxed font-medium text-foreground/80 space-y-6">
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

      {/* Leadership Section */}
      <section className="py-16 md:py-32 bg-slate-50/50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight luxury-gradient-text">Our Leadership</h2>
            <div className="h-1.5 w-20 bg-accent mx-auto mt-4 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <div className="relative w-48 h-48 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-xl ring-4 ring-primary/5">
                <Image src="/AVRHAMKRAMER.png" alt="Rabbi Avraham Kramer" fill className="object-cover object-top" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">Rabbi Avraham Kramer</h3>
                <p className="text-base md:text-xl font-black text-primary uppercase tracking-wider">Executive Director</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <div className="relative w-48 h-48 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] overflow-hidden rounded-full border-4 md:border-8 border-white shadow-xl ring-4 ring-primary/5">
                <Image src="/SHILO.jpg" alt="Dr. Shilo Kramer" fill className="object-cover object-top" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">Dr. Shilo Kramer</h3>
                <p className="text-base md:text-xl font-black text-primary uppercase tracking-wider">Co-director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight luxury-gradient-text leading-tight break-words">Community Partners</h2>
            <p className="max-w-3xl mx-auto mt-4 text-base md:text-xl text-foreground/80 font-medium leading-relaxed">
              We partner with local leaders who know their communities best, ensuring every donation reaches those in greatest need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-primary/5 shadow-xl bg-white space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 md:w-24 md:h-24 overflow-hidden rounded-full border-2 border-primary/10 shrink-0">
                  <Image src="/reuven-elbaz.png" alt="Rabbi Reuven Elbaz" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black text-foreground">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-wider">Or Hachaim Organization</p>
                </div>
              </div>
              <p className="text-foreground/80 text-base md:text-lg italic font-medium leading-relaxed">
                "I am proud to testify on behalf of the Chaya Israel Foundation. It's a great mitzva to support this organization so that it can continue to support those in need."
              </p>
            </div>

            <div className="glass-card p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-primary/5 shadow-xl bg-white space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 md:w-24 md:h-24 overflow-hidden rounded-full border-2 border-primary/10 shrink-0">
                  <Image src="/Avichai Amosi.png" alt="Avichai Amosi" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black text-foreground">Avichai Amosi</h4>
                  <p className="text-primary font-black text-xs md:text-sm uppercase tracking-wider">Merkaz Chesed Sderot</p>
                </div>
              </div>
              <p className="text-foreground/80 text-base md:text-lg italic font-medium leading-relaxed">
                "Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 bg-foreground text-white relative overflow-hidden px-4">
        <div className="container mx-auto text-center relative z-10 space-y-8 md:space-y-12">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight break-words">Support Our Mission</h2>
          <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">Join us in making a real difference in the lives of those who need it most.</p>
          <Button size="lg" className="rounded-full px-12 md:px-24 h-16 md:h-24 text-xl md:text-3xl font-black bg-primary text-white hover:scale-105 transition-all border-b-4 border-primary-foreground/20" asChild>
            <Link href="/donate">Partner With Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
