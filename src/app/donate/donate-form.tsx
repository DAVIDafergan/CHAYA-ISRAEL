'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DollarSign, Heart, MessageSquare, Info, User, Mail, Loader2, CheckCircle2, ArrowRight, CreditCard } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { type OnApproveData } from "@paypal/paypal-js";
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

  const PAYPAL_CLIENT_ID = "ASE12L1NxuxPX9d1J8xfMuhwsP_YuKfOYj64Z-Nx46wW_wPtX4bUQYOZFsPElXdznnKBya_o9uxpIryd";

  async function handleOnApprove(data: OnApproveData, actions: any) {
    try {
      const transactionId = data.orderID || data.subscriptionID || 'unknown';
      const payerEmail = form.getValues('email').trim().toLowerCase();
      
      if (firestore) {
        addDoc(collection(firestore, 'donations'), {
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
        description: `Thank you for your generous support.`,
      });
      form.reset();
    } catch (error) {
      console.error("PayPal Approval Error:", error);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "There was an issue processing your payment.",
      });
    }
  }

  const createOrder = async (data: any, actions: any) => {
    const isValid = await form.trigger();
    if (!isValid) {
        toast({
            variant: "destructive",
            title: "Information missing",
            description: "Please fill out all required fields.",
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
            description: "Please fill out all required fields.",
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
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 px-4 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="rounded-[40px] overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white p-12">
            <div className="bg-green-100 p-8 rounded-full w-fit mx-auto mb-10">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-none">Thank you!</h1>
            <p className="text-xl md:text-3xl text-slate-500 font-bold mb-12 leading-relaxed">
              Your contribution will make a significant impact in Israel.
            </p>
            
            {!user && (lastEmail) && (
              <div className="bg-primary/5 p-8 rounded-[32px] space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-4xl font-black text-primary tracking-tight">Track your impact</h3>
                  <p className="text-lg md:text-2xl text-slate-600 font-bold leading-relaxed">
                    Create an account using <span className="text-primary">{lastEmail}</span> to view your donation history and receipts.
                  </p>
                </div>
                <Button asChild className="rounded-full h-16 px-10 font-black shadow-xl w-full text-xl md:text-2xl border-b-4 border-primary-foreground/20">
                  <Link href={`/signup?email=${encodeURIComponent(lastEmail)}`} className="flex items-center justify-center gap-3">
                    Create account now <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
            
            <div className="pt-8">
              <Button variant="ghost" asChild className="rounded-full font-black text-primary text-xl px-8 h-14">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <header className="text-center mb-10">
          <div className="inline-flex bg-primary/10 p-5 rounded-full mb-6 shadow-sm">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-3">
            Donate to Chaya Israel
          </h1>
          {cause && !isOtherCause && (
            <div className="bg-primary/5 py-2 px-6 rounded-full inline-block">
              <p className="text-primary text-lg md:text-2xl font-black uppercase tracking-tight">
                Cause: {cause}
              </p>
            </div>
          )}
        </header>

        <Form {...form}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              
              <Card className="rounded-[32px] overflow-hidden border-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] bg-white">
                <CardHeader className="bg-slate-50/50 py-5 border-b border-slate-100 px-8">
                  <CardTitle className="text-xl md:text-2xl font-black flex items-center gap-3 text-primary tracking-tight">
                    <CreditCard className="h-6 w-6" /> Donation Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'monthly')}
                            defaultValue={field.value ? 'monthly' : 'one-time'}
                            className="grid grid-cols-1 gap-4"
                          >
                            <div className={cn(
                              "relative flex items-center p-6 rounded-[24px] border-2 transition-all cursor-pointer",
                              !field.value ? "border-primary bg-primary/5 shadow-md" : "border-slate-100 hover:border-primary/20"
                            )} onClick={() => field.onChange(false)}>
                              <RadioGroupItem value="one-time" id="one-time" className="sr-only" />
                              <div className="flex items-center gap-4 w-full">
                                <div className={cn(
                                  "h-8 w-8 rounded-full border-4 flex items-center justify-center shrink-0",
                                  !field.value ? "border-primary" : "border-slate-300"
                                )}>
                                  {!field.value && <div className="h-4 w-4 rounded-full bg-primary" />}
                                </div>
                                <div>
                                  <p className={cn("text-xl md:text-2xl font-black tracking-tight", !field.value ? "text-primary" : "text-slate-600")}>
                                    One-Time Donation
                                  </p>
                                  <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70">Single support contribution</p>
                                </div>
                              </div>
                            </div>

                            <div className={cn(
                              "relative flex items-center p-6 rounded-[24px] border-2 transition-all cursor-pointer",
                              field.value ? "border-primary bg-primary/5 shadow-md" : "border-slate-100 hover:border-primary/20"
                            )} onClick={() => field.onChange(true)}>
                              <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                              <div className="flex items-center gap-4 w-full">
                                <div className={cn(
                                  "h-8 w-8 rounded-full border-4 flex items-center justify-center shrink-0",
                                  field.value ? "border-primary" : "border-slate-300"
                                )}>
                                  {field.value && <div className="h-4 w-4 rounded-full bg-primary" />}
                                </div>
                                <div>
                                  <p className={cn("text-xl md:text-2xl font-black tracking-tight", field.value ? "text-primary" : "text-slate-600")}>
                                    Monthly Donation
                                  </p>
                                  <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70">Continuous impact support</p>
                                </div>
                                <div className="ml-auto hidden sm:block bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
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

              <Card className="rounded-[32px] overflow-hidden border-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] bg-white">
                <CardHeader className="bg-slate-50/50 py-5 border-b border-slate-100 px-8">
                  <CardTitle className="text-xl md:text-2xl font-black flex items-center gap-3 text-primary tracking-tight">
                    <DollarSign className="h-6 w-6" /> Donation amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl md:text-5xl font-black text-primary">$</span>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                {...field} 
                                className="pl-14 md:pl-20 h-20 md:h-28 text-4xl md:text-6xl font-black bg-slate-50/50 rounded-[20px] border-0 focus:ring-4 focus:ring-primary/10 transition-all"
                                required
                              />
                            </FormControl>
                            {watchIsRecurring && (
                              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm md:text-xl font-black text-slate-400 uppercase tracking-widest">/ Mo</span>
                            )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-[32px] overflow-hidden border-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] bg-white">
                <CardHeader className="bg-slate-50/50 py-5 border-b border-slate-100 px-8">
                  <CardTitle className="text-xl md:text-2xl font-black flex items-center gap-3 text-primary tracking-tight">
                    <User className="h-6 w-6" /> Personal details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs md:text-sm font-black text-muted-foreground uppercase px-2 tracking-widest mb-2 block">First name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="h-14 bg-slate-50/50 rounded-xl px-6 border-0 text-lg font-bold" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs md:text-sm font-black text-muted-foreground uppercase px-2 tracking-widest mb-2 block">Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="h-14 bg-slate-50/50 rounded-xl px-6 border-0 text-lg font-bold" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs md:text-sm font-black text-muted-foreground uppercase px-2 tracking-widest mb-2 block">Email address</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="email@example.com" 
                            {...field} 
                            className="h-14 pl-14 bg-slate-50/50 rounded-xl border-0 text-lg font-bold"
                            required
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </CardContent>
              </Card>

              <Card className="rounded-[32px] overflow-hidden border-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] bg-white">
                <CardHeader className="bg-slate-50/50 py-5 border-b border-slate-100 px-8">
                  <CardTitle className="text-xl md:text-2xl font-black flex items-center gap-3 text-primary tracking-tight">
                    <MessageSquare className="h-6 w-6" /> 
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
                            className="bg-slate-50/50 rounded-[20px] min-h-[120px] border-0 p-6 text-lg font-medium leading-relaxed"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[24px] border-2 border-primary/10 flex items-start gap-4 shadow-sm">
                   <div className="bg-primary/10 p-3 rounded-full shrink-0">
                      <Info className="h-6 w-6 text-primary" />
                   </div>
                   <p className="text-sm md:text-base font-bold text-slate-600 leading-relaxed tracking-tight">
                      A tax-exempt receipt will be sent to your email. Your transaction is secured by PayPal's industry-standard encryption.
                   </p>
                </div>

                {isClient && (
                  <div 
                    key={watchIsRecurring ? `paypal-sub-v2-${PAYPAL_CLIENT_ID}` : `paypal-one-v2-${PAYPAL_CLIENT_ID}`}
                    className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 min-h-[140px] flex flex-col justify-center gap-4"
                  >
                    <PayPalScriptProvider 
                      key={watchIsRecurring ? "script-sub-v3-reloaded" : "script-one-v3-reloaded"}
                      options={{ 
                        clientId: PAYPAL_CLIENT_ID, 
                        currency: "USD",
                        intent: watchIsRecurring ? "subscription" : "capture",
                        vault: watchIsRecurring ? true : undefined
                      }}
                    >
                      <PayPalButtons 
                        key={watchIsRecurring ? "btns-sub-v3-active" : "btns-one-v3-active"}
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
                            title: "Connection Error",
                            description: "Could not connect to PayPal. Please try again.",
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Payment Gateway</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
