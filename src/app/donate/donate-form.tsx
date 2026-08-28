
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DollarSign, Heart, Loader2, CheckCircle2, ArrowRight, CreditCard, User } from "lucide-react";
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
import { useUser } from "@/firebase";
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
      // 1. Capture the order (Essential for actually getting the money)
      const captureResult = await actions.order.capture();
      const transactionId = captureResult.id || data.orderID;
      
      // 2. Determine status
      const isCompleted = captureResult.status === 'COMPLETED' ||
                         captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED';

      const payerEmail = form.getValues('email').trim().toLowerCase();

      // The donation record itself is written server-side only, by the
      // signature-verified PayPal webhook (src/app/api/paypal-webhook/route.ts)
      // — never trust a client-reported "COMPLETED" status for a financial
      // ledger / tax receipt. This capture call still actually charges the
      // card; the webhook fires from PayPal moments later and records it.

      if (isCompleted) {
        setLastEmail(payerEmail);
        setIsSuccess(true);
        toast({
          title: "Donation successful",
          description: "Thank you for your generous support.",
        });
        form.reset();
      } else {
        throw new Error("DECLINED");
      }
    } catch (error: any) {
      console.error("PayPal Error:", error);
      toast({
        variant: "destructive",
        title: "העסקה נכשלה",
        description: "לצערנו העסקה לא אושרה על ידי חברת האשראי. אנא בדוק את הפרטים או נסה כרטיס אחר.",
      });
    }
  }

  const createOrder = async (data: any, actions: any) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required donor details first.",
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
                method: "SCA_ALWAYS" // Forces 3D Secure to prevent card declines
              }
            }
          }
        }
      });
    } catch (err) {
      console.error("Create order error:", err);
      throw err;
    }
  };

  const createSubscription = async (data: any, actions: any) => {
    const isValid = await form.trigger();
    if (!isValid) return Promise.reject(new Error("Form is invalid"));

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
          <Card className="rounded-[40px] overflow-hidden border-0 shadow-xl bg-white p-10">
            <div className="bg-green-100 p-6 rounded-full w-fit mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 break-words hyphens-auto">
              Thank you!
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-500 font-bold mb-8 leading-relaxed">
              Your contribution will make a significant impact in Israel.
            </p>
            {!user && lastEmail && (
              <div className="bg-primary/5 p-8 rounded-[32px] space-y-4 mb-6">
                <h3 className="text-xl md:text-2xl font-black text-primary tracking-tight">Track your impact</h3>
                <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed">
                  Create an account using <span className="text-primary">{lastEmail}</span> to view your receipts.
                </p>
                <Button asChild className="rounded-full h-12 px-8 font-black shadow-lg w-full">
                  <Link href={`/signup?email=${encodeURIComponent(lastEmail)}`}>
                    Create account now <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
            <Button variant="ghost" asChild className="rounded-full font-black text-primary h-12">
              <Link href="/">Back to home</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-xl">
        <header className="text-center mb-10 px-4">
          <div className="inline-flex bg-primary/10 p-4 rounded-full mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 break-words hyphens-auto">
            Donate to Chaya Israel
          </h1>
          {cause && !isOtherCause && (
            <div className="bg-primary/5 py-1 px-4 rounded-full inline-block mt-2">
              <p className="text-primary text-xs sm:text-sm font-black uppercase">Cause: {cause}</p>
            </div>
          )}
        </header>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Card className="rounded-[32px] overflow-hidden border-0 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 py-4 border-b px-6">
                <CardTitle className="text-base sm:text-lg font-black flex items-center gap-2 text-primary">
                  <CreditCard className="h-5 w-5" /> Donation Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'monthly')}
                          defaultValue={field.value ? 'monthly' : 'one-time'}
                          className="grid grid-cols-1 gap-3"
                        >
                          <div className={cn(
                            "flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all",
                            !field.value ? "border-primary bg-primary/5" : "border-slate-100"
                          )} onClick={() => field.onChange(false)}>
                            <RadioGroupItem value="one-time" id="one-time" className="sr-only" />
                            <p className={cn("text-base sm:text-lg font-black", !field.value ? "text-primary" : "text-slate-600")}>One-Time Donation</p>
                          </div>
                          <div className={cn(
                            "flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all",
                            field.value ? "border-primary bg-primary/5" : "border-slate-100"
                          )} onClick={() => field.onChange(true)}>
                            <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                            <p className={cn("text-base sm:text-lg font-black", field.value ? "text-primary" : "text-slate-600")}>Monthly Support</p>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[32px] overflow-hidden border-0 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 py-4 border-b px-6">
                <CardTitle className="text-base sm:text-lg font-black flex items-center gap-2 text-primary">
                  <DollarSign className="h-5 w-5" /> Amount (USD)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          className="h-14 sm:h-16 text-2xl sm:text-3xl font-black bg-slate-50/50 rounded-2xl border-0 focus:ring-4 focus:ring-primary/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[32px] overflow-hidden border-0 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 py-4 border-b px-6">
                <CardTitle className="text-base sm:text-lg font-black flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" /> Donor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400">First name</FormLabel>
                      <FormControl><Input {...field} className="h-11 bg-slate-50/50 rounded-xl border-0 font-bold" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400">Last name</FormLabel>
                      <FormControl><Input {...field} className="h-11 bg-slate-50/50 rounded-xl border-0 font-bold" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Email address</FormLabel>
                    <FormControl><Input type="email" {...field} className="h-11 bg-slate-50/50 rounded-xl border-0 font-bold" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <div className="mt-8">
              {isClient && (
                <div className="bg-white p-6 rounded-[32px] shadow-lg border border-slate-100">
                  <PayPalScriptProvider options={{ 
                    clientId: PAYPAL_CLIENT_ID, 
                    currency: "USD",
                    intent: watchIsRecurring ? "subscription" : "capture",
                    vault: watchIsRecurring ? true : undefined,
                    components: "buttons,applepay",
                    enableFunding: "applepay"
                  }}>
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
                        console.error("PayPal Button Error:", err);
                        toast({
                          variant: "destructive",
                          title: "Payment Error",
                          description: "An error occurred while loading the payment buttons. Please try again.",
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                  <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">Secure Payment • Apple Pay Enabled</p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

