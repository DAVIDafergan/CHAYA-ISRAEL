'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Shield, Flame, Package, Utensils, Gift, 
  Sparkles, ArrowRight, Info, CalendarDays, Star, Youtube
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
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary/5 shadow-2xl bg-slate-900">
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${i === index ? 'bg-white w-4' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

function DialogCard({ cause }: { cause: Cause }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer h-full">
          <div className="glass-card h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col border border-primary/5 bg-white shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative h-28 md:h-48 overflow-hidden">
              <Image 
                src={cause.image} 
                fill 
                alt={cause.title} 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                data-ai-hint={cause.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 backdrop-blur-md p-1.5 md:p-2 rounded-full shadow-lg z-10">
                 {React.cloneElement(cause.icon as React.ReactElement, { className: "h-3 w-3 md:h-5 md:w-5 text-primary" })}
              </div>
            </div>
            <div className="p-3 md:p-6 flex flex-col flex-1 justify-between gap-2">
              <div>
                 <h3 className="text-[12px] md:text-lg font-bold tracking-tight leading-none mb-1 md:mb-2">{cause.title}</h3>
                 <p className="text-[9px] md:text-xs text-muted-foreground font-medium tracking-tight leading-tight line-clamp-2 md:line-clamp-none opacity-80">{cause.shortDesc}</p>
              </div>
              <div className="pt-1 md:pt-3 flex items-center justify-between border-t border-slate-100 mt-auto">
                 <span className="text-[10px] md:text-sm font-bold text-primary tracking-tight">View Details</span>
                 <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-[32px] overflow-hidden p-0 gap-0 border-0 shadow-2xl bg-white z-[200]">
         <div className="relative h-40 md:h-56">
            <Image src={cause.image} fill alt={cause.title} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
               <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-none mb-1">{cause.title}</h2>
               {cause.subtitle && <p className="text-[10px] md:text-sm font-medium tracking-tight text-white/80">{cause.subtitle}</p>}
            </div>
         </div>
         <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="text-[13px] md:text-base leading-relaxed text-muted-foreground font-medium">
              {cause.fullContent}
            </div>
            <div className="pt-6">
               <Button className="w-full h-12 md:h-14 rounded-full font-bold text-[14px] md:text-lg tracking-tight shadow-xl border-b-4 border-primary-foreground/20 hover:scale-[1.02] transition-all" asChild>
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
      id: "widows",
      title: "Support Widows and Orphans",
      subtitle: "Support Widows and Orphans",
      icon: <Heart className="h-5 w-5" />,
      shortDesc: "When life has you pinned against the wall, it is often the help from your friends that allows you to keep moving forward.",
      color: "bg-red-500",
      image: "/יתומים ואלמנות .webp",
      imageHint: "israel charity support",
      donateUrl: "/donate?cause=Widows%20and%20Orphans",
      fullContent: (
        <div className="space-y-4">
          <p className="font-bold text-base md:text-lg text-primary">When life has you pinned against the wall, it is often the help from your friends that allows you to keep moving forward.</p>
          <div className="space-y-3">
            <h3 className="font-bold text-red-600 text-lg md:text-xl tracking-tight">Focus on Victims of Terror Attacks and Wars</h3>
            <p>Over the years, we’ve found that a family victimized by terror often suffers both financial and psychological struggles. It’s hard to lose a loved one – and it’s also hard to lose a source of income. Many women and kids have joined the circle of widows and orphans that have sacrificed more than we know for this great country we call “The Homeland”.</p>
          </div>
        </div>
      )
    },
    {
      id: "hachnasat-kalah",
      title: "Hachnasat Kalah",
      subtitle: "If Not Us, Whom? And If Not Now, When?",
      icon: <Sparkles className="h-5 w-5" />,
      shortDesc: "If Not Us, Whom? And If Not Now, When? For newly-weds just starting off on their journey of marriage, financial matters can be tough and very challenging.",
      color: "bg-primary",
      image: "/hachnasat-kalah.png",
      imageHint: "jewish wedding",
      donateUrl: "/donate?cause=Hachnasat%20Kalah",
      fullContent: (
        <div className="space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-primary tracking-tight">If Not Us, Whom? And If Not Now, When?</h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-start">
             <div className="space-y-3 text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
                <p>For newly-weds just starting off on their journey of marriage, financial matters can be tough and very challenging.</p>
             </div>
             <div>
                <SpecialImageSwitcher 
                  images={[
                    "/hachnasat-kalah.png",
                    "/pexels-bride-1850126_1920.jpg",
                    "/הכנסת כלה2.png"
                  ]} 
                />
             </div>
          </div>
        </div>
      )
    },
    {
      id: "sderot",
      title: "Support South of Israel",
      subtitle: "While Rockets Flies, We send Love",
      icon: <Shield className="h-5 w-5" />,
      shortDesc: "The Chaya Israel branch in Sderot plays a significant role in the community. The city's residents have been suffering for years from the threat of Qassam rockets that impacts all aspects of life.",
      color: "bg-orange-500",
      image: "/הרס-מקסאם-בשכונת-הרכבות.jpg",
      imageHint: "sderot destruction",
      donateUrl: "/donate?cause=Sderot",
      fullContent: (
        <div className="space-y-6">
          <h3 className="font-bold text-orange-600 text-lg md:text-xl tracking-tight text-center">While Rockets Flies, We send Love</h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-start">
             <div className="order-2 md:order-1 space-y-3 text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
                <p>The Chaya Israel branch in Sderot plays a significant role in the community.</p>
                <p>The city's residents have been suffering for years from the threat of Qassam rockets that impacts all aspects of life.</p>
                <p className="text-foreground font-bold">Please join us in providing hope & support for the people that protect the borders of Israel with their lives.</p>
             </div>
             <div className="order-1 md:order-2">
                <SpecialImageSwitcher 
                  images={[
                    "/הרס-מקסאם-בשכונת-הרכבות.jpg", 
                    "/-צבע-אדום-e1633425858580.jpg", 
                    "/SDEROT.png", 
                    "/TIL.jpg"
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
      subtitle: "We Are One",
      icon: <Package className="h-5 w-5" />,
      shortDesc: "Providing nourishment and warmth to families in need across Israel.",
      color: "bg-cyan-600",
      image: "/featured-image-7.jpg",
      imageHint: "charity packing",
      donateUrl: "/donate?cause=Food%20and%20Blankets",
      fullContent: (
        <div className="space-y-8">
          <h3 className="font-bold text-cyan-600 text-lg md:text-xl text-center tracking-tight">We Are One</h3>
          
          <div className="grid md:grid-cols-2 gap-6 items-start">
             <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden shadow-xl border border-slate-100 relative group/video">
                   <iframe 
                     width="100%" 
                     height="100%" 
                     src="https://www.youtube.com/embed/f4wFdFLhtaU" 
                     title="Food and Blankets Support" 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                     allowFullScreen
                   ></iframe>
                </div>
             </div>
             
             <div className="space-y-3">
                <SpecialImageSwitcher 
                   images={[
                     "/1000_F_1742300809_eN16WzZ1qRS7mrQR0QRpxZVu31KCtd4F.jpg",
                     "/featured-image-7.jpg",
                     "/Packing-Food-in-Netivot-4.jpg",
                     "/IMG-20201207-WA0002.jpg"
                   ]} 
                />
             </div>
          </div>
        </div>
      )
    },
    {
      id: "idf",
      title: "Support the IDF",
      subtitle: "Protecting The Homeland",
      icon: <Flame className="h-5 w-5" />,
      shortDesc: "Protecting The Homeland • Tactical Equipment • We Are One",
      color: "bg-blue-900",
      image: "/חיילים.png",
      imageHint: "idf soldiers israel",
      donateUrl: "/donate?cause=IDF",
      fullContent: (
        <div className="space-y-8">
          <div className="text-center space-y-6">
             <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">Protecting The Homeland</h3>
             <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-100 relative group/video max-w-2xl mx-auto">
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

             <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">Tactical Equipment</h3>
             <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-100 max-w-2xl mx-auto">
                <Image src="/תמונה מלחמה.jpg" fill alt="IDF Tactical Gear" className="object-cover" />
             </div>

             <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">We Are One</h3>
             <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-100 relative group/video max-w-2xl mx-auto">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/PPx5hP7WX18" 
                  title="IDF Support 2" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
             </div>
          </div>

          <div className="text-center pt-4">
              <Link 
                href="https://www.youtube.com/@ChayaIsraelFoundation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold tracking-tight text-[10px] md:text-xs hover:underline"
              >
                For more videos <Youtube className="h-4 w-4" />
              </Link>
          </div>
        </div>
      )
    },
    {
      id: "rosh-hashanah-sukkot",
      title: "Rosh Hashanah & Sukkot",
      subtitle: "Teshuva, Tefila and Tzdakah",
      icon: <Star className="h-5 w-5" />,
      shortDesc: "Teshuva, Tefila and Tzdakah - High Holiday relief.",
      color: "bg-indigo-600",
      image: "/Screenshot 2026-02-19 11.13.10.png",
      imageHint: "rosh hashanah",
      donateUrl: "/donate?cause=Rosh%20Hashanah%20and%20Sukkot",
      isHoliday: true,
      fullContent: (
        <div className="space-y-3">
          <h3 className="font-bold text-indigo-600 text-lg md:text-xl tracking-tight">Teshuva, Tefila and Tzdakah</h3>
          <p className="font-medium text-foreground leading-relaxed">We will soon be begging Hashem, pleading for a Shana Tovah for ourselves and for our families and I am sure that this Mitzva of tzedakah will stand for us all on the upcoming days of Judgement. Please open your heart generously and assist us in bringing joy and relief to our fellow Jews who rely on our help.</p>
        </div>
      )
    },
    {
      id: "purim",
      title: "Purim",
      subtitle: "Matanot Laevyonim",
      icon: <Utensils className="h-5 w-5" />,
      shortDesc: "Matanot Laevyonim - Gifts to the poor.",
      color: "bg-yellow-500",
      image: "/Gemini_Generated_Image_cxdvzjcxdvzjcxdv.png",
      imageHint: "purim celebration",
      donateUrl: "/donate?cause=Purim",
      isHoliday: true,
      fullContent: (
        <div className="space-y-3">
          <h3 className="font-bold text-yellow-600 text-lg md:text-xl tracking-tight">Matanot Laevyonim</h3>
          <p className="text-sm md:text-base leading-relaxed">As in past years, we will be distributing מתנות לאביונים, gifts to the poor, on Purim day. Please give generously so we can keep doing our holy work and speed up the ultimate Geulah.</p>
        </div>
      )
    },
    {
      id: "pesach",
      title: "Pesach",
      subtitle: "Maot Chitim",
      icon: <Gift className="h-5 w-5" />,
      shortDesc: "Maot Chitim - Support for Pesach.",
      color: "bg-blue-500",
      image: "/Screenshot 2026-02-19 11.12.50.png",
      imageHint: "pesach seder",
      donateUrl: "/donate?cause=Pesach",
      isHoliday: true,
      fullContent: (
        <div className="space-y-3">
          <h3 className="font-bold text-blue-600 text-lg md:text-xl tracking-tight">Maot Chitim</h3>
          <p className="text-sm md:text-base leading-relaxed">Please appoint us as your Shaliach for this most important Mitzvah of Maot Chitim. As you are likely aware, the need is great, especially during the seven days of Pesach, when people's expenses are doubled compared to other holidays. We will also be assisting the widows and orphans of our brave brethren HY”D who sacrificed their lives since Simchas Torah so that we can continue to live as proud Jews in Eretz Yisrael and abroad.</p>
        </div>
      )
    }
  ];

  const regularCauses = causes.filter(c => !c.isHoliday);
  const holidayCauses = causes.filter(c => c.isHoliday);

  return (
    <div className="overflow-x-hidden pt-28 md:pt-36 bg-white min-h-screen">
      <section className="pb-8 md:pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold luxury-gradient-text tracking-tight leading-none mb-3">
            Our Causes
          </h1>
          <p className="text-[10px] md:text-base text-muted-foreground font-medium tracking-[0.15em] opacity-70">
            They Rely on Your Donation
          </p>
        </div>
      </section>

      <section className="pb-10 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {regularCauses.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
             <div className="inline-block bg-primary/10 p-2 rounded-full mb-1">
                <CalendarDays className="h-5 w-5 text-primary" />
             </div>
             <h2 className="text-2xl md:text-4xl font-bold tracking-tight luxury-gradient-text leading-none">
                High Holidays Donations
             </h2>
             <div className="max-w-2xl mx-auto space-y-4">
               <p className="text-[11px] md:text-base text-muted-foreground font-medium leading-relaxed tracking-tight">
                  There are many who have lost their sources of income, many orphans and widows, and many unprivileged families, and as the High Holidays draw near, we must help them celebrate in a dignified manner.
               </p>
               <p className="text-[11px] md:text-base text-primary font-bold leading-tight tracking-tight">
                  Your contribution enables families to respectfully purchase food and other necessities for the Yom Tov.
               </p>
               <p className="text-[10px] md:text-sm font-bold tracking-tight text-foreground">
                  Please help those that can't manage on their own.
               </p>
             </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {holidayCauses.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
            
            <Link href="/donate?cause=Other" className="group h-full">
              <div className="glass-card h-full rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col border border-dashed border-primary/30 bg-white hover:bg-primary/5 transition-all shadow-xl">
                 <div className="flex-1 flex flex-col items-center justify-center p-5 text-center space-y-3">
                    <div className="h-10 w-10 md:h-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <Info className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[11px] md:text-lg font-bold tracking-tight">Other Causes</h3>
                      <p className="text-[7px] md:text-xs text-muted-foreground font-medium tracking-tight leading-tight opacity-70 max-w-[150px] md:max-w-xs mx-auto">
                        Providing Basic Necessities Enables Us to Enliven Disadvantaged Communities All Year Long.
                      </p>
                    </div>
                    <div className="pt-1">
                      <span className="text-[8px] md:text-xs font-bold text-primary underline decoration-primary/20 underline-offset-4 tracking-tight">Please describe your donation</span>
                    </div>
                 </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
