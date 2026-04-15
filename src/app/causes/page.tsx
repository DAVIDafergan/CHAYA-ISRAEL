'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Shield, Flame, Package, Utensils, Gift, 
  Sparkles, ArrowRight, Info, CalendarDays, Star, Youtube, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

type Cause = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullContent: React.ReactNode;
  image: string;
  imageHint: string;
  color: string;
  donateUrl: string;
  isHoliday?: boolean;
};

function SpecialImageSwitcher({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-primary/10 shadow-2xl bg-slate-900">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={index}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image 
            src={images[index]} 
            fill 
            alt="Impact Gallery" 
            className="object-cover" 
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-2 rounded-full transition-all duration-500 ${i === index ? 'bg-white w-6' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

function DialogCard({ cause }: { cause: Cause }) {
  const isPriority = cause.id === 'idf';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer h-full" id={cause.id}>
          <div className="glass-card h-full rounded-[24px] md:rounded-[40px] overflow-hidden flex flex-col border border-primary/5 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-48 md:h-64 overflow-hidden">
              <Image 
                src={cause.image} 
                fill 
                alt={cause.title} 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                data-ai-hint={cause.imageHint}
                priority={isPriority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-full shadow-lg z-10">
                 {React.cloneElement(cause.icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
              </div>
            </div>
            <div className="p-6 md:p-10 flex flex-col flex-1 justify-between gap-4">
              <div>
                 <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight mb-2 break-words">{cause.title}</h3>
                 <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed opacity-85 line-clamp-3">
                   {cause.shortDesc}
                 </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-auto">
                 <span className="text-sm md:text-lg font-bold text-primary tracking-tight">View Details</span>
                 <div className="h-10 w-10 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight className="h-5 w-5" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] rounded-[32px] overflow-hidden p-0 gap-0 border-0 shadow-2xl bg-white z-[200]">
         <div className="relative h-48 md:h-72">
            <Image src={cause.image} fill alt={cause.title} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
               <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight mb-1">{cause.title}</h2>
               {cause.subtitle && <p className="text-xs md:text-lg font-medium opacity-80">{cause.subtitle}</p>}
            </div>
         </div>
         <div className="p-6 md:p-12 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="text-base md:text-lg leading-relaxed text-muted-foreground font-medium space-y-6">
              {cause.fullContent}
            </div>
            <div className="pt-8">
               <Button className="w-full h-14 md:h-20 rounded-full font-bold text-lg md:text-2xl shadow-xl border-b-4 border-primary-foreground/20" asChild>
                  <Link href={cause.donateUrl}>Donate Now</Link>
               </Button>
            </div>
         </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CausesPage() {
  const causes: Cause[] = [
    {
      id: "idf",
      title: "Support the IDF",
      subtitle: "Protecting The Homeland",
      icon: <Flame className="h-6 w-6" />,
      shortDesc: "Protecting The Homeland • Tactical Equipment • We Are One. Providing life-saving gear to the brave soldiers defending Israel.",
      color: "bg-blue-900",
      image: "/SOLIDER.png",
      imageHint: "idf soldier israel",
      donateUrl: "/donate?cause=IDF",
      fullContent: (
        <div className="space-y-8">
          <div className="text-center space-y-6">
             <h3 className="text-xl md:text-2xl font-black text-blue-900">Protecting The Homeland</h3>
             <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-100 max-w-full mx-auto">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/mQrWXrGfvmI" 
                  title="IDF Support 1" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
             </div>

             <h3 className="text-xl md:text-2xl font-black text-blue-900">Tactical Equipment</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                    <Image src="/IDF1.png" fill alt="IDF Tactical Gear 1" className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                    <Image src="/חיילים.png" fill alt="IDF Soldiers" className="object-cover" />
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      id: "widows",
      title: "Support Widows and Orphans",
      subtitle: "Providing Hope and Relief",
      icon: <Heart className="h-6 w-6" />,
      shortDesc: "Monthly support to families who lost their breadwinners in wars and terror attacks.",
      color: "bg-red-500",
      image: "/widows-support.webp",
      imageHint: "israel charity support",
      donateUrl: "/donate?cause=Widows%20and%20Orphans",
      fullContent: (
        <div className="space-y-6">
          <p className="font-bold text-lg md:text-xl text-primary">When life has you pinned against the wall, friends help you move forward.</p>
          <div className="space-y-4">
            <h3 className="font-bold text-red-600 text-xl md:text-2xl">Victims of Terror and War</h3>
            <p>We've found that families victimized by terror often suffer both financial and psychological struggles. We provide a safety net for those who have sacrificed everything.</p>
          </div>
        </div>
      )
    },
    {
      id: "hachnasat-kalah",
      title: "Hachnasat Kalah",
      subtitle: "Building New Jewish Homes",
      icon: <Sparkles className="h-6 w-6" />,
      shortDesc: "Helping newly-weds just starting their journey. Financial support for a dignified wedding and home.",
      color: "bg-primary",
      image: "/wedding.png",
      imageHint: "jewish wedding",
      donateUrl: "/donate?cause=Hachnasat%20Kalah",
      fullContent: (
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl font-bold text-primary">If Not Us, Whom?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <p>Financial matters can be tough for young couples starting out.</p>
                <p>We provide the essential baseline for young couples to start their lives with dignity.</p>
             </div>
             <SpecialImageSwitcher 
               images={[
                 "/hachnasat-kalah.png",
                 "/pexels-bride-1850126_1920.jpg",
                 "/wedding.png"
               ]} 
             />
          </div>
        </div>
      )
    },
    {
      id: "sderot",
      title: "Support South of Israel",
      subtitle: "Hope for Sderot",
      icon: <Shield className="h-6 w-6" />,
      shortDesc: "Supporting city residents facing constant rocket threats. Providing love and essential aid.",
      color: "bg-orange-500",
      image: "/הרס-מקסאם-בשכונת-הרכבות.jpg",
      imageHint: "sderot destruction",
      donateUrl: "/donate?cause=Sderot",
      fullContent: (
        <div className="space-y-6">
          <h3 className="font-bold text-orange-600 text-xl md:text-2xl">While Rockets Fly, We Send Love</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="order-2 md:order-1 space-y-4">
                <p>The city's residents have suffered for years from the threat of Qassam rockets.</p>
                <p className="font-black">Join us in providing hope for those protecting Israel's borders.</p>
             </div>
             <div className="order-1 md:order-2">
                <SpecialImageSwitcher 
                  images={[
                    "/הרס-מקסאם-בשכונת-הרכבות.jpg", 
                    "/-צבע-אדום-e1633425858580.jpg", 
                    "/SDEROT.png"
                  ]} 
                />
             </div>
          </div>
        </div>
      )
    },
    {
      id: "food-boxes",
      title: "Food Boxes & Warm Blankets",
      subtitle: "Essential Nourishment",
      icon: <Package className="h-6 w-6" />,
      shortDesc: "Providing nourishment and warmth to families in need. Each box feeds a family of five.",
      color: "bg-cyan-600",
      image: "/featured-image-7.jpg",
      imageHint: "charity packing",
      donateUrl: "/donate?cause=Food%20and%20Blankets",
      fullContent: (
        <div className="space-y-6">
          <h3 className="font-bold text-cyan-600 text-xl md:text-2xl">We Are One</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <p>Your donation provides food and blankets for cold winter nights.</p>
             </div>
             <SpecialImageSwitcher 
                images={[
                  "/featured-image-7.jpg",
                  "/Packing-Food-in-Netivot-4.jpg",
                  "/IMG-20201207-WA0002.jpg"
                ]} 
             />
          </div>
        </div>
      )
    }
  ];

  const regularCauses = causes.filter(c => !c.isHoliday);

  return (
    <div className="overflow-x-hidden pt-28 md:pt-40 bg-white min-h-screen">
      <section className="pb-10 md:pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black luxury-gradient-text tracking-tight leading-tight mb-4 break-words">
            Our Causes
          </h1>
          <p className="text-xs md:text-lg text-muted-foreground font-black tracking-[0.15em] opacity-70 uppercase">
            They Rely on Your Donation
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {regularCauses.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
            
            <Link href="/donate?cause=Other" className="group h-full">
              <div className="glass-card h-full rounded-[24px] md:rounded-[40px] overflow-hidden flex flex-col border border-dashed border-primary/30 bg-white hover:bg-primary/5 transition-all shadow-md">
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="h-14 w-14 md:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <Info className="h-6 w-6 md:h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-black tracking-tight">Other Causes</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed opacity-80">
                        Supporting disadvantaged communities all year long.
                      </p>
                    </div>
                 </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 bg-foreground text-white relative overflow-hidden px-4">
        <div className="container mx-auto text-center relative z-10 space-y-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight break-words">
            Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
          </h2>
          <Button size="lg" asChild className="rounded-full h-16 md:h-24 px-12 md:px-24 font-black bg-primary text-white shadow-xl text-xl md:text-3xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
