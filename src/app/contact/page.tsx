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
    console.log(values)
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
      variant: "default",
    })
    form.reset()
  }

  return (
    <div className="overflow-x-hidden pt-32 md:pt-40 bg-white min-h-screen">
       <section className="py-16 md:py-24">
          <div className="container mx-auto text-center px-4">
              <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl luxury-gradient-text">
                  Contact Us
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-xs text-muted-foreground sm:text-base md:text-lg">
                We'd love to hear from you. Reach out with any questions, partnership ideas, or to learn more about how you can get involved in our mission.
              </p>
          </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-start px-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-primary sm:text-3xl">Get in Touch</h2>
                <p className="mt-2 text-xs sm:text-base text-muted-foreground">Find us at our location, give us a call, or send an email. We are here to answer your questions.</p>
              </div>
              <div className="space-y-6">
                  {/* Primary Email */}
                  <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                          <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                          <h3 className="font-semibold text-base">Primary Email</h3>
                          <a href="mailto:Kramera613@gmail.com" className="text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">Kramera613@gmail.com</a>
                      </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                          <h3 className="font-semibold text-base">Phone Number</h3>
                          <a href="tel:+19179156106" className="text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">(+917) 915 - 6106</a>
                      </div>
                  </div>
                  <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                          <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                          <h3 className="font-semibold text-base">Our Location</h3>
                          <a href="https://www.google.com/maps/search/?api=1&query=335+East+77th+Street+New+York+NY+10075" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                              335 East 77th Street. Apt #3<br />New York, NY 10075
                          </a>
                      </div>
                  </div>
              </div>
            </div>

            <Card className="p-4 md:p-8 shadow-2xl bg-white border border-slate-100 h-full rounded-2xl">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-xl sm:text-3xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} className="h-10 bg-slate-50 rounded-full border-0 px-6"/>
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
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} className="h-10 bg-slate-50 rounded-full border-0 px-6"/>
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
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us how we can help..."
                                    className="resize-none bg-slate-50 rounded-2xl border-0 p-6"
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full h-11 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg border-b-4 border-primary-foreground/20 font-bold">Send Message</Button>
                      </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  )
}
