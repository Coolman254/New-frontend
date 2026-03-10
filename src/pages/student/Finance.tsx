import { useState, useEffect, useCallback } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle, AlertCircle, Clock, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface FinanceData {
  student: { _id: string; fullName: string; admissionNo: number; class: string };
  finance: { totalFees: number; amountPaid: number; balance: number; feeStatus: string; progressPercentage: number };
  recentPayments: Array<{ _id: string; amount: number; method: string; date: string; term?: string }>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "cleared") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" />Cleared</Badge>;
  if (status === "partial")  return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Partial</Badge>;
  return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
}

export default function StudentFinance() {
  const [data,    setData]    = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await apiFetch("/student-finance", {}, "studentToken");
      setData(res.data);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <PublicLayout pageTitle="My Fee Status">
      <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
    </PublicLayout>
  );

  if (error || !data) return (
    <PublicLayout pageTitle="My Fee Status">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-4"><BackButton /><h1 className="text-2xl font-bold">My Fee Status</h1></div>
        <Card><CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-sm text-muted-foreground">{error ?? "Failed to load"}</p>
          <Button onClick={load}>Try Again</Button>
        </CardContent></Card>
      </div>
    </PublicLayout>
  );

  const { student, finance, recentPayments } = data;

  return (
    <PublicLayout pageTitle="My Fee Status">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 space-y-6">

        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold">My Fee Status</h1>
            <p className="text-muted-foreground">View your fee balance and payment status</p>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Read-Only Access</AlertTitle>
          <AlertDescription>For payment issues, please ask your parent/guardian to contact school administration.</AlertDescription>
        </Alert>

        {/* Student Info */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{student.fullName}</CardTitle>
                <CardDescription>Admission No: {student.admissionNo} • {student.class}</CardDescription>
              </div>
              <StatusBadge status={finance.feeStatus} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Progress</span>
                <span className="font-medium">{finance.progressPercentage}% paid</span>
              </div>
              <Progress value={finance.progressPercentage} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Paid: KSH {finance.amountPaid.toLocaleString()}</span>
                <span className="text-red-600">Balance: KSH {finance.balance.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Fees</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">KSH {finance.totalFees.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Amount Paid</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">KSH {finance.amountPaid.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {finance.balance > 0 ? <AlertCircle className="h-5 w-5 text-red-600" /> : <CheckCircle className="h-5 w-5 text-green-600" />}
                <span className={`text-2xl font-bold ${finance.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                  KSH {finance.balance.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your payments this term</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No payments recorded yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map(p => (
                    <TableRow key={p._id}>
                      <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                      <TableCell>{p.term ?? "—"}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">KSH {p.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Balance Notice */}
        {finance.balance > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Balance Reminder</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Outstanding balance of <strong>KSH {finance.balance.toLocaleString()}</strong>. Please remind your parent/guardian to complete the payment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </PublicLayout>
  );
}
