'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, CheckCircle2, ShieldCheck, Heart, Mail, User, CreditCard as CardIcon, DollarSign, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ReceiptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const shouldPrint = searchParams.get('print') === 'true';
  const firestore = useFirestore();

  const docRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'donations', id);
  }, [firestore, id]);

  const { data: donation, isLoading } = useDoc(docRef);

  useEffect(() => {
    if (!isLoading && donation && shouldPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, donation, shouldPrint]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
        <Skeleton className="h-[700px] w-full max-w-2xl rounded-[40px]" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 bg-slate-50">
        <h1 className="text-2xl font-black">Receipt not found</h1>
        <p className="text-muted-foreground">The requested donation receipt could not be located.</p>
      </div>
    );
  }

  const receiptNumber = donation.transactionId?.substring(0, 8).toUpperCase() || donation.id.substring(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
          <Button variant="ghost" onClick={() => window.history.back()} className="rounded-full font-bold h-11 px-6 bg-white/50 hover:bg-white shadow-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Account
          </Button>
          <Button onClick={() => window.print()} className="rounded-full h-12 px-8 font-black shadow-xl bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Printer className="h-5 w-5 mr-2" /> Download / Print Receipt
          </Button>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-0 print:rounded-none">
          {/* Header with Logo */}
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col items-center text-center space-y-6">
            <div className="relative w-48 h-16 mb-4">
              <Image 
                src="/Logo.png" 
                alt="Chaya Israel Foundation" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                Donation Receipt #{receiptNumber}
              </h1>
              <p className="text-sm font-bold text-primary uppercase tracking-widest opacity-70">
                Official Tax-Exempt Confirmation
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Donor Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <User className="h-3 w-3" /> Donor Name
                  </div>
                  <p className="text-lg font-bold text-slate-800">{donation.payerName || 'Generous Donor'}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <Mail className="h-3 w-3" /> Email Address
                  </div>
                  <p className="text-base font-medium text-slate-600 truncate">{donation.payerEmail}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> Payment Status
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      {donation.status || 'Complete'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <CardIcon className="h-3 w-3" /> Payment Method
                  </div>
                  <p className="text-base font-medium text-slate-600">Credit Card / PayPal</p>
                </div>
              </div>
            </div>

            {/* Financial Summary Section */}
            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Donation Amount</span>
                <span className="text-slate-900">${donation.amount?.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">Donation Total</span>
                <span className="text-2xl md:text-3xl font-black text-primary">${donation.amount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-10 border-t border-slate-100 space-y-8">
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                    Chaya Israel Foundation is a registered 501(c)(3) non-profit organization. Your contribution is tax-deductible to the extent allowed by law. No goods or services were provided in exchange for this donation.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 italic break-all">
                    Transaction ID: {donation.transactionId}
                  </p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <Heart className="h-6 w-6 text-primary mx-auto opacity-30" />
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900">Thank you for your life-saving support.</p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    chayaisrael.com • (917) 915 - 6106 • New York, NY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase py-4 print:hidden">
           Designed for impact. Powered by hope.
        </p>
      </div>
    </div>
  );
}
