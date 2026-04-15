
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSuccess(true)
      form.reset()
      toast({
        title: "Message sent!",
        description: "We will get back to you shortly.",
      })
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
          <div className="bg-green-100 p-8 rounded-full w-fit mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight luxury-gradient-text leading-tight px-4">Message Sent!</h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-bold leading-relaxed px-6">
            Thank you for reaching out. Your message has been delivered and we will respond to you shortly.
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="rounded-full h-16 md:h-18 px-12 text-lg md:text-xl font-black bg-primary text-white shadow-xl">
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
    <div className="overflow-x-hidden pt-28 md:pt-40 bg-white min-h-screen">
       <section className="py-12 md:py-20 px-6">
          <div className="container mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black luxury-gradient-text tracking-tight leading-tight mb-8 break-words px-4">
                  Contact Us
              </h1>
              <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed px-6">
                We'd love to hear from you. Reach out with any questions or to learn more about our mission.
              </p>
          </div>
      </section>

      <section className="py-12 md:py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-7xl">
            <div className="space-y-12 md:space-y-20">
              <div className="px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight">Get in Touch</h2>
                <p className="mt-6 text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">Find us at our location, give us a call, or send an email.</p>
              </div>
              <div className="space-y-10 md:space-y-16">
                  <div className="flex items-start gap-8 md:gap-12">
                      <div className="bg-primary/10 p-5 md:p-7 rounded-2xl shrink-0">
                          <Mail className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-xs md:text-sm text-slate-400 uppercase tracking-widest">Primary Email</h3>
                          <a href="mailto:kramera613@gmail.com" className="text-xl md:text-3xl text-primary font-black hover:underline transition-all break-all leading-tight">kramera613@gmail.com</a>
                      </div>
                  </div>
                  
                  <div className="flex items-start gap-8 md:gap-12">
                        <div className="bg-primary/10 p-5 md:p-7 rounded-2xl shrink-0">
                          <Phone className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-xs md:text-sm text-slate-400 uppercase tracking-widest">Phone Number</h3>
                          <a href="tel:+19179156106" className="text-xl md:text-3xl text-primary font-black hover:underline transition-all leading-tight">(+917) 915 - 6106</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-8 md:gap-12">
                      <div className="bg-primary/10 p-5 md:p-7 rounded-2xl shrink-0">
                          <MapPin className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                          <h3 className="font-black text-xs md:text-sm text-slate-400 uppercase tracking-widest">Our Location</h3>
                          <p className="text-xl md:text-3xl text-slate-800 font-black leading-tight">
                              335 East 77th Street. Apt #3<br />New York, NY 10075
                          </p>
                      </div>
                  </div>
              </div>
            </div>

            <Card className="p-8 md:p-14 shadow-2xl bg-white border-0 rounded-[48px] overflow-hidden">
                <CardHeader className="p-0 mb-10">
                    <CardTitle className="text-3xl md:text-4xl font-black tracking-tight luxury-gradient-text">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-16 bg-slate-50/50 rounded-2xl border-0 px-8 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-lg md:text-xl"/>
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
                                <FormLabel className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} className="h-16 bg-slate-50/50 rounded-2xl border-0 px-8 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-lg md:text-xl"/>
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
                                <FormLabel className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 block">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us how we can help..."
                                    className="resize-none bg-slate-50/50 rounded-2xl border-0 p-8 font-bold focus:ring-4 focus:ring-primary/10 transition-all text-lg md:text-xl"
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
                            className="w-full h-20 rounded-full bg-primary text-white hover:bg-primary/90 shadow-xl border-b-4 border-primary-foreground/20 font-black text-xl md:text-2xl mt-6 transition-all"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-7 w-7 animate-spin" /> Processing...
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
