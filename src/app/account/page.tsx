'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Heart, 
  Download, 
  Calendar, 
  ChevronRight,
  User as UserIcon,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyAccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Sync donations by email (normalized to lowercase) to catch guest donations
  const donationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.email) return null;
    const cleanEmail = user.email.trim().toLowerCase();
    return query(
      collection(firestore, 'donations'),
      where('payerEmail', '==', cleanEmail)
    );
  }, [firestore, user?.email]);
  
  const { data: rawDonations, isLoading: donationsLoading } = useCollection(donationsQuery);

  // Client-side sorting for latest first
  const donations = rawDonations ? [...rawDonations].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  }) : null;

  if (isUserLoading) {
    return (
      <div className="p-8 pt-40 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64 rounded-full" />
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary p-4 rounded-2xl shadow-lg">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">My account</h1>
              <p className="text-muted-foreground text-sm font-medium opacity-70">Personal impact journey</p>
            </div>
          </div>
          <Button asChild className="rounded-full h-12 px-8 font-bold shadow-xl">
            <Link href="/donate">Donate again</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[32px] border-0 shadow-sm bg-white overflow-hidden">
               <div className="bg-primary p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10">
                     <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">Donor profile</p>
                     <h2 className="text-xl font-bold truncate">{user.displayName || user.email?.split('@')[0]}</h2>
                     <p className="text-sm opacity-60 truncate">{user.email}</p>
                  </div>
               </div>
               <CardContent className="p-8 space-y-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">Member since</p>
                     <p className="text-sm font-bold">{user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'MMMM yyyy') : 'Recently'}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-60 mb-4">Quick links</p>
                     <div className="space-y-2">
                        <Link href="/contact" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                           <span className="text-xs font-bold">Get support</span>
                           <ChevronRight className="h-3 w-3 text-slate-400" />
                        </Link>
                        <Link href="/causes" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                           <span className="text-xs font-bold">Explore causes</span>
                           <ChevronRight className="h-3 w-3 text-slate-400" />
                        </Link>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="rounded-[32px] overflow-hidden border-0 shadow-sm bg-white min-h-[500px]">
              <CardHeader className="bg-slate-50/50 py-6 border-b border-slate-100 px-8">
                <CardTitle className="text-lg font-bold flex items-center gap-3 text-primary">
                  <CreditCard className="h-5 w-5" /> Donation history
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {donationsLoading ? (
                  <div className="p-12 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : donations && donations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/30">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                          <TableHead className="font-bold text-[10px] uppercase text-muted-foreground py-6 pl-8">Date</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Amount</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Cause</TableHead>
                          <TableHead className="font-bold text-[10px] uppercase text-muted-foreground pr-8 text-right">Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donations.map((donation) => (
                          <TableRow key={donation.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="py-6 pl-8">
                              <div className="flex items-center gap-3">
                                 <Calendar className="h-4 w-4 text-slate-300" />
                                 <span className="font-medium text-sm text-slate-600">
                                    {donation.timestamp ? format(new Date(donation.timestamp), 'MMM dd, yyyy') : 'N/A'}
                                 </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-primary">
                              ${donation.amount?.toFixed(2) || '0.00'}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-slate-600">
                              {donation.cause || "General"}
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="h-9 px-4 rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold text-[11px]"
                              >
                                <Link href={`/receipt/${donation.id}`}>
                                   <Download className="h-3 w-3 mr-2" /> Download
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-6">
                    <div className="bg-slate-50 p-6 rounded-full">
                      <Heart className="h-12 w-12 text-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">No donations found</h3>
                      <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                        Your generosity will appear here once you make your first donation.
                      </p>
                    </div>
                    <Button asChild className="rounded-full h-12 px-10 shadow-lg">
                       <Link href="/donate">Donate now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}