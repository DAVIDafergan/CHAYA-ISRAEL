
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  cause: string;
  status: string;
  paypalTransactionId?: string;
  note?: string;
  createdAt: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/receipt/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setDonation(data);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Skeleton className="h-[600px] w-full max-w-2xl rounded-[40px]" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
        <h1 className="text-2xl font-black">Receipt not found</h1>
        <p className="text-muted-foreground">The requested donation receipt could not be located.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-end print:hidden">
          <Button onClick={() => window.print()} className="rounded-full h-11 px-6 font-black shadow-lg">
            <Printer className="h-4 w-4 mr-2" /> Print receipt
          </Button>
        </div>

        <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-0">
          {/* Receipt Header */}
          <div className="bg-primary p-12 text-white relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="mx-auto bg-white p-3 rounded-2xl w-fit">
                <Image src="/Logo.png" alt="Chaya Israel" width={160} height={50} className="h-10 w-auto" />
              </div>
              <div className="pt-2">
                <h1 className="text-3xl font-black tracking-tight">Official receipt</h1>
                <p className="text-primary-foreground/70 font-bold tracking-widest uppercase text-xs">Donation confirmation</p>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-10">
            {/* Status Section */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-10">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Receipt number</p>
                  <p className="text-sm font-black text-slate-900">#RC-{donation.id.substring(0, 8).toUpperCase()}</p>
               </div>
               <div className="bg-green-50 text-green-600 px-4 py-2 rounded-full flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-black tracking-widest uppercase">Verified payment</span>
               </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Date of donation</p>
                     <p className="text-sm font-bold text-slate-700">
                        {donation.createdAt ? format(new Date(donation.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Amount</p>
                     <p className="text-2xl font-black text-primary">${donation.amount?.toFixed(2)}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Donor name</p>
                     <p className="text-sm font-bold text-slate-700">{donation.donorName}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Donation cause</p>
                     <p className="text-sm font-bold text-slate-700">{donation.cause || 'General support'}</p>
                  </div>
               </div>

               <div className="space-y-1 pt-4">
                  <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Transaction ID</p>
                  <p className="text-[10px] font-medium text-slate-400 font-mono">{donation.paypalTransactionId}</p>
               </div>
            </div>

            {/* Legal Footnote */}
            <div className="pt-10 border-t border-slate-100 space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl flex gap-4">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                     Chaya Israel Foundation is a registered 501(c)(3) non-profit organization. Your contribution is tax-deductible to the extent allowed by law. No goods or services were provided in exchange for this donation.
                  </p>
               </div>
               
               <div className="text-center space-y-2">
                  <Heart className="h-5 w-5 text-primary mx-auto opacity-20" />
                  <p className="text-[11px] font-black text-primary tracking-widest uppercase">Thank you for your generosity</p>
                  <p className="text-[10px] text-slate-400">chayaisrael.com • (917) 915 - 6106</p>
               </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase print:hidden">
           Designed for impact. Powered by hope.
        </p>
      </div>
    </div>
  );
}
