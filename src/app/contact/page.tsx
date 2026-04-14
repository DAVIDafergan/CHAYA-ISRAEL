
'use client'

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { useFirestore } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { processContactSubmission } from "@/ai/flows/contact-flow"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(1000, {
    message: "Message must not be longer than 1000 characters."
  }),
})

export default function ContactPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // 1. Process via Genkit Flow (Automated Server-Side Processing)
      // This happens "behind the scenes" without opening the mail app
      const response = await processContactSubmission(values)

      // 2. Save to Firestore (Permanent Log)
      if (firestore) {
        await addDoc(collection(firestore, 'contacts'), {
          ...values,
          createdAt: serverTimestamp(),
          recipient: 'kramera613@gmail.com',
          status: 'PROCESSED'
        })
      }

      if (response.success) {
        setIsSuccess(true)
        form.reset()
        toast({
          title: "Message received",
          description: "Your information has been sent to our team successfully.",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error sending your message. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 pt-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center space-y-8"
        >
          <div className="bg-green-100 p-8 rounded-full w-fit mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight luxury-gradient-text leading-none">Message Sent!</h2>
          <p className="text-xl md:text-3xl text-muted-foreground font-bold leading-relaxed">
            Thank you for reaching out. Your message has been delivered to kramera613@gmail.com and we will respond to you shortly.
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="rounded-full h-16 px-12 text-xl font-black bg-primary text-white shadow-xl">
              <Link href="/" className="flex items-center gap-3">
                Back to Home <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden pt-32 md:pt-40 bg-white min-h-screen">
       <section className="py-16 md:py-24">
          <div className="container mx-auto text-center px-4">
              <h1 className="text-5xl font-black sm:text-6xl md:text-7xl lg:text-8xl luxury-gradient-text tracking-tight leading-none mb-8">
                  Contact Us
              </h1>
              <p className="mt-8 max-w-4xl mx-auto text-xl sm:text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-black leading-relaxed tracking-tight">
                We'd love to hear from you. Reach out with any questions or to learn more about our mission.
              </p>
          </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-start px-6 max-w-7xl">
            <div className="space-y-16">
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-primary tracking-tight leading-tight">Get in Touch</h2>
                <p className="mt-6 text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-bold tracking-tight">Find us at our location, give us a call, or send an email.</p>
              </div>
              <div className="space-y-12">
                  <div className="flex items-start gap-10">
                      <div className="bg-primary/10 p-6 rounded-3xl shrink-0">
                          <Mail className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase opacity-50">Primary Email</h3>
                          <a href="mailto:kramera613@gmail.com" className="text-2xl sm:text-3xl md:text-4xl text-primary font-black hover:underline transition-all">kramera613@gmail.com</a>
                      </div>
                  </div>
                  
                  <div className="flex items-start gap-10">
                        <div className="bg-primary/10 p-6 rounded-3xl shrink-0">
                          <Phone className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase opacity-50">Phone Number</h3>
                          <a href="tel:+19179156106" className="text-2xl sm:text-3xl md:text-4xl text-primary font-black hover:underline transition-all">(+917) 915 - 6106</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-10">
                      <div className="bg-primary/10 p-6 rounded-3xl shrink-0">
                          <MapPin className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase opacity-50">Our Location</h3>
                          <a href="https://www.google.com/maps/search/?api=1&query=335+East+77th+Street+New+York+NY+10075" target="_blank" rel="noopener noreferrer" className="text-2xl sm:text-3xl md:text-4xl text-slate-800 font-black hover:text-primary transition-all leading-tight">
                              335 East 77th Street. Apt #3<br />New York, NY 10075
                          </a>
                      </div>
                  </div>
              </div>
            </div>

            <Card className="p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.08)] bg-white border-0 h-full rounded-[48px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <CardHeader className="p-0 mb-12">
                    <CardTitle className="text-4xl sm:text-5xl font-black tracking-tight luxury-gradient-text">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xl font-black uppercase tracking-widest text-slate-400 px-2">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-20 bg-slate-50/50 rounded-2xl border-0 px-8 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-xl md:text-3xl"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xl font-black uppercase tracking-widest text-slate-400 px-2">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} className="h-20 bg-slate-50/50 rounded-2xl border-0 px-8 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-xl md:text-3xl"/>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xl font-black uppercase tracking-widest text-slate-400 px-2">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us how we can help..."
                                    className="resize-none bg-slate-50/50 rounded-3xl border-0 p-8 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-xl md:text-3xl"
                                    rows={6}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full h-24 rounded-full bg-primary text-white hover:bg-primary/90 shadow-2xl border-b-8 border-primary-foreground/20 font-black text-2xl md:text-4xl mt-6 transition-all active:scale-95"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin" /> Processing...
                              </div>
                            ) : "Send Message"}
                          </Button>
                      </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  )
}
