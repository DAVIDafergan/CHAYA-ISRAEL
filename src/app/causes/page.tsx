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
    }, 2500);
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
      shortDesc: "Protecting The Homeland • Tactical Equipment • We Are One",
      color: "bg-blue-900",
      image: "/חיילים.png",
      imageHint: "idf soldiers israel",
      donateUrl: "/donate?cause=IDF",
      fullContent: (
        <div className="space-y-12">
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
             <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl mx-auto max-w-2xl">
                <Image src="/תמונה מלחמה.jpg" fill alt="Tactical Equipment" className="object-cover" />
             </div>

             <h3 className="text-2xl md:text-4xl font-black text-blue-900">We Are One</h3>
             <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-full mx-auto">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/S2pEToiW8w8" 
                  title="IDF Support 2" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
             </div>
          </div>
        </div>
      )
    },
    {
      id: "widows",
      title: "Support Widows and Orphans",
      subtitle: "Support Widows and Orphans",
      icon: <Heart className="h-6 w-6" />,
      shortDesc: "When life has you pinned against the wall, it is often the help from your friends that allows you to keep moving forward.",
      color: "bg-red-500",
      image: "/יתומים ואלמנות .webp",
      imageHint: "israel charity widows",
      donateUrl: "/donate?cause=Widows%20and%20Orphans",
      fullContent: (
        <div className="space-y-10">
          <div className="bg-primary/5 p-10 rounded-[40px] border border-primary/10 italic text-center">
            <Quote className="h-10 w-10 text-primary/20 mx-auto mb-6" />
            <p className="font-black text-2xl md:text-3xl text-primary leading-tight">
              "When life has you pinned against the wall, it is often the help from your friends that allows you to keep moving forward."
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-black text-red-600 text-2xl md:text-4xl">Focus on Victims of Terror Attacks and Wars</h3>
            <p>
              Over the years, we’ve found that a family victimized by terror often suffers both financial and psychological struggles. It’s hard to lose a loved one – and it’s also hard to lose a source of income. Many women and kids have joined the circle of widows and orphans that have sacrificed more than we know for this great country we call “The Homeland”.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "hachnasat-kalah",
      title: "Hachnasat Kalah",
      subtitle: "If Not Us, Whom? And If Not Now, When?",
      icon: <Sparkles className="h-6 w-6" />,
      shortDesc: "If Not Us, Whom? And If Not Now, When? For newly-weds just starting off on their journey of marriage, financial matters can be tough and very challenging.",
      color: "bg-pink-500",
      image: "/hachnasat-kalah.png",
      imageHint: "jewish wedding",
      donateUrl: "/donate?cause=Hachnasat%20Kalah",
      fullContent: (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
             <div className="space-y-6">
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  For newly-weds just starting off on their journey of marriage, financial matters can be tough and very challenging.
                </p>
                <p>
                  We assist orphaned or underprivileged couples in building their new Jewish home with basic furniture, appliances, and wedding expenses.
                </p>
             </div>
             <SpecialImageSwitcher 
               images={[
                 "/hachnasat-kalah.png",
                 "/pexels-bride-1850126_1920.jpg",
                 "/הכנסת כלה2.png"
               ]} 
             />
          </div>
        </div>
      )
    },
    {
      id: "sderot",
      title: "Support South of Israel",
      subtitle: "While Rockets Flies, We send Love",
      icon: <Shield className="h-6 w-6" />,
      shortDesc: "The Chaya Israel branch in Sderot plays a significant role in the community. The city's residents have been suffering for years from the threat of Qassam rockets.",
      color: "bg-orange-500",
      image: "/הרס-מקסאם-בשכונת-הרכבות.jpg",
      imageHint: "sderot israel support",
      donateUrl: "/donate?cause=Sderot",
      fullContent: (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
                <p className="font-black text-xl text-orange-600">The Chaya Israel branch in Sderot plays a significant role in the community.</p>
                <p>The city's residents have been suffering for years from the threat of Qassam rockets that impacts all aspects of life.</p>
                <p className="font-bold">Please join us in providing hope & support for the people that protect the borders of Israel with their lives.</p>
             </div>
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
      )
    },
    {
      id: "food-boxes",
      title: "Food Boxes & Warm Blankets",
      subtitle: "We Are One",
      icon: <Package className="h-6 w-6" />,
      shortDesc: "Providing nourishment and warmth to families in need across Israel.",
      color: "bg-cyan-600",
      image: "/featured-image-7.jpg",
      imageHint: "charity food box",
      donateUrl: "/donate?cause=Food%20and%20Blankets",
      fullContent: (
        <div className="space-y-10">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-full mx-auto">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/fW_D_C0-78k" 
              title="Food and Blankets Support" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <p>Providing nourishment and warmth to families in need across Israel. Our monthly distributions ensure that no child goes to sleep hungry or cold.</p>
            </div>
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
      )
    }
  ];

  const holidayCauses: Cause[] = [
    {
      id: "rosh-hashanah",
      title: "Rosh Hashanah & Sukkot",
      subtitle: "Teshuva, Tefila and Tzdakah",
      icon: <CalendarDays className="h-6 w-6" />,
      shortDesc: "Teshuva, Tefila and Tzdakah - High Holiday relief.",
      color: "bg-amber-500",
      image: "/Screenshot 2026-02-19 11.13.10.png",
      imageHint: "rosh hashanah charity",
      donateUrl: "/donate?cause=Holidays",
      fullContent: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl font-bold leading-relaxed">
            "We will soon be begging Hashem, pleading for a Shana Tovah for ourselves and for our families and I am sure that this Mitzva of tzedakah will stand for us all on the upcoming days of Judgement. Please open your heart generously and assist us in bringing joy and relief to our fellow Jews who rely on our help."
          </p>
        </div>
      )
    },
    {
      id: "purim",
      title: "Purim",
      subtitle: "Matanot Laevyonim",
      icon: <Star className="h-6 w-6" />,
      shortDesc: "Matanot Laevyonim - Gifts to the poor.",
      color: "bg-purple-500",
      image: "/Gemini_Generated_Image_cxdvzjcxdvzjcxdv.png",
      imageHint: "purim charity",
      donateUrl: "/donate?cause=Purim",
      fullContent: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl font-bold leading-relaxed">
            "As in past years, we will be distributing מתנות לאביונים, gifts to the poor, on Purim day. Please give generously so we can keep doing our holy work and speed up the ultimate Geulah."
          </p>
        </div>
      )
    },
    {
      id: "pesach",
      title: "Pesach",
      subtitle: "Maot Chitim",
      icon: <Utensils className="h-6 w-6" />,
      shortDesc: "Maot Chitim - Support for Pesach.",
      color: "bg-blue-500",
      image: "/Screenshot 2026-02-19 11.12.50.png",
      imageHint: "pesach maot chitim",
      donateUrl: "/donate?cause=Pesach",
      fullContent: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl font-bold leading-relaxed">
            "Please appoint us as your Shaliach for this most important Mitzvah of Maot Chitim. As you are likely aware, the need is great, especially during the seven days of Pesach, when people's expenses are doubled compared to other holidays. We will also be assisting the widows and orphans of our brave brethren HY”D who sacrificed their lives since Simchas Torah so that we can continue to live as proud Jews in Eretz Yisrael and abroad."
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="overflow-x-hidden pt-32 md:pt-48 bg-white min-h-screen">
      {/* Hero Header */}
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

      {/* Main Causes Grid */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {causes.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
          </div>
        </div>
      </section>

      {/* High Holidays Intro Section */}
      <section className="py-24 md:py-32 bg-slate-50/50 px-6 border-y border-slate-100">
        <div className="container mx-auto max-w-5xl text-center px-4">
          <div className="inline-flex bg-primary/10 p-6 rounded-full mb-8">
            <CalendarDays className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8 break-words hyphens-auto luxury-gradient-text">
            High Holidays Donations
          </h2>
          <div className="glass-card p-10 md:p-16 rounded-[48px] bg-white shadow-xl border-primary/5">
             <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">
               "There are many who have lost their sources of income, many orphans and widows, and many unprivileged families, and as the High Holidays draw near, we must help them celebrate in a dignified manner. Your contribution enables families to respectfully purchase food and other necessities for the Yom Tov. Please help those that can't manage on their own."
             </p>
          </div>
        </div>
      </section>

      {/* Holiday Causes Grid */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {holidayCauses.map((cause) => (
              <DialogCard key={cause.id} cause={cause} />
            ))}
            
            {/* Hardcoded Other Causes Card */}
            <Link href="/donate?cause=Other" className="group h-full">
              <div className="glass-card h-full rounded-[32px] md:rounded-[40px] overflow-hidden flex flex-col border border-dashed border-primary/30 bg-white hover:bg-primary/5 transition-all shadow-md">
                 <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <Info className="h-10 w-10 md:h-12" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight break-words">Other Causes</h3>
                      <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed opacity-80">
                        Providing Basic Necessities Enables Us to Enliven Disadvantaged Communities All Year Long.
                      </p>
                      <p className="text-xs font-black text-primary uppercase tracking-widest pt-4 group-hover:underline">
                        Please describe your donation
                      </p>
                    </div>
                 </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
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

const Quote = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H0.017C-0.535282 13 -1.017 12.5523 -1.017 12V9C-1.017 7.34315 0.326142 6 1.017 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" />
  </svg>
);
