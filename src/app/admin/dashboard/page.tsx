'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useAuth, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
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
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  LogOut, 
  LayoutDashboard, 
  CreditCard, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Users,
  RefreshCcw
} from 'lucide-react';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 25;

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const { auth } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [causeFilter, setCauseFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAdmin = user?.email?.toLowerCase() === 'chaya123@chayaisrael.com';

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin');
    }
    if (!isUserLoading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isUserLoading, router, isAdmin]);

  // Simplified query for admin to avoid index issues
  const donationsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !isAdmin) return null;
    return query(collection(firestore, 'donations'));
  }, [firestore, user, isAdmin]);
  
  const { data: rawDonations, isLoading: donationsLoading } = useCollection(donationsQuery);

  const filteredDonations = useMemo(() => {
    if (!rawDonations) return [];
    
    let results = [...rawDonations];

    // Client-side sorting for latest first
    results.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return results.filter(donation => {
      const searchTerms = searchQuery.toLowerCase();
      const matchesSearch = 
        donation.payerName?.toLowerCase().includes(searchTerms) ||
        donation.payerEmail?.toLowerCase().includes(searchTerms) ||
        donation.transactionId?.toLowerCase().includes(searchTerms);
      
      const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
      const matchesCause = causeFilter === 'ALL' || donation.cause === causeFilter;
      
      return matchesSearch && matchesStatus && matchesCause;
    });
  }, [rawDonations, searchQuery, statusFilter, causeFilter]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const paginatedDonations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDonations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDonations, currentPage]);

  const stats = useMemo(() => {
    if (!filteredDonations.length) return { total: 0, count: 0 };
    const total = filteredDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    return { total, count: filteredDonations.length };
  }, [filteredDonations]);

  async function handleLogout() {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  }

  if (isUserLoading || !user || !isAdmin) {
    return (
      <div className="p-8 pt-32 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64 rounded-full" />
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight luxury-gradient-text">Donations manager</h1>
              <p className="text-muted-foreground text-sm font-medium opacity-70">Foundation impact dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
              variant="outline" 
              onClick={handleLogout}
              className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11 px-6 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-[32px] border-0 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Total revenue</p>
                <h2 className="text-3xl font-bold text-primary">${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[32px] border-0 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="bg-accent/10 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Total donations</p>
                <h2 className="text-3xl font-bold text-slate-900">{stats.count}</h2>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[32px] border-0 shadow-sm bg-white mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search donors or email..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-11 h-12 rounded-2xl bg-slate-50 border-0 focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-0 font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-xl">
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={causeFilter} onValueChange={(v) => { setCauseFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-0 font-medium">
                  <SelectValue placeholder="Cause" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-xl">
                  <SelectItem value="ALL">All causes</SelectItem>
                  <SelectItem value="Widows and Orphans">Widows and Orphans</SelectItem>
                  <SelectItem value="Hachnasat Kalah">Hachnasat Kalah</SelectItem>
                  <SelectItem value="Sderot">Sderot</SelectItem>
                  <SelectItem value="IDF">IDF</SelectItem>
                  <SelectItem value="Food and Blankets">Food and Blankets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] overflow-hidden border-0 shadow-sm bg-white min-h-[400px]">
          <CardHeader className="bg-slate-50/50 py-8 border-b border-slate-100 px-8 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-primary">
              <CreditCard className="h-5 w-5" /> Recent transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {donationsLoading ? (
              <div className="p-12 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : paginatedDonations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="font-bold text-[10px] uppercase text-muted-foreground py-6 pl-8">Date</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Donor</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Amount</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase text-muted-foreground">Cause</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase text-muted-foreground pr-8">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDonations.map((donation: any) => (
                      <TableRow key={donation.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="py-6 pl-8 font-medium text-sm text-slate-500">
                          {donation.timestamp ? format(new Date(donation.timestamp), 'MMM dd, HH:mm') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{donation.payerName}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{donation.payerEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          ${donation.amount?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-600">
                          {donation.cause || "General"}
                        </TableCell>
                        <TableCell className="pr-8">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                            donation.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {donation.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-8 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Showing page {currentPage} of {totalPages || 1}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(prev => prev - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-full h-10 w-10 p-0 border-slate-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => {
                        setCurrentPage(prev => prev + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-full h-10 w-10 p-0 border-slate-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-6">
                <div className="bg-slate-50 p-6 rounded-full">
                  <Search className="h-12 w-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">No donations found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                    Try adjusting your search terms or filters to find specific transactions.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}