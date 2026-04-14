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
        
        <div className="container mx-auto px-6 pt-10 pb-20 md:pt-12 md:pb-24 text-center flex flex-col items-center">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-none mb-14 drop-shadow-sm">
            Chaya <span className="text-primary">Israel</span>
          </h1>
          
          <div className="space-y-12 md:space-y-16 w-full max-w-5xl">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <Button size="lg" asChild className="h-24 md:h-28 px-14 md:px-32 rounded-full font-black bg-primary text-white shadow-2xl text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-110 transition-all duration-500">
                <Link href="/donate" className="flex items-center gap-4">
                  Donate now <ArrowRight className="h-10 w-10 md:h-12 md:w-12" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-24 md:h-28 px-14 md:px-32 rounded-full font-black border-4 border-primary/20 text-primary text-2xl md:text-4xl hover:bg-primary/5 transition-all duration-500" asChild>
                <Link href="/causes">Our causes</Link>
              </Button>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                variant="outline" 
                asChild 
                className="h-28 md:h-32 px-12 md:px-20 rounded-[4rem] border-4 border-primary/10 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:shadow-glow-blue hover:border-primary/40 hover:scale-105 transition-all duration-500 group"
              >
                <Link href={user ? "/account" : "/login"} className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-4 text-slate-900 group-hover:text-primary transition-all duration-500">
                    <User className="h-8 w-8 md:h-10 md:w-10 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl md:text-4xl font-black tracking-tight uppercase">Donor Portal</span>
                  </div>
                  <span className="text-sm md:text-lg font-bold text-muted-foreground uppercase tracking-widest opacity-60 group-hover:text-primary/70 group-hover:opacity-100 transition-all">
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
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 md:mb-36">
            <h2 className="text-6xl md:text-8xl font-black tracking-tight luxury-gradient-text mb-10">About Us</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 max-w-5xl mx-auto leading-tight">
              24 Years of Broad Chesed Activity
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-20 md:gap-40 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-10">
              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] overflow-hidden rounded-full border-[8px] md:border-[15px] border-white shadow-2xl bg-white ring-4 md:ring-[15px] ring-primary/5 group">
                <Image 
                    src="/AVRHAMKRAMER.png" 
                    alt="Rabbi Avraham Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Rabbi Avraham Kramer</h3>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-primary uppercase">Executive director</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-10">
              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] overflow-hidden rounded-full border-[8px] md:border-[15px] border-white shadow-2xl bg-white ring-4 md:ring-[15px] ring-primary/5 group">
                <Image 
                    src="/SHILO.jpg" 
                    alt="Dr. Shilo Kramer" 
                    fill 
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Dr. Shilo Kramer</h3>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-primary uppercase">Co-director</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-24 md:mt-40">
            <Button variant="outline" className="rounded-full h-24 md:h-28 px-20 md:px-36 font-black border-4 border-primary/20 text-primary hover:bg-primary/5 text-2xl md:text-4xl transition-all shadow-sm" asChild>
              <Link href="/mission">About us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partner with Community Leaders Section */}
      <section className="py-24 md:py-48 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 md:mb-36">
            <h2 className="text-6xl md:text-8xl font-black tracking-tight luxury-gradient-text mb-10">Partner with community leaders</h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-2xl md:text-3xl text-foreground font-bold leading-relaxed tracking-tight opacity-90">
                Community leaders know the needs of their congregations best. They ensure your donations make the biggest possible impact where it is needed most.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 max-w-7xl mx-auto">
            <div className="glass-card p-12 md:p-20 rounded-[56px] md:rounded-[80px] border-2 border-primary/5 shadow-2xl bg-white space-y-10 flex flex-col group hover:border-accent/30 transition-all duration-700">
              <div className="flex items-center gap-10">
                <div className="relative w-28 h-28 md:w-40 md:h-40 overflow-hidden rounded-full border-[6px] md:border-[10px] border-primary/10 shadow-xl shrink-0">
                  <Image src="/reuven-elbaz.png" alt="Rabbi Reuven Elbaz" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">Rabbi Reuven Elbaz</h4>
                  <p className="text-primary font-black text-lg md:text-2xl tracking-tight opacity-80">Director of the Or Hachaim organization</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-10 -left-10 h-16 w-16 md:h-24 md:w-24 text-accent/10" />
                <p className="text-foreground/80 text-xl md:text-3xl leading-relaxed relative z-10 font-bold italic">
                  I am proud to testify on behalf of the Chaya Israel Foundation. The foundation supports newlyweds, orphaned grooms and brides, widows and other disadvantaged members of the community. It's a great mitzva to support this important organization.
                </p>
              </div>
              <div className="pt-10 mt-auto">
                 <h5 className="font-black text-foreground text-2xl md:text-4xl mb-12">Rabbi Reuven Elbaz</h5>
                 <Button size="lg" asChild className="rounded-full h-24 md:h-28 w-full font-black bg-primary text-white shadow-glow-blue text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>

            <div className="glass-card p-12 md:p-20 rounded-[56px] md:rounded-[80px] border-2 border-primary/5 shadow-2xl bg-white space-y-10 flex flex-col group hover:border-accent/30 transition-all duration-700">
              <div className="flex items-center gap-10">
                <div className="relative w-28 h-28 md:w-40 md:h-40 overflow-hidden rounded-full border-[6px] md:border-[10px] border-primary/10 shadow-xl shrink-0">
                  <Image src="/Avichai Amosi.png" alt="Avichai Amosi" fill className="object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">Avichai Amosi</h4>
                  <p className="text-primary font-black text-lg md:text-2xl tracking-tight opacity-80">Director of Merkaz Chesed Sderot</p>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-10 -left-10 h-16 w-16 md:h-24 md:w-24 text-accent/10" />
                <p className="text-foreground/80 text-xl md:text-3xl leading-relaxed relative z-10 font-bold italic">
                  Chaya Israel Foundation has been steadily providing meals for the Sderot community for over two decades. We can't thank them enough for their support! May G-d bless all those that have helped under-privileged communities.
                </p>
              </div>
              <div className="pt-10 mt-auto">
                 <h5 className="font-black text-foreground text-2xl md:text-4xl mb-12">Avichai Amosi</h5>
                 <Button size="lg" asChild className="rounded-full h-24 md:h-28 w-full font-black bg-primary text-white shadow-glow-blue text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
                    <Link href="/donate">Donate now</Link>
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area Call-to-Action */}
      <section className="py-32 md:py-60 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full -mr-96 -mt-96 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/20 rounded-full -ml-96 -mb-96 blur-[150px]" />
        <div className="container mx-auto px-6 text-center relative z-10 space-y-20 md:space-y-32">
          <div className="space-y-12">
            <h2 className="text-6xl md:text-9xl font-black tracking-tight leading-none drop-shadow-2xl">
              Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
            </h2>
            <p className="text-3xl md:text-5xl text-white/70 max-w-6xl mx-auto font-bold leading-tight">
              Allow us to serve as your messenger by distributing charity to those in Israel who are most in need.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <Button size="lg" asChild className="rounded-full h-28 md:h-36 px-16 md:px-40 font-black bg-primary text-white shadow-2xl text-3xl md:text-5xl border-b-4 border-primary-foreground/20 hover:scale-110 transition-all duration-500">
              <Link href="/donate">Donate now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full h-28 md:h-36 px-16 md:px-40 font-black bg-white/5 border-4 border-white/25 text-white text-3xl md:text-5xl hover:bg-white/15 transition-all duration-500">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}