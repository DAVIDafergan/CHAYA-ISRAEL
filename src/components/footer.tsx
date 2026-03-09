import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-black/5 bg-white/50 py-16 md:py-24" role="contentinfo">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 items-center gap-12 md:gap-20">
          <div className="text-center md:text-left space-y-6 md:space-y-8">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label="Chaya Israel home">
              <Image src="/Logo.png" alt="Chaya Israel logo" width={140} height={40} priority className="w-auto h-10 md:h-14 isolate bg-transparent"/>
            </Link>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] md:text-sm text-muted-foreground font-bold opacity-70">
                © {new Date().getFullYear()} Chaya Israel Foundation. All rights reserved.
              </p>
              <Link href="/admin" className="text-[8px] text-muted-foreground/30 hover:text-primary transition-colors font-medium w-fit mx-auto md:mx-0" aria-label="Manager login">
                Manager login
              </Link>
            </div>
            <nav className="flex gap-6 md:gap-10 justify-center md:justify-start" aria-label="Footer navigation">
               <Link href="/contact" className="text-[10px] md:text-xs font-black text-primary hover:translate-y-[-2px] transition-all outline-none focus-visible:underline underline-offset-4">Contact us</Link>
               <Link href="/mission" className="text-[10px] md:text-xs font-black text-primary hover:translate-y-[-2px] transition-all outline-none focus-visible:underline underline-offset-4">Our mission</Link>
            </nav>
            <p className="max-w-md text-[9px] md:text-[11px] text-muted-foreground leading-relaxed opacity-60 font-medium">
               The Chaya Israel Foundation is a 501(c)(3) Charitable Organization. All donations are tax deductible to US citizens. Tax-exempt donation receipts can be downloaded at any time.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-8">
            <nav className="flex items-center gap-4" aria-label="Social media links">
              {[
                { icon: <Youtube className="h-5 w-5" aria-hidden="true" />, href: "https://www.youtube.com/@ChayaIsraelFoundation", label: "YouTube" },
                { icon: <Facebook className="h-5 w-5" aria-hidden="true" />, href: "https://www.facebook.com/chayaisraelfoundation", label: "Facebook" },
                { icon: <Instagram className="h-5 w-5" aria-hidden="true" />, href: "https://www.instagram.com/chayaisraelfoundation", label: "Instagram" },
                { icon: <Linkedin className="h-5 w-5" aria-hidden="true" />, href: "https://www.linkedin.com/company/18073215", label: "LinkedIn" },
              ].map((social, idx) => (
                <Button key={idx} variant="ghost" size="icon" asChild className="rounded-full h-11 w-11 bg-black/5 text-foreground hover:text-white hover:bg-primary transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary">
                  <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${social.label}`}>
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </nav>
            <div className="text-center md:text-right">
              <p className="text-[10px] md:text-[12px] font-black text-muted-foreground opacity-50 mb-3">
                Designed for impact. Powered by hope.
              </p>
              <Link 
                href="https://wa.me/972556674329" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] md:text-[13px] text-muted-foreground hover:text-primary transition-all flex items-center justify-center md:justify-end gap-2 font-bold focus-visible:ring-1 focus-visible:ring-primary rounded px-1"
                aria-label="Created by DA Projects, opens in WhatsApp"
              >
                Created by <span className="text-primary font-black underline decoration-primary/20 underline-offset-4">DA Projects & Entrepreneurship</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}