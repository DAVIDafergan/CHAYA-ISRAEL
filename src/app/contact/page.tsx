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
      const response = await processContactSubmission(values)

      if (firestore) {
        await addDoc(collection(firestore, 'mail'), {
          to: 'kramera613@gmail.com',
          message: {
            subject: `New message from ${values.name} (via Chaya Israel Website)`,
            text: `Name: ${values.name}\nEmail: ${values.email}\nMessage: ${values.message}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0070f3;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${values.name}</p>
                <p><strong>Email:</strong> ${values.email}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #0070f3;">
                  ${values.message.replace(/\n/g, '<br>') || ""}
                </div>
              </div>
            `,
          },
          createdAt: serverTimestamp(),
        })

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
          description: "We will get back to you shortly.",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later.",
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
          className="max-w-xl w-full text-center space-y-6 md:space-y-8"
        >
          <div className="bg-green-100 p-6 md:p-8 rounded-full w-fit mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight luxury-gradient-text leading-tight">Message Sent!</h2>
          <p className="text-lg md:text-2xl text-muted-foreground font-bold leading-relaxed">
            Thank you for reaching out. Your message has been delivered to kramera613@gmail.com and we will respond to you shortly.
          </p>
          <div className="pt-4 md:pt-8">
            <Button asChild size="lg" className="rounded-full h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl font-black bg-primary text-white shadow-xl">
              <Link href="/" className="flex items-center gap-3">
                Back to Home <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden pt-28 md:pt-40 bg-white min-h-screen">
       <section className="py-10 md:py-16 px-4">
          <div className="container mx-auto text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black luxury-gradient-text tracking-tight leading-tight mb-6 break-words">
                  Contact Us
              </h1>
              <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">
                We'd love to hear from you. Reach out with any questions or to learn more about our mission.
              </p>
          </div>
      </section>

      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-7xl">
            <div className="space-y-10 md:space-y-16">
              <div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight">Get in Touch</h2>
                <p className="mt-4 text-base md:text-xl text-muted-foreground font-medium leading-relaxed">Find us at our location, give us a call, or send an email.</p>
              </div>
              <div className="space-y-8 md:space-y-12">
                  <div className="flex items-start gap-6 md:gap-10">
                      <div className="bg-primary/10 p-4 md:p-6 rounded-2xl shrink-0">
                          <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                          <h3 className="font-black text-xs md:text-sm text-slate-400 uppercase tracking-widest">Primary Email</h3>
                          <a href="mailto:kramera613@gmail.com" className="text-lg md:text-2xl text-primary font-black hover:underline transition-all break-all">kramera613@gmail.com</a>
                      </div>
                  </div>
                  
                  <div className="flex items-start gap-6 md:gap-10">
                        <div className="bg-primary/10 p-4 md:p-6 rounded-2xl shrink-0">
                          <Phone className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                          <h3 className="font-black text-xs md:text-sm text-slate-400 uppercase tracking-widest">Phone Number</h3>
                          <a href="tel:+19179156106" className="text-lg md:text-2xl text-primary font-black hover:underline transition-all">(+917) 915 - 6106</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-6 md:gap-10">
                      <div className="bg-primary/10 p-4 md:p-6 rounded-2xl shrink-0">
                          <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                          <h3 className="font-black text-xs md:text-sm text-slate-400 uppercase tracking-widest">Our Location</h3>
                          <p className="text-lg md:text-2xl text-slate-800 font-black leading-tight">
                              335 East 77th Street. Apt #3<br />New York, NY 10075
                          </p>
                      </div>
                  </div>
              </div>
            </div>

            <Card className="p-6 md:p-10 shadow-2xl bg-white border-0 rounded-[32px] md:rounded-[48px] overflow-hidden">
                <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl md:text-4xl font-black tracking-tight luxury-gradient-text">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-14 bg-slate-50/50 rounded-xl border-0 px-6 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg"/>
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
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} className="h-14 bg-slate-50/50 rounded-xl border-0 px-6 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg"/>
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
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us how we can help..."
                                    className="resize-none bg-slate-50/50 rounded-2xl border-0 p-6 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-base md:text-lg"
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
                            className="w-full h-16 md:h-20 rounded-full bg-primary text-white hover:bg-primary/90 shadow-xl border-b-4 border-primary-foreground/20 font-black text-xl md:text-2xl mt-4 transition-all"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin" /> Processing...
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
