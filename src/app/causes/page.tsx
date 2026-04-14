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
          <div className="glass-card h-full rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col border border-primary/5 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2">
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
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-lg z-10">
                 {React.cloneElement(cause.icon as React.ReactElement, { className: "h-6 w-6 text-primary" })}
              </div>
            </div>
            <div className="p-6 md:p-10 flex flex-col flex-1 justify-between gap-6">
              <div>
                 <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight mb-3">{cause.title}</h3>
                 <p className="text-sm md:text-base text-muted-foreground font-medium tracking-tight leading-relaxed line-clamp-4 md:line-clamp-none opacity-85">{cause.shortDesc}</p>
              </div>
              <div className="pt-4 md:pt-6 flex items-center justify-between border-t border-slate-100 mt-auto">
                 <span className="text-base md:text-lg font-bold text-primary tracking-tight">View Details</span>
                 <div className="h-10 w-10 md:h-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="h-6 w-6" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] rounded-[40px] overflow-hidden p-0 gap-0 border-0 shadow-2xl bg-white z-[200]">
         <div className="relative h-56 md:h-72">
            <Image src={cause.image} fill alt={cause.title} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-8 right-8 text-white">
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-none mb-2">{cause.title}</h2>
               {cause.subtitle && <p className="text-sm md:text-lg font-medium tracking-tight text-white/80">{cause.subtitle}</p>}
            </div>
         </div>
         <div className="p-8 md:p-12 max-h-[65vh] overflow-y-auto custom-scrollbar">
            <div className="text-base md:text-xl leading-relaxed text-muted-foreground font-medium">
              {cause.fullContent}
            </div>
            <div className="pt-8">
               <Button className="w-full h-16 md:h-20 rounded-full font-bold text-lg md:text-2xl tracking-tight shadow-xl border-b-4 border-primary-foreground/20 hover:scale-[1.02] transition-all" asChild>
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
      shortDesc: "Protecting The Homeland • Tactical Equipment • We Are One. Providing life-saving gear and support to the brave soldiers defending the borders of Israel.",
      color: "bg-blue-900",
      image: "/SOLIDER.png",
      imageHint: "idf soldier israel",
      donateUrl: "/donate?cause=IDF",
      fullContent: (
        <div className="space-y-10">
          <div className="text-center space-y-8">
             <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">Protecting The Homeland</h3>
             <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative group/video max-w-3xl mx-auto">
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

             <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">Tactical Equipment</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                    <Image 
                      src="/IDF1.png" 
                      fill 
                      alt="IDF Tactical Gear 1" 
                      className="object-cover" 
                    />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                    <Image 
                      src="/חיילים.png" 
                      fill 
                      alt="IDF Soldiers" 
                      className="object-cover" 
                    />
                </div>
             </div>

             <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight">We Are One</h3>
             <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative group/video max-w-3xl mx-auto">
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

          <div className="text-center pt-6">
              <Link 
                href="https://www.youtube.com/@ChayaIsraelFoundation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-primary font-bold tracking-tight text-sm md:text-lg hover:underline"
              >
                For more videos <Youtube className="h-6 w-6" />
              </Link>
          </div>
        </div>
      )
    },
    {
      id: "widows",
      title: "Support Widows and Orphans",
      subtitle: "Support Widows and Orphans",
      icon: <Heart className="h-6 w-6" />,
      shortDesc: "When life has you pinned against the wall, it is often the help from your friends that allows you to keep moving forward. We provide monthly support to families who lost their breadwinners.",
      color: "bg-red-500",
      image: "/widows-support.webp",
      imageHint: "israel charity support",
      donateUrl: "/donate?cause=Widows%20and%20Orphans",
      fullContent: (
        <div className="space-y-6">
          <p className="font-bold text-xl md:text-2xl text-primary">When life has you pinned against the wall, it is often the help from your friends that allows you to keep moving forward.</p>
          <div className="space-y-4">
            <h3 className="font-bold text-red-600 text-2xl md:text-3xl tracking-tight">Focus on Victims of Terror Attacks and Wars</h3>
            <p>Over the years, we’ve found that a family victimized by terror often suffers both financial and psychological struggles. It’s hard to lose a loved one – and it’s also hard to lose a source of income. Many women and kids have joined the circle of widows and orphans that have sacrificed more than we know for this great country we call “The Homeland”.</p>
          </div>
        </div>
      )
    },
    {
      id: "hachnasat-kalah",
      title: "Hachnasat Kalah",
      subtitle: "If Not Us, Whom? And If Not Now, When?",
      icon: <Sparkles className="h-6 w-6" />,
      shortDesc: "If Not Us, Whom? And If Not Now, When? For newly-weds just starting off on their journey of marriage, financial matters can be tough and very challenging. We help build new Jewish homes.",
      color: "bg-primary",
      image: "/wedding.png",
      imageHint: "jewish wedding",
      donateUrl: "/donate?cause=Hachnasat%20Kalah",
      fullContent: (
        <div className="space-y-8">
          <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">If Not Us, Whom? And If Not Now, When?</h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
             <div className="space-y-4 text-base md:text-xl font-medium text-muted-foreground leading-relaxed">
                <p>For newly-weds just starting off on their journey of marriage, financial matters can be tough and very challenging.</p>
                <p>Our foundation steps in to provide the essential baseline for young couples, ensuring they can start their lives with dignity and joy.</p>
             </div>
             <div>
                <SpecialImageSwitcher 
                  images={[
                    "/hachnasat-kalah.png",
                    "/pexels-bride-1850126_1920.jpg",
                    "/wedding.png"
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
      icon: <Shield className="h-6 w-6" />,
      shortDesc: "The Chaya Israel branch in Sderot plays a significant role in the community. The city's residents have been suffering for years from the threat of Qassam rockets that impacts all aspects of life.",
      color: "bg-orange-500",
      image: "/הרס-מקסאם-בשכונת-הרכבות.jpg",
      imageHint: "sderot destruction",
      donateUrl: "/donate?cause=Sderot",
      fullContent: (
        <div className="space-y-8">
          <h3 className="font-bold text-orange-600 text-2xl md:text-3xl tracking-tight text-center">While Rockets Flies, We send Love</h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
             <div className="order-2 md:order-1 space-y-4 text-base md:text-xl font-medium text-muted-foreground leading-relaxed">
                <p>The Chaya Israel branch in Sderot plays a significant role in the community.</p>
                <p>The city's residents have been suffering for years from the threat of Qassam rockets that impacts all aspects of life.</p>
                <p className="text-foreground font-black">Please join us in providing hope & support for the people that protect the borders of Israel with their lives.</p>
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
      icon: <Package className="h-6 w-6" />,
      shortDesc: "Providing nourishment and warmth to families in need across Israel. Each box contains essential food items and supplies for a family of five.",
      color: "bg-cyan-600",
      image: "/featured-image-7.jpg",
      imageHint: "charity packing",
      donateUrl: "/donate?cause=Food%20and%20Blankets",
      fullContent: (
        <div className="space-y-10">
          <h3 className="font-bold text-cyan-600 text-2xl md:text-3xl text-center tracking-tight">We Are One</h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
             <div className="space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-100 relative group/video">
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
                <p className="text-base md:text-lg font-medium">Your donation provides full food boxes and blankets for cold winter nights to hundreds of families across Israel.</p>
             </div>
             
             <div className="space-y-4">
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
      id: "rosh-hashanah-sukkot",
      title: "Rosh Hashanah & Sukkot",
      subtitle: "Teshuva, Tefila and Tzdakah",
      icon: <Star className="h-6 w-6" />,
      shortDesc: "Teshuva, Tefila and Tzdakah - High Holiday relief for unprivileged families, orphans and widows.",
      color: "bg-indigo-600",
      image: "/Screenshot 2026-02-19 11.13.10.png",
      imageHint: "rosh hashanah",
      donateUrl: "/donate?cause=Rosh%20Hashanah%20and%20Sukkot",
      isHoliday: true,
      fullContent: (
        <div className="space-y-4">
          <h3 className="font-bold text-indigo-600 text-2xl md:text-3xl tracking-tight">Teshuva, Tefila and Tzdakah</h3>
          <p className="font-medium text-lg md:text-xl text-foreground leading-relaxed">We will soon be begging Hashem, pleading for a Shana Tovah for ourselves and for our families and I am sure that this Mitzva of tzedakah will stand for us all on the upcoming days of Judgement. Please open your heart generously and assist us in bringing joy and relief to our fellow Jews who rely on our help.</p>
        </div>
      )
    },
    {
      id: "purim",
      title: "Purim",
      subtitle: "Matanot Laevyonim",
      icon: <Utensils className="h-6 w-6" />,
      shortDesc: "Matanot Laevyonim - Gifts to the poor. Ensuring that every family can celebrate Purim with joy and a festive meal.",
      color: "bg-yellow-500",
      image: "/Gemini_Generated_Image_cxdvzjcxdvzjcxdv.png",
      imageHint: "purim celebration",
      donateUrl: "/donate?cause=Purim",
      isHoliday: true,
      fullContent: (
        <div className="space-y-4">
          <h3 className="font-bold text-yellow-600 text-2xl md:text-3xl tracking-tight">Matanot Laevyonim</h3>
          <p className="text-base md:text-xl leading-relaxed font-medium">As in past years, we will be distributing מתנות לאביונים, gifts to the poor, on Purim day. Please give generously so we can keep doing our holy work and speed up the ultimate Geulah.</p>
        </div>
      )
    },
    {
      id: "pesach",
      title: "Pesach",
      subtitle: "Maot Chitim",
      icon: <Gift className="h-6 w-6" />,
      shortDesc: "Maot Chitim - Support for Pesach. Providing the necessities for Seder night and the entire week of holiday.",
      color: "bg-blue-500",
      image: "/Screenshot 2026-02-19 11.12.50.png",
      imageHint: "pesach seder",
      donateUrl: "/donate?cause=Pesach",
      isHoliday: true,
      fullContent: (
        <div className="space-y-4">
          <h3 className="font-bold text-blue-600 text-2xl md:text-3xl tracking-tight">Maot Chitim</h3>
          <p className="text-base md:text-xl leading-relaxed font-medium">Please appoint us as your Shaliach for this most important Mitzvah of Maot Chitim. As you are likely aware, the need is great, especially during the seven days of Pesach, when people's expenses are doubled compared to other holidays. We will also be assisting the widows and orphans of our brave brethren HY”D who sacrificed their lives since Simchas Torah.</p>
        </div>
      )
    }
  ];

  const regularCauses = causes.filter(c => !c.isHoliday);
  const holidayCauses = causes.filter(c => c.isHoliday);

  return (
    <div className="overflow-x-hidden pt-32 md:pt-40 bg-white min-h-screen">
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black luxury-gradient-text tracking-tight leading-none mb-6">
            Our Causes
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground font-black tracking-[0.2em] opacity-70 uppercase">
            They Rely on Your Donation
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {regularCauses.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
            
            <div className="group h-full">
              <div className="glass-card h-full rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col border border-primary/10 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2">
                 <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image 
                      src="/HOLIDAYS.png" 
                      fill 
                      alt="High Holidays Donations" 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-lg z-10">
                       <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                 </div>
                 <div className="p-8 md:p-10 flex flex-col flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-primary mb-6 leading-tight">High Holidays Donations</h3>
                    <div className="flex flex-col gap-3 md:gap-4 flex-1">
                      {[
                        { label: "Rosh Hashanah", href: "rosh-hashanah-sukkot" },
                        { label: "Purim", href: "purim" },
                        { label: "Pesach", href: "pesach" }
                      ].map((link, idx) => (
                        <Link 
                          key={link.href} 
                          href={`#${link.href}`} 
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:text-primary transition-all group/link border border-transparent hover:border-primary/10"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(link.href)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          <span className="text-sm md:text-base font-black uppercase tracking-tight">{link.label}</span>
                          <ChevronRight className="h-4 w-4 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
             <div className="inline-block bg-primary/10 p-4 rounded-full mb-2">
                <CalendarDays className="h-8 w-8 text-primary" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black tracking-tight luxury-gradient-text leading-none">
                High Holidays Donations
             </h2>
             <div className="max-w-3xl mx-auto space-y-6">
               <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed tracking-tight">
                  There are many who have lost their sources of income, many orphans and widows, and many unprivileged families, and as the High Holidays draw near, we must help them celebrate in a dignified manner.
               </p>
               <p className="text-xl md:text-3xl text-primary font-black leading-tight tracking-tight">
                  Your contribution enables families to respectfully purchase food and other necessities for the Yom Tov.
               </p>
               <p className="text-base md:text-xl font-black tracking-tight text-foreground uppercase">
                  Please help those that can't manage on their own.
               </p>
             </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {holidayCauses.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
            
            <Link href="/donate?cause=Other" className="group h-full">
              <div className="glass-card h-full rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col border border-dashed border-primary/30 bg-white hover:bg-primary/5 transition-all shadow-xl">
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="h-16 w-16 md:h-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <Info className="h-8 w-8 md:h-10 md:w-10" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight">Other Causes</h3>
                      <p className="text-sm md:text-lg text-muted-foreground font-medium tracking-tight leading-relaxed opacity-80 max-w-xs mx-auto">
                        Providing Basic Necessities Enables Us to Enliven Disadvantaged Communities All Year Long.
                      </p>
                      <p className="text-lg md:text-2xl font-black text-primary tracking-tight mt-4 italic">
                        Please help us give life to those who rely on YOU
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm md:text-lg font-bold text-primary underline decoration-primary/20 underline-offset-4 tracking-tight">Please describe your donation</span>
                    </div>
                 </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-48 bg-foreground text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full -mr-80 -mt-80 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full -ml-80 -mb-80 blur-[150px]" />
        <div className="container mx-auto px-6 text-center relative z-10 space-y-12 md:space-y-20">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] drop-shadow-2xl">
              Please help us give life to <br className="hidden md:block" /> those who rely on <span className="text-primary luxury-gradient-text brightness-150">YOU</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Button size="lg" asChild className="rounded-full h-20 md:h-28 px-14 md:px-32 font-black bg-primary text-white shadow-2xl text-2xl md:text-4xl border-b-4 border-primary-foreground/20 hover:scale-110 transition-all">
              <Link href="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
