'use client'

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
import { Mail, Phone, MapPin } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message must not be longer than 500 characters."
  }),
})

export default function ContactPage() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const recipient = "kramera613@gmail.com";
    const subject = encodeURIComponent(`New Message from ${values.name} via Chaya Israel Site`);
    const body = encodeURIComponent(
      `Full Name: ${values.name}\n` +
      `Sender Email: ${values.email}\n\n` +
      `Message Content:\n${values.message}`
    );
    
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    toast({
      title: "Opening Email App...",
      description: "Your default mail client is opening with your message ready to send.",
    })
    
    form.reset()
  }

  return (
    <div className="overflow-x-hidden pt-32 md:pt-40 bg-white min-h-screen">
       <section className="py-16 md:py-24">
          <div className="container mx-auto text-center px-4">
              <h1 className="text-4xl font-black sm:text-6xl md:text-7xl luxury-gradient-text tracking-tight">
                  Contact Us
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl font-medium leading-relaxed">
                We'd love to hear from you. Reach out with any questions or to learn more about our mission.
              </p>
          </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-start px-6 max-w-7xl">
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-black text-primary sm:text-4xl tracking-tight">Get in Touch</h2>
                <p className="mt-4 text-lg sm:text-xl text-muted-foreground font-medium">Find us at our location, give us a call, or send an email.</p>
              </div>
              <div className="space-y-10">
                  <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-2xl shrink-0">
                          <Mail className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                          <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight mb-1">Primary Email</h3>
                          <a href="mailto:kramera613@gmail.com" className="text-lg sm:text-xl text-muted-foreground hover:text-primary transition-colors font-medium">kramera613@gmail.com</a>
                      </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                        <div className="bg-primary/10 p-4 rounded-2xl shrink-0">
                          <Phone className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                          <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight mb-1">Phone Number</h3>
                          <a href="tel:+19179156106" className="text-lg sm:text-xl text-muted-foreground hover:text-primary transition-colors font-medium">(+917) 915 - 6106</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-2xl shrink-0">
                          <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                          <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight mb-1">Our Location</h3>
                          <a href="https://www.google.com/maps/search/?api=1&query=335+East+77th+Street+New+York+NY+10075" target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl text-muted-foreground hover:text-primary transition-colors font-medium leading-relaxed">
                              335 East 77th Street. Apt #3<br />New York, NY 10075
                          </a>
                      </div>
                  </div>
              </div>
            </div>

            <Card className="p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] bg-white border border-slate-100 h-full rounded-[40px]">
                <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-3xl sm:text-4xl font-black tracking-tight luxury-gradient-text">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-14 bg-slate-50/50 rounded-2xl border-0 px-6 font-medium focus:ring-4 focus:ring-primary/10 transition-all text-lg"/>
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
                                <FormLabel className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} className="h-14 bg-slate-50/50 rounded-2xl border-0 px-6 font-medium focus:ring-4 focus:ring-primary/10 transition-all text-lg"/>
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
                                <FormLabel className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us how we can help..."
                                    className="resize-none bg-slate-50/50 rounded-3xl border-0 p-6 font-medium focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                                    rows={4}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full h-16 rounded-full bg-primary text-white hover:bg-primary/90 shadow-xl border-b-4 border-primary-foreground/20 font-black text-xl mt-4 transition-all hover:scale-[1.02]">Send Message</Button>
                      </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  )
}
