import { useState, useEffect, useCallback } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CheckCircle, AlertCircle, Clock, FileText, Printer, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface Child { _id: string; fullName: string; admissionNo: number; class: string }
interface FinanceData {
  child:    Child;
  finance:  { totalFees: number; amountPaid: number; balance: number; feeStatus: string };
  payments: Array<{ _id: string; amount: number; method: string; date: string; reference?: string; receipt?: string; term?: string }>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "cleared") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" />Cleared</Badge>;
  if (status === "partial")  return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Partial</Badge>;
  return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
}

export default function ParentFinance() {
  const [children,      setChildren]      = useState<Child[]>([]);
  const [selectedId,    setSelectedId]    = useState<string>("");
  const [financeData,   setFinanceData]   = useState<FinanceData | null>(null);
  const [loadingList,   setLoadingList]   = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load children list from parent dashboard
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/parent-dashboard");
        const kids: Child[] = res.data.children.map((c: any) => ({
          _id:         c._id,
          fullName:    c.fullName,
          admissionNo: c.admissionNo,
          class:       c.class,
        }));
        setChildren(kids);
        if (kids.length) setSelectedId(kids[0]._id);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, []);

  // Load finance detail when child selected
  useEffect(() => {
    if (!selectedId) return;
    const load = async () => {
      setLoadingDetail(true);
      try {
        const res = await apiFetch(`/parent-dashboard/child/${selectedId}/finance`);
        setFinanceData(res.data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoadingDetail(false);
      }
    };
    load();
  }, [selectedId]);

  if (loadingList) return (
    <PublicLayout pageTitle="Fee Statement">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    </PublicLayout>
  );

  const child   = financeData?.child;
  const finance = financeData?.finance;
  const payments = financeData?.payments ?? [];

  return (
    <PublicLayout pageTitle="Fee Statement">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold">Fee Statement</h1>
              <p className="text-muted-foreground">View fee balance and payment history</p>
            </div>
          </div>
          {children.length > 1 && (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select child" /></SelectTrigger>
              <SelectContent>
                {children.map(c => <SelectItem key={c._id} value={c._id}>{c.fullName} ({c.class})</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : !financeData ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground py-10">No finance data available</CardContent></Card>
        ) : (
          <>
            {/* Student Info */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{child?.fullName}</CardTitle>
                    <CardDescription>Admission No: {child?.admissionNo} • {child?.class}</CardDescription>
                  </div>
                  <StatusBadge status={finance?.feeStatus ?? "pending"} />
                </div>
              </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Fees</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">KSH {finance?.totalFees.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Amount Paid</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">KSH {finance?.amountPaid.toLocaleString()}</span>
                  </div>
                  {finance && <p className="text-xs text-muted-foreground mt-1">{((finance.amountPaid / (finance.totalFees || 1)) * 100).toFixed(0)}% paid</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {(finance?.balance ?? 0) > 0
                      ? <AlertCircle className="h-5 w-5 text-red-600" />
                      : <CheckCircle className="h-5 w-5 text-green-600" />}
                    <span className={`text-2xl font-bold ${(finance?.balance ?? 0) > 0 ? "text-red-600" : "text-green-600"}`}>
                      KSH {finance?.balance.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="history" className="space-y-4">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="history"><CreditCard className="w-4 h-4 mr-2" />Payment History</TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All payments made for {child?.fullName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map(p => (
                            <TableRow key={p._id}>
                              <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                              <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                              <TableCell className="font-mono text-sm">{p.reference ?? "—"}</TableCell>
                              <TableCell className="text-right text-green-600 font-medium">KSH {p.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">No payments recorded yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Payment Notice */}
            {(finance?.balance ?? 0) > 0 && (
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Payment Reminder</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Outstanding balance of <strong>KSH {finance?.balance.toLocaleString()}</strong>. Please contact school administration for payment details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
