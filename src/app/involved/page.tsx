'use client';

import { ArrowRight, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } }
};

const cardVariants = {
  offscreen: {
    y: 5,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

export default function InvolvedPage() {
    return (
        <div className="overflow-x-hidden pt-32 md:pt-40">
            <motion.section 
                className="py-16 md:py-24"
                initial="hidden"
                animate="visible"
                variants={pageVariants}
            >
                <div className="container mx-auto text-center">
                    <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
                        Get Involved
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-xs text-muted-foreground sm:text-base md:text-lg">
                        Your contribution, whether through time or donation, can create waves of positive impact. Let's build a better world together.
                    </p>
                </div>
            </motion.section>

            <section className="py-12 md:py-20">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <motion.div
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={cardVariants}
                    >
                        <Card className="p-4 md:p-8 shadow-2xl h-full flex flex-col justify-between text-center transition-all duration-300 bg-gradient-to-br from-primary to-accent text-white border-0 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 rounded-2xl">
                           <div>
                                <div className="mx-auto bg-white/20 p-4 rounded-full w-fit mb-4">
                                    <Heart className="h-8 w-8 text-white" />
                                </div>
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl sm:text-3xl">Donate</CardTitle>
                                    <CardDescription className="mt-2 text-xs text-primary-foreground/80 sm:text-base">Your financial support helps us continue our vital work in the community. Every donation makes a difference, enabling us to fund projects and provide essential resources.</CardDescription>
                                </CardHeader>
                           </div>
                            <CardContent className="p-0 mt-6">
                                <Button size="lg" className="w-full bg-background text-foreground hover:bg-background/90 text-base font-bold rounded-full h-10" asChild>
                                    <Link href="/donate">
                                        Donate Now <ArrowRight className="ml-2" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                     <motion.div
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={cardVariants}
                        transition={{ delay: 0.2, ...cardVariants.onscreen.transition }}
                     >
                        <Card className="p-4 md:p-8 shadow-lg h-full flex flex-col justify-between text-center transition-all duration-300 border-white/20 hover:border-accent/50 hover:shadow-accent/10 bg-white/10 backdrop-blur-md hover:scale-105 hover:-translate-y-1 rounded-2xl">
                             <div>
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl sm:text-3xl">Volunteer</CardTitle>
                                    <CardDescription className="mt-2 text-xs text-muted-foreground sm:text-base">Join our team of dedicated volunteers and contribute your time and skills to a cause you believe in. Your energy is a powerful force for change.</CardDescription>
                                </CardHeader>
                             </div>
                            <CardContent className="p-0 mt-6">
                                <Button size="lg" variant="outline" className="w-full text-base font-bold rounded-full h-10">
                                    Become a Volunteer
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
