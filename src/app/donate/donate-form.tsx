'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DollarSign, Heart, Mail, Loader2, CheckCircle2, ArrowRight, CreditCard, User } from "lucide-react";
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
      intent: "CAPTURE",
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
      payment_source: {
        card: {
          attributes: {
            verification: {
              method: "SCA_ALWAYS"
            }
          }
        }
      },
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
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
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="pt-24 pb-16 px-4 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-xl text-center">
          <Card className="rounded-[32px] overflow-hidden border-0 shadow-xl bg-white p-6 md:p-12">
            <div className="bg-green-100 p-6 rounded-full w-fit mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 leading-none break-words">Thank you!</h1>
            <p className="text-base md:text-xl text-slate-500 font-bold mb-8 leading-relaxed">
              Your contribution will make a significant impact in Israel.
            </p>
            
            {!user && lastEmail && (
              <div className="bg-primary/5 p-6 rounded-[24px] space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-primary tracking-tight">Track your impact</h3>
                  <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed">
                    Create an account using <span className="text-primary">{lastEmail}</span> to view your donation history and receipts.
                  </p>
                </div>
                <Button asChild className="rounded-full h-12 px-8 font-black shadow-lg w-full text-base border-b-4 border-primary-foreground/20">
                  <Link href={`/signup?email=${encodeURIComponent(lastEmail)}`} className="flex items-center justify-center gap-2">
                    Create account now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
            
            <div className="pt-6">
              <Button variant="ghost" asChild className="rounded-full font-black text-primary text-base px-6 h-12">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-xl">
        <header className="text-center mb-8 px-4">
          <div className="inline-flex bg-primary/10 p-4 rounded-full mb-4 shadow-sm">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight mb-2 break-words">
            Donate to Chaya Israel
          </h1>
          {cause && !isOtherCause && (
            <div className="bg-primary/5 py-1 px-4 rounded-full inline-block">
              <p className="text-primary text-xs md:text-lg font-black uppercase tracking-tight">
                Cause: {cause}
              </p>
            </div>
          )}
        </header>

        <Form {...form}>
          <form className="space-y-4 px-2 md:px-0" onSubmit={(e) => e.preventDefault()}>
            <Card className="rounded-[24px] overflow-hidden border-0 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 py-3 border-b border-slate-100 px-6">
                <CardTitle className="text-base md:text-lg font-black flex items-center gap-2 text-primary tracking-tight">
                  <CreditCard className="h-5 w-5" /> Donation Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'monthly')}
                          defaultValue={field.value ? 'monthly' : 'one-time'}
                          className="grid grid-cols-1 gap-2"
                        >
                          <div className={cn(
                            "relative flex items-center p-3 md:p-4 rounded-[16px] border-2 transition-all cursor-pointer",
                            !field.value ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-primary/20"
                          )} onClick={() => field.onChange(false)}>
                            <RadioGroupItem value="one-time" id="one-time" className="sr-only" />
                            <div className="flex items-center gap-3 w-full">
                              <div className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                !field.value ? "border-primary" : "border-slate-300"
                              )}>
                                {!field.value && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                              </div>
                              <p className={cn("text-base md:text-lg font-black tracking-tight", !field.value ? "text-primary" : "text-slate-600")}>
                                One-Time
                              </p>
                            </div>
                          </div>

                          <div className={cn(
                            "relative flex items-center p-3 md:p-4 rounded-[16px] border-2 transition-all cursor-pointer",
                            field.value ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-primary/20"
                          )} onClick={() => field.onChange(true)}>
                            <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                            <div className="flex items-center gap-3 w-full">
                              <div className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                field.value ? "border-primary" : "border-slate-300"
                              )}>
                                {field.value && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                              </div>
                              <p className={cn("text-base md:text-lg font-black tracking-tight", field.value ? "text-primary" : "text-slate-600")}>
                                Monthly
                              </p>
                              <div className="ml-auto bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                Needed
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

            <Card className="rounded-[24px] overflow-hidden border-0 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 py-3 border-b border-slate-100 px-6">
                <CardTitle className="text-base md:text-lg font-black flex items-center gap-2 text-primary tracking-tight">
                  <DollarSign className="h-5 w-5" /> Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-black text-primary">$</span>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field} 
                              className="pl-10 md:pl-14 h-12 md:h-16 text-xl md:text-3xl font-black bg-slate-50/50 rounded-[16px] border-0 focus:ring-4 focus:ring-primary/10"
                              required
                            />
                          </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[24px] overflow-hidden border-0 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 py-3 border-b border-slate-100 px-6">
                <CardTitle className="text-base md:text-lg font-black flex items-center gap-2 text-primary tracking-tight">
                  <User className="h-5 w-5" /> Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black text-muted-foreground uppercase px-1">First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="h-11 bg-slate-50/50 rounded-xl px-4 border-0 text-sm font-bold" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black text-muted-foreground uppercase px-1">Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="h-11 bg-slate-50/50 rounded-xl px-4 border-0 text-sm font-bold" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-muted-foreground uppercase px-1">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@example.com" 
                        {...field} 
                        className="h-11 bg-slate-50/50 rounded-xl border-0 text-sm font-bold"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <div className="space-y-4 mt-6">
              {isClient && (
                <div 
                  key={watchIsRecurring ? `paypal-sub-v5` : `paypal-one-v5`}
                  className="bg-white p-4 rounded-[24px] shadow-lg border border-slate-100"
                >
                  <PayPalScriptProvider 
                    options={{ 
                      clientId: PAYPAL_CLIENT_ID, 
                      currency: "USD",
                      intent: watchIsRecurring ? "subscription" : "capture",
                      vault: watchIsRecurring ? true : undefined
                    }}
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
                          title: "Connection Error",
                          description: "Could not connect to PayPal. Please try again.",
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                  <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Secure Payment Gateway</p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
