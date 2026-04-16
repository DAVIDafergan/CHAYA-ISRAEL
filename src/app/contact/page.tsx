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
import { Mail, Phone, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const firestore = useFirestore();

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
      if (!firestore) throw new Error("Connection failed. Please refresh.");

      // Use Firestore 'mail' collection to trigger automated email extension
      await addDoc(collection(firestore, 'mail'), {
        to: 'kramera613@gmail.com',
        replyTo: values.email,
        message: {
          subject: `פנייה חדשה מאתר חיה ישראל - ${values.name}`,
          text: `Name: ${values.name}\nEmail: ${values.email}\nMessage: ${values.message}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #f0f0f0; border-radius: 20px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0070f3; font-size: 24px; margin: 0;">פנייה חדשה מאתר חיה ישראל</h1>
              </div>
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                <p style="margin: 0 0 15px 0;"><strong>שם השולח:</strong> ${values.name}</p>
                <p style="margin: 0 0 15px 0;"><strong>דוא"ל לחזרה:</strong> ${values.email}</p>
                <p style="margin: 0;"><strong>תוכן ההודעה:</strong></p>
                <div style="margin-top: 10px; padding: 15px; background-color: #ffffff; border-left: 5px solid #0070f3; border-radius: 5px; font-style: italic;">
                  ${values.message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>הודעה זו נשלחה באופן אוטומטי ממערכת האתר של חיה ישראל.</p>
              </div>
            </div>
          `,
        },
        createdAt: serverTimestamp(),
        source: 'contact-page'
      });

      setIsSuccess(true)
      form.reset()
      toast({ title: "Message sent!" });
    } catch (error: any) {
      console.error("Submission error:", error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center space-y-10 px-4"
        >
          <div className="bg-green-100 p-8 rounded-full w-fit mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight luxury-gradient-text leading-tight break-words hyphens-auto">
            Message Sent!
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-bold leading-relaxed">
            Thank you. We will get back to you shortly at kramera613@gmail.com.
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="rounded-full h-16 md:h-20 px-10 md:px-20 text-lg md:text-2xl font-black bg-primary text-white shadow-xl border-b-4 border-primary-foreground/20">
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
    <div className="overflow-x-hidden pt-28 md:pt-48 bg-white min-h-screen">
       <section className="py-12 md:py-24 px-6">
          <div className="container mx-auto text-center px-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black luxury-gradient-text tracking-tight leading-tight mb-10 break-words hyphens-auto">
                  Contact Us
              </h1>
              <p className="max-w-4xl mx-auto text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium leading-relaxed">
                We'd love to hear from you. Reach out with any questions or to learn more about our mission.
              </p>
          </div>
      </section>

      <section className="py-12 md:py-24 px-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start max-w-7xl px-4">
            <div className="space-y-16 md:space-y-24">
              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight break-words hyphens-auto">Get in Touch</h2>
                <p className="mt-8 text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium leading-relaxed">Reach out via email or phone for any assistance.</p>
              </div>
              <div className="space-y-12 md:space-y-20">
                  <div className="flex items-start gap-10">
                      <div className="bg-primary/10 p-6 rounded-2xl shrink-0">
                          <Mail className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-xs md:text-sm lg:text-base text-slate-400 uppercase tracking-widest">Email</h3>
                          <a href="mailto:kramera613@gmail.com" className="text-xl md:text-2xl lg:text-3xl text-primary font-black hover:underline transition-all break-all leading-tight">kramera613@gmail.com</a>
                      </div>
                  </div>
                  
                  <div className="flex items-start gap-10">
                        <div className="bg-primary/10 p-6 rounded-2xl shrink-0">
                          <Phone className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-xs md:text-sm lg:text-base text-slate-400 uppercase tracking-widest">Phone</h3>
                          <a href="tel:+19179156106" className="text-xl md:text-2xl lg:text-3xl text-primary font-black hover:underline transition-all leading-tight">(+917) 915 - 6106</a>
                      </div>
                  </div>
              </div>
            </div>

            <Card className="p-10 md:p-16 lg:p-20 shadow-2xl bg-white border-0 rounded-[48px] overflow-hidden">
                <CardHeader className="p-0 mb-12">
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight luxury-gradient-text break-words hyphens-auto">Send a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-2">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-16 md:h-20 bg-slate-50/50 rounded-2xl border-0 px-8 font-bold focus:ring-4 focus:ring-primary/10 text-lg md:text-xl lg:text-2xl"/>
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
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-2">Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="name@example.com" {...field} className="h-16 md:h-20 bg-slate-50/50 rounded-2xl border-0 px-8 font-bold focus:ring-4 focus:ring-primary/10 text-lg md:text-xl lg:text-2xl"/>
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
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-2">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="How can we help?"
                                    className="resize-none bg-slate-50/50 rounded-2xl border-0 p-8 font-bold focus:ring-4 focus:ring-primary/10 text-lg md:text-xl lg:text-2xl"
                                    rows={5}
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
                            className="w-full h-20 md:h-24 lg:h-28 rounded-full bg-primary text-white hover:bg-primary/90 shadow-xl border-b-4 border-primary-foreground/20 font-black text-xl md:text-3xl lg:text-4xl mt-6 transition-all"
                          >
                            {isSubmitting ? <Loader2 className="h-8 w-8 animate-spin" /> : "Send Message"}
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
