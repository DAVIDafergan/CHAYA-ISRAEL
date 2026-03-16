'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DollarSign, Heart, MessageSquare, Info, User, Mail, MapPin, Loader2, CheckCircle2, ArrowRight, Calendar, CreditCard } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { type OnApproveData, type CreateOrderData } from "@paypal/paypal-js";
import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Please enter a donation amount" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string().min(5, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zip: z.string().min(4, { message: "Zip code is required" }),
  note: z.string().optional(),
  isRecurring: z.boolean().default(false),
});

export default function DonateForm({ cause }: { cause?: string }) {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastEmail, setLastEmail] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      firstName: "",
      lastName: "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zip: "",
      note: "",
      isRecurring: false,
    },
  });

  useEffect(() => {
    if (user?.email) {
      form.setValue('email', user.email);
    }
  }, [user, form]);

  const watchAmount = form.watch("amount");
  const watchIsRecurring = form.watch("isRecurring");
  const donationTotal = watchAmount || "0";
  const isOtherCause = cause === 'Other';

  async function handleOnApprove(data: OnApproveData, actions: any) {
    try {
      const transactionId = data.orderID || data.subscriptionID || 'unknown';
      const payerEmail = form.getValues('email').trim().toLowerCase();
      
      if (firestore) {
        await addDoc(collection(firestore, 'donations'), {
          transactionId: transactionId,
          amount: parseFloat(donationTotal),
          currency: 'USD',
          userId: user?.uid || 'guest',
          payerEmail: payerEmail,
          payerName: `${form.getValues('firstName')} ${form.getValues('lastName')}`,
          status: 'COMPLETED',
          timestamp: new Date().toISOString(),
          cause: cause || 'General',
          note: form.getValues('note') || '',
          createdAt: serverTimestamp(),
          paymentType: watchIsRecurring ? 'RECURRING_START' : 'ONE_TIME'
        });
      }

      setLastEmail(payerEmail);
      setIsSuccess(true);
      toast({
        title: "Donation successful",
        description: `Thank you, ${form.getValues('firstName')}, for your generous support.`,
      });
      form.reset();
    } catch (error) {
      console.error("PayPal Approval Error:", error);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "There was an issue processing your payment. Please try again.",
      });
    }
  }

  const createOrder = async (data: any, actions: any) => {
    const isValid = await form.trigger();
    if (!isValid) {
        toast({
            variant: "destructive",
            title: "Information missing",
            description: "Please fill out all required fields before donating.",
        });
        return Promise.reject(new Error("Form is invalid"));
    }
      
    return actions.order.create({
      purchase_units: [
        {
          custom_id: user?.uid || 'guest',
          description: `Donation for ${cause || 'Chaya Israel'}`,
          amount: {
            value: parseFloat(donationTotal).toFixed(2),
            currency_code: 'USD',
          }
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
  };

  const createSubscription = async (data: any, actions: any) => {
    const isValid = await form.trigger();
    if (!isValid) {
        toast({
            variant: "destructive",
            title: "Information missing",
            description: "Please fill out all required fields before starting a subscription.",
        });
        return Promise.reject(new Error("Form is invalid"));
    }

    return actions.subscription.create({
      plan_id: 'P-5ML4271244454362MC6277SA',
      custom_id: user?.uid || 'guest',
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 px-4 bg-slate-50 min-h-screen">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="rounded-[40px] overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white p-12">
            <div className="bg-green-100 p-6 rounded-full w-fit mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Thank you!</h1>
            <p className="text-lg text-slate-500 font-medium mb-12">
              Your contribution will make a significant impact on families in Israel.
            </p>
            
            {!user && (
              <div className="bg-primary/5 p-8 rounded-[32px] space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">Track your impact</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Want to see your donation history and download receipts? Create an account using your email <strong>{lastEmail}</strong>.
                  </p>
                </div>
                <Button asChild className="rounded-full h-14 px-10 font-bold shadow-xl w-full">
                  <Link href={`/signup?email=${encodeURIComponent(lastEmail)}`} className="flex items-center justify-center gap-2">
                    Create account now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
            
            <div className="pt-8">
              <Button variant="ghost" asChild className="rounded-full font-bold text-primary">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider 
      key={watchIsRecurring ? "subscription-provider" : "onetime-provider"}
      options={{ 
        clientId: "ASE12L1NxuxPX9d1J8xfMuhwsP_YuKfOYj64Z-Nx46wW_wPtX4bUQYOZFsPElXdznnKBya_o9uxpIryd", 
        currency: "USD",
        intent: watchIsRecurring ? "subscription" : "capture",
        vault: watchIsRecurring ? true : undefined
      }}
    >
      <div className="pt-32 pb-24 px-4 bg-slate-50 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <header className="text-center mb-12">
            <div className="inline-flex bg-primary/10 p-4 rounded-full mb-4 shadow-sm">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-none mb-2">
              Donate to Chaya Israel
            </h1>
            {cause && !isOtherCause && (
              <p className="text-muted-foreground text-xs md:text-sm font-bold opacity-80 mb-4">
                Cause: {cause}
              </p>
            )}
          </header>

          <Form {...form}>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                
                <Card className="rounded-[40px] overflow-hidden border-0 shadow-sm bg-white">
                  <CardHeader className="bg-slate-50/50 py-6 border-b border-slate-100">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                      <CreditCard className="h-5 w-5" /> Donation Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="isRecurring"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === 'monthly')}
                              defaultValue={field.value ? 'monthly' : 'one-time'}
                              className="grid grid-cols-1 gap-4"
                            >
                              <div className={cn(
                                "relative flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer",
                                !field.value ? "border-primary bg-primary/5 shadow-md" : "border-slate-100 hover:border-primary/20"
                              )} onClick={() => field.onChange(false)}>
                                <RadioGroupItem value="one-time" id="one-time" className="sr-only" />
                                <div className="flex items-center gap-4 w-full">
                                  <div className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                    !field.value ? "border-primary" : "border-slate-300"
                                  )}>
                                    {!field.value && <div className="h-3 w-3 rounded-full bg-primary" />}
                                  </div>
                                  <div>
                                    <p className={cn("text-base font-black tracking-tight", !field.value ? "text-primary" : "text-slate-600")}>
                                      One-Time Donation
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Single support contribution</p>
                                  </div>
                                </div>
                              </div>

                              <div className={cn(
                                "relative flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer",
                                field.value ? "border-primary bg-primary/5 shadow-md" : "border-slate-100 hover:border-primary/20"
                              )} onClick={() => field.onChange(true)}>
                                <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                                <div className="flex items-center gap-4 w-full">
                                  <div className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                    field.value ? "border-primary" : "border-slate-300"
                                  )}>
                                    {field.value && <div className="h-3 w-3 rounded-full bg-primary" />}
                                  </div>
                                  <div>
                                    <p className={cn("text-base font-black tracking-tight", field.value ? "text-primary" : "text-slate-600")}>
                                      Monthly Donation
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Continuous impact support</p>
                                  </div>
                                  <div className="ml-auto bg-primary/10 text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    Highly Needed
                                  </div>
                                </div>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-[40px] overflow-hidden border-0 shadow-sm bg-white">
                  <CardHeader className="bg-slate-50/50 py-6 border-b border-slate-100">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                      <DollarSign className="h-5 w-5" /> Donation amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative">
                              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-primary">$</span>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  {...field} 
                                  className="pl-16 h-24 text-5xl font-black bg-slate-50/50 rounded-3xl border-0 focus:ring-4 focus:ring-primary/10 transition-all"
                                  required
                                />
                              </FormControl>
                              {watchIsRecurring && (
                                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 uppercase tracking-widest">/ Month</span>
                              )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-[40px] overflow-hidden border-0 shadow-sm bg-white">
                  <CardHeader className="bg-slate-50/50 py-6 border-b border-slate-100">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                      <User className="h-5 w-5" /> Personal details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">First name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="h-14 bg-slate-50/50 rounded-2xl px-6 border-0" required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="h-14 bg-slate-50/50 rounded-2xl px-6 border-0" required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </div>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">Email address</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="email@example.com" 
                              {...field} 
                              className="h-14 pl-14 bg-slate-50/50 rounded-2xl border-0"
                              required
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </CardContent>
                </Card>

                <Card className="rounded-[40px] overflow-hidden border-0 shadow-sm bg-white">
                  <CardHeader className="bg-slate-50/50 py-6 border-b border-slate-100">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                      <MapPin className="h-5 w-5" /> Billing address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">Street address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Charity Lane" {...field} className="h-14 bg-slate-50/50 rounded-2xl px-6 border-0" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} className="h-14 bg-slate-50/50 rounded-2xl px-6 border-0" required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} className="h-14 bg-slate-50/50 rounded-2xl px-6 border-0" required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </div>
                    <FormField control={form.control} name="zip" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase px-1">Zip code</FormLabel>
                        <FormControl>
                          <Input placeholder="Zip" {...field} className="h-14 bg-slate-50/50 rounded-2xl px-6 border-0" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </CardContent>
                </Card>

                <Card className="rounded-[40px] overflow-hidden border-0 shadow-sm bg-white">
                  <CardHeader className="bg-slate-50/50 py-6 border-b border-slate-100">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                      <MessageSquare className="h-5 w-5" /> 
                      {isOtherCause ? 'Description' : 'Add a note'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder={isOtherCause ? "Tell us more about this donation..." : "Message (optional)"}
                              className="bg-slate-50/50 rounded-3xl min-h-[120px] border-0 p-6"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-start gap-4 shadow-sm">
                     <div className="bg-primary/10 p-2 rounded-full">
                        <Info className="h-5 w-5 text-primary" />
                     </div>
                     <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        A tax-exempt receipt will be sent to your email. Your data is protected.
                     </p>
                  </div>

                  {isClient && (
                    <div 
                      className="bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 min-h-[150px] flex flex-col justify-center"
                    >
                      <PayPalButtons 
                        style={{ 
                          layout: "vertical", 
                          color: 'blue', 
                          shape: 'pill', 
                          label: watchIsRecurring ? 'subscribe' : 'donate',
                          height: 55
                        }}
                        createOrder={!watchIsRecurring ? createOrder : undefined}
                        createSubscription={watchIsRecurring ? createSubscription : undefined}
                        onApprove={handleOnApprove}
                        onError={(err) => {
                          console.error("PayPal Global Error:", err);
                          toast({
                            variant: "destructive",
                            title: "PayPal Connection Error",
                            description: "Could not connect to PayPal. Please check your information or try another payment method.",
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
