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
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
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
            className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${i === index ? 'bg-white w-6' : 'bg-white/40'}`}
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
          <div className="glass-card h-full rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col border border-primary/5 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2">
            <div className="relative h-56 md:h-72 overflow-hidden">
              <Image 
                src={cause.image} 
                fill 
                alt={cause.title} 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                data-ai-hint={cause.imageHint}
                priority={isPriority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl z-10">
                 {React.cloneElement(cause.icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col flex-1 justify-between gap-6">
              <div className="space-y-3">
                 <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight break-words hyphens-auto">{cause.title}</h3>
                 <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed opacity-85 line-clamp-3">
                   {cause.shortDesc}
                 </p>
              </div>
              <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-auto">
                 <span className="text-lg md:text-xl font-black text-primary tracking-tight">View Details</span>
                 <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="h-6 w-6" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] rounded-[48px] overflow-hidden p-0 gap-0 border-0 shadow-2xl bg-white z-[200]">
         <div className="relative h-64 md:h-96">
            <Image src={cause.image} fill alt={cause.title} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
               <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2 break-words hyphens-auto">{cause.title}</h2>
               {cause.subtitle && <p className="text-lg md:text-2xl font-bold opacity-80">{cause.subtitle}</p>}
            </div>
         </div>
         <div className="p-8 md:p-16 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="text-lg md:text-2xl leading-relaxed text-muted-foreground font-medium space-y-8">
              {cause.fullContent}
            </div>
            <div className="pt-12">
               <Button className="w-full h-18 md:h-24 rounded-full font-black text-xl md:text-3xl shadow-xl border-b-4 border-primary-foreground/20" asChild>
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
      shortDesc: "Providing life-saving tactical gear and essential equipment to the brave soldiers defending Israel's borders.",
      color: "bg-blue-900",
      image: "/SOLIDER.png",
      imageHint: "idf soldier israel",
      donateUrl: "/donate?cause=IDF",
      fullContent: (
        <div className="space-y-10">
          <div className="text-center space-y-8">
             <h3 className="text-2xl md:text-4xl font-black text-blue-900">Protecting The Homeland</h3>
             <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-full mx-auto">
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

             <h3 className="text-2xl md:text-4xl font-black text-blue-900">Tactical Equipment</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <Image src="/IDF1.png" fill alt="IDF Tactical Gear 1" className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                    <Image src="/חיילים.png" fill alt="IDF Soldiers" className="object-cover" />
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      id: "holidays",
      title: "Holiday Support",
      subtitle: "Passover & High Holidays",
      icon: <CalendarDays className="h-6 w-6" />,
      shortDesc: "Ensuring every family in Israel can celebrate with dignity. Providing holiday meals and essentials.",
      color: "bg-amber-500",
      image: "/IMG-20201207-WA0002.jpg",
      imageHint: "passover meal charity",
      donateUrl: "/donate?cause=Holidays",
      isHoliday: true,
      fullContent: (
        <div className="space-y-8">
           <h3 className="text-2xl md:text-4xl font-black text-amber-600">No One Left Behind</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                 <p>Before every major holiday like Passover, Rosh Hashanah, and Succot, Chaya Israel distributes massive food parcels to thousands of needy families.</p>
                 <p className="font-black text-foreground">Your donation ensures a holiday of joy instead of hunger.</p>
              </div>
              <SpecialImageSwitcher 
                images={[
                  "/IMG-20201207-WA0002.jpg",
                  "/featured-image-7.jpg",
                  "/Packing-Food-in-Netivot-4.jpg"
                ]} 
              />
           </div>
        </div>
      )
    },
    {
      id: "widows",
      title: "Widows and Orphans",
      subtitle: "A Lifeline of Hope",
      icon: <Heart className="h-6 w-6" />,
      shortDesc: "Providing direct monthly financial and emotional support to families who have lost their breadwinners.",
      color: "bg-red-500",
      image: "/widows-support.webp",
      imageHint: "israel charity widows",
      donateUrl: "/donate?cause=Widows%20and%20Orphans",
      fullContent: (
        <div className="space-y-8">
          <p className="font-black text-2xl md:text-3xl text-primary leading-tight">When life has you pinned against the wall, friends help you move forward.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <h3 className="font-black text-red-600 text-2xl md:text-3xl">Direct Aid</h3>
                <p>We provide a safety net for families victimized by terror and war. Our support covers rent, utilities, and therapeutic needs to help them rebuild their lives.</p>
             </div>
             <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg">
                <Image src="/widows-support.webp" fill alt="Support for widows" className="object-cover" />
             </div>
          </div>
        </div>
      )
    },
    {
      id: "hachnasat-kalah",
      title: "Hachnasat Kalah",
      subtitle: "Building Jewish Homes",
      icon: <Sparkles className="h-6 w-6" />,
      shortDesc: "Helping orphaned or underprivileged couples start their lives together with dignity and joy.",
      color: "bg-pink-500",
      image: "/wedding.png",
      imageHint: "jewish wedding",
      donateUrl: "/donate?cause=Hachnasat%20Kalah",
      fullContent: (
        <div className="space-y-10">
          <h3 className="text-2xl md:text-4xl font-black text-primary text-center">Building The Future</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
                <p>The cost of establishing a home can be overwhelming. We provide basic furniture, appliances, and wedding assistance to ensure no couple is held back by poverty.</p>
                <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 italic">
                   "Your support wasn't just money, it was the message that we are not alone."
                </div>
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
      title: "Support for Sderot",
      subtitle: "Resilience on the Frontline",
      icon: <Shield className="h-6 w-6" />,
      shortDesc: "Supporting residents of Sderot facing constant rocket threats with essential aid and trauma relief.",
      color: "bg-orange-500",
      image: "/SDEROT.png",
      imageHint: "sderot israel support",
      donateUrl: "/donate?cause=Sderot",
      fullContent: (
        <div className="space-y-10">
          <h3 className="font-black text-orange-600 text-2xl md:text-4xl">While Rockets Fly, We Send Love</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="order-2 md:order-1 space-y-6">
                <p>The residents of Sderot have been on the front lines for decades. We partner with the local Chesed Center to provide emergency food, bomb shelter repairs, and psychological support.</p>
                <p className="font-black text-xl">Join us in standing with the people of the South.</p>
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
      title: "Food & Warmth",
      subtitle: "Basic Needs, Maximum Impact",
      icon: <Package className="h-6 w-6" />,
      shortDesc: "Monthly distribution of food boxes and winter blankets to the most vulnerable communities in Israel.",
      color: "bg-cyan-600",
      image: "/featured-image-7.jpg",
      imageHint: "charity food box",
      donateUrl: "/donate?cause=Food%20and%20Blankets",
      fullContent: (
        <div className="space-y-10">
          <h3 className="font-black text-cyan-600 text-2xl md:text-4xl text-center">Small Acts, Big Changes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
                <p>A simple box of food or a warm blanket can be the difference between despair and hope. We focus on direct distribution to ensure 100% of your impact reaches the family's table.</p>
                <div className="bg-cyan-50 p-8 rounded-[32px] border border-cyan-100 flex items-center gap-4">
                   <Package className="h-10 w-10 text-cyan-600" />
                   <p className="font-black text-cyan-900">$180 feeds a family for a whole month.</p>
                </div>
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

  return (
    <div className="overflow-x-hidden pt-32 md:pt-48 bg-white min-h-screen">
      <section className="pb-16 md:pb-24 px-6">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black luxury-gradient-text tracking-tight leading-tight mb-6 break-words hyphens-auto">
            Our Causes
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground font-black tracking-[0.15em] opacity-70 uppercase">
            They Rely on Your Donation
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {causes.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
            
            <Link href="/donate?cause=Other" className="group h-full">
              <div className="glass-card h-full rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col border border-dashed border-primary/30 bg-white hover:bg-primary/5 transition-all shadow-md">
                 <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <Info className="h-10 w-10 md:h-12" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight break-words">Other Causes</h3>
                      <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed opacity-80">
                        Supporting disadvantaged communities and emergency needs all year long.
                      </p>
                    </div>
                 </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-48 bg-foreground text-white relative overflow-hidden px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[120px]" />
        <div className="container mx-auto text-center relative z-10 space-y-12">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight break-words hyphens-auto px-4">
            Please help us give life to those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
          </h2>
          <div className="pt-6">
            <Button size="lg" asChild className="rounded-full h-20 md:h-28 px-16 md:px-32 font-black bg-primary text-white shadow-2xl text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-105 transition-all">
              <Link href="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
