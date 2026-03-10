import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign, Users, FileText, Download, Plus, Search,
  Edit, Eye, CheckCircle, AlertCircle, Clock, TrendingUp, Printer, Trash2, RotateCcw, Loader2,
} from "lucide-react";
import { toast } from "sonner";

// ── API base URL — change to match your environment ───────────────────────────
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? options.body : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Student {
  _id: string;
  name: string;
  admNo: string;
  class: string;
  term: string;
  year: string;
  totalFees: number;
  amountPaid: number;
  balance: number;
  status: "cleared" | "partial" | "pending";
}

interface Payment {
  _id: string;
  studentName: string;
  admNo: string;
  amount: number;
  method: string;
  reference: string;
  date: string;
  receipt: string;
}

interface FeeStructure {
  _id: string;
  class: string;
  term: string;
  year: string;
  tuition: number;
  boarding: number;
  activity: number;
  total: number;
}

interface Stats {
  totalExpected: number;
  totalCollected: number;
  totalBalance: number;
  cleared: number;
  partial: number;
  pending: number;
  total: number;
}

// ── Print helpers ─────────────────────────────────────────────────────────────
function printReceipt(payment: Payment) {
  const win = window.open("", "_blank")!;
  win.document.write(`
    <html><head><title>Receipt ${payment.receipt}</title>
    <style>
      body{font-family:'Courier New',monospace;max-width:420px;margin:40px auto;color:#111}
      h1{text-align:center;font-size:20px;margin-bottom:2px}
      .sub{text-align:center;color:#666;font-size:12px;margin-bottom:20px}
      .div{border-top:2px dashed #aaa;margin:14px 0}
      .row{display:flex;justify-content:space-between;padding:3px 0;font-size:14px}
      .big{font-weight:800;font-size:18px}
      .foot{text-align:center;margin-top:22px;font-size:11px;color:#888}
    </style></head><body>
    <h1>🏫 Elimu Academy</h1>
    <div class="sub">P.O Box 123, Nairobi &nbsp;|&nbsp; +254 700 000 000</div>
    <div class="div"></div>
    <div class="row"><span>Receipt No:</span><span><b>${payment.receipt}</b></span></div>
    <div class="row"><span>Date:</span><span>${new Date(payment.date).toLocaleDateString()}</span></div>
    <div class="row"><span>Student:</span><span>${payment.studentName}</span></div>
    <div class="row"><span>Adm No:</span><span>${payment.admNo}</span></div>
    <div class="row"><span>Method:</span><span>${payment.method}</span></div>
    <div class="row"><span>Reference:</span><span>${payment.reference}</span></div>
    <div class="div"></div>
    <div class="row big"><span>Amount Paid:</span><span>KSH ${Number(payment.amount).toLocaleString()}</span></div>
    <div class="div"></div>
    <div class="foot">Thank you for your payment.<br/>This is an official receipt.</div>
    <script>window.onload=()=>{window.print();window.close()}<\/script>
    </body></html>`);
  win.document.close();
}

function printStatement(student: Student, payments: Payment[]) {
  const rows = payments.map(p => `
    <tr>
      <td>${p.receipt}</td><td>${new Date(p.date).toLocaleDateString()}</td>
      <td>${p.method}</td><td>${p.reference}</td>
      <td style="text-align:right">KSH ${Number(p.amount).toLocaleString()}</td>
    </tr>`).join("");
  const win = window.open("", "_blank")!;
  win.document.write(`
    <html><head><title>Statement — ${student.name}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:680px;margin:40px auto;font-size:14px}
      h1{font-size:22px;margin-bottom:4px}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th{background:#1d4ed8;color:#fff;padding:8px 10px;text-align:left;font-size:13px}
      td{padding:8px 10px;border-bottom:1px solid #e5e7eb}
      .summary{margin-top:20px;background:#f9fafb;padding:14px 18px;border-radius:8px}
      .summary .row{display:flex;justify-content:space-between;padding:4px 0}
    </style></head><body>
    <h1>🏫 Elimu Academy — Fee Statement</h1>
    <p><b>Student:</b> ${student.name} &nbsp;|&nbsp; <b>Adm No:</b> ${student.admNo} &nbsp;|&nbsp; <b>Class:</b> ${student.class}</p>
    <p><b>Term:</b> ${student.term} ${student.year} &nbsp;|&nbsp; <b>Printed:</b> ${new Date().toLocaleDateString()}</p>
    <table>
      <thead><tr><th>Receipt</th><th>Date</th><th>Method</th><th>Reference</th><th>Amount</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px">No payments recorded</td></tr>'}</tbody>
    </table>
    <div class="summary">
      <div class="row"><span>Total Fees</span><span>KSH ${Number(student.totalFees).toLocaleString()}</span></div>
      <div class="row"><span>Total Paid</span><span style="color:#15803d">KSH ${Number(student.amountPaid).toLocaleString()}</span></div>
      <div class="row"><b>Balance</b><b style="color:${student.balance > 0 ? '#b91c1c' : '#15803d'}">KSH ${Number(student.balance).toLocaleString()}</b></div>
    </div>
    <script>window.onload=()=>{window.print();window.close()}<\/script>
    </body></html>`);
  win.document.close();
}

function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]).filter(k => !["_id", "__v", "id"].includes(k));
  const csv = [keys.join(","), ...data.map(r => keys.map(k => `"${r[k] ?? ""}"`).join(","))].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: filename,
  });
  a.click();
}

// ── Status badge ──────────────────────────────────────────────────────────────
function getStatusBadge(status: string) {
  switch (status) {
    case "cleared":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" />Cleared</Badge>;
    case "partial":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Partial</Badge>;
    case "pending":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function AdminFinance() {

  // ── Data ───────────────────────────────────────────────────────────────────
  const [students,      setStudents]      = useState<Student[]>([]);
  const [payments,      setPayments]      = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [stats,         setStats]         = useState<Partial<Stats>>({});
  const [loading, setLoading] = useState({ students: true, payments: true, fees: true, stats: true });

  // ── Filters ────────────────────────────────────────────────────────────────
  const [searchTerm,     setSearchTerm]     = useState("");
  const [selectedClass,  setSelectedClass]  = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [paymentDialog,    setPaymentDialog]    = useState(false);
  const [feeDialog,        setFeeDialog]        = useState(false);
  const [viewDialog,       setViewDialog]       = useState<Student | null>(null);
  const [editStudentDialog,setEditStudentDialog]= useState<Student | null>(null);
  const [editFeeDialog,    setEditFeeDialog]    = useState<FeeStructure | null>(null);
  const [viewPayments,     setViewPayments]     = useState<Payment[]>([]);
  const [viewLoading,      setViewLoading]      = useState(false);
  const [submitting,       setSubmitting]       = useState(false);

  // ── Payment form ───────────────────────────────────────────────────────────
  const emptyPay = { admNo: "", amount: "", method: "", reference: "", date: new Date().toISOString().split("T")[0] };
  const [payForm, setPayForm] = useState(emptyPay);
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});

  // ── Fee structure form ─────────────────────────────────────────────────────
  const emptyFee = { class: "", term: "", year: "", tuition: "", boarding: "", activity: "" };
  const [feeForm, setFeeForm] = useState(emptyFee);
  const [feeErrors, setFeeErrors] = useState<Record<string, string>>({});

  // ── Edit student form ──────────────────────────────────────────────────────
  const [editStForm, setEditStForm] = useState<Partial<Student>>({});

  // ── Load functions ─────────────────────────────────────────────────────────
  const loadStudents = useCallback(async () => {
    setLoading(l => ({ ...l, students: true }));
    try {
      const params = new URLSearchParams();
      if (searchTerm)                        params.set("search", searchTerm);
      if (selectedClass  !== "all")          params.set("class",  selectedClass);
      if (selectedStatus !== "all")          params.set("status", selectedStatus);
      const res = await apiFetch(`/finance/students?${params}`);
      setStudents(res.data);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(l => ({ ...l, students: false })); }
  }, [searchTerm, selectedClass, selectedStatus]);

  const loadPayments = useCallback(async () => {
    setLoading(l => ({ ...l, payments: true }));
    try {
      const res = await apiFetch("/finance/payments");
      setPayments(res.data);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(l => ({ ...l, payments: false })); }
  }, []);

  const loadFees = useCallback(async () => {
    setLoading(l => ({ ...l, fees: true }));
    try {
      const res = await apiFetch("/finance/fee-structures");
      setFeeStructures(res.data);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(l => ({ ...l, fees: false })); }
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(l => ({ ...l, stats: true }));
    try {
      const res = await apiFetch("/finance/stats");
      setStats(res.data);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(l => ({ ...l, stats: false })); }
  }, []);

  // Debounce search / filter changes
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(loadStudents, 350);
    return () => clearTimeout(searchTimer.current);
  }, [loadStudents]);

  useEffect(() => { loadPayments(); loadFees(); loadStats(); }, []);

  const refreshAll = () => { loadStudents(); loadPayments(); loadStats(); };

  // ── Record payment ─────────────────────────────────────────────────────────
  const validatePay = () => {
    const e: Record<string, string> = {};
    if (!payForm.admNo.trim())                                           e.admNo     = "Required";
    if (!payForm.amount || isNaN(+payForm.amount) || +payForm.amount<=0) e.amount   = "Enter a valid amount";
    if (!payForm.method)                                                  e.method   = "Select a method";
    if (!payForm.reference.trim())                                        e.reference= "Required";
    if (!payForm.date)                                                    e.date     = "Required";
    return e;
  };

  // Live admission number lookup
  const lookupStudent = students.find(s => s.admNo === payForm.admNo.trim().toUpperCase());

  const handleRecordPayment = async () => {
    const e = validatePay();
    if (Object.keys(e).length) { setPayErrors(e); return; }
    setSubmitting(true);
    try {
      const res = await apiFetch("/finance/payments", {
        method: "POST",
        body: JSON.stringify({ ...payForm, admNo: payForm.admNo.trim().toUpperCase(), amount: +payForm.amount }),
      });
      toast.success(res.message ?? "Payment recorded successfully");
      setPayForm(emptyPay); setPayErrors({}); setPaymentDialog(false);
      refreshAll();
    } catch (e: any) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  // ── Reverse payment ────────────────────────────────────────────────────────
  const handleReversePayment = async (id: string) => {
    if (!confirm("Reverse this payment? The amount will be deducted from the student's record.")) return;
    try {
      await apiFetch(`/finance/payments/${id}`, { method: "DELETE" });
      toast.success("Payment reversed");
      refreshAll();
      if (viewDialog) {
        const res = await apiFetch(`/finance/students/${viewDialog._id}`);
        setViewPayments(res.data.payments ?? []);
        setViewDialog(res.data);
      }
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Fee structure ──────────────────────────────────────────────────────────
  const validateFee = () => {
    const e: Record<string, string> = {};
    if (!feeForm.class)                                            e.class    = "Required";
    if (!feeForm.term)                                             e.term     = "Required";
    if (!feeForm.year || isNaN(+feeForm.year))                    e.year     = "Enter a valid year";
    (["tuition","boarding","activity"] as const).forEach(k => {
      if (feeForm[k] === "" || isNaN(+feeForm[k]) || +feeForm[k] < 0) e[k] = "Enter a valid amount";
    });
    return e;
  };

  const openAddFee = () => { setEditFeeDialog(null); setFeeForm(emptyFee); setFeeErrors({}); setFeeDialog(true); };
  const openEditFee = (fs: FeeStructure) => {
    setEditFeeDialog(fs);
    setFeeForm({ class: fs.class, term: fs.term, year: fs.year, tuition: String(fs.tuition), boarding: String(fs.boarding), activity: String(fs.activity) });
    setFeeErrors({}); setFeeDialog(true);
  };

  const handleSaveFeeStructure = async () => {
    const e = validateFee();
    if (Object.keys(e).length) { setFeeErrors(e); return; }
    setSubmitting(true);
    const body = { ...feeForm, tuition: +feeForm.tuition, boarding: +feeForm.boarding, activity: +feeForm.activity };
    try {
      if (editFeeDialog) {
        await apiFetch(`/finance/fee-structures/${editFeeDialog._id}`, { method: "PUT", body: JSON.stringify(body) });
        toast.success("Fee structure updated");
      } else {
        await apiFetch("/finance/fee-structures", { method: "POST", body: JSON.stringify(body) });
        toast.success("Fee structure added");
      }
      setFeeDialog(false); setEditFeeDialog(null); setFeeForm(emptyFee);
      loadFees();
    } catch (e: any) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDeleteFeeStructure = async (id: string) => {
    if (!confirm("Delete this fee structure?")) return;
    try {
      await apiFetch(`/finance/fee-structures/${id}`, { method: "DELETE" });
      toast.success("Fee structure deleted");
      loadFees();
    } catch (e: any) { toast.error(e.message); }
  };

  // ── Edit student ───────────────────────────────────────────────────────────
  const openEditStudent = (s: Student) => {
    setEditStudentDialog(s);
    setEditStForm({ name: s.name, admNo: s.admNo, class: s.class, term: s.term, year: s.year, totalFees: s.totalFees, amountPaid: s.amountPaid });
  };

  const handleSaveStudent = async () => {
    if (!editStudentDialog) return;
    setSubmitting(true);
    try {
      await apiFetch(`/finance/students/${editStudentDialog._id}`, { method: "PUT", body: JSON.stringify(editStForm) });
      toast.success("Student record updated");
      setEditStudentDialog(null);
      refreshAll();
    } catch (e: any) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  // ── View student ───────────────────────────────────────────────────────────
  const openViewStudent = async (student: Student) => {
    setViewDialog(student); setViewLoading(true); setViewPayments([]);
    try {
      const res = await apiFetch(`/finance/students/${student._id}`);
      setViewPayments(res.data.payments ?? []);
      setViewDialog(res.data);
    } catch (e: any) { toast.error(e.message); }
    finally { setViewLoading(false); }
  };

  // ── Fee total preview ──────────────────────────────────────────────────────
  const feeTotal = (+feeForm.tuition || 0) + (+feeForm.boarding || 0) + (+feeForm.activity || 0);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Finance Management" subtitle="Manage fees, payments, and financial reports">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV(students as any, "students-report.csv")}>
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button onClick={() => { setPayForm(emptyPay); setPayErrors({}); setPaymentDialog(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Record Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Expected",     value: stats.totalExpected,  sub: "Term 1, 2026",                                                              icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, cls: "" },
            { label: "Total Collected",    value: stats.totalCollected, sub: `${stats.totalExpected ? ((stats.totalCollected!/stats.totalExpected)*100).toFixed(1) : 0}% collected`, icon: <TrendingUp className="h-4 w-4 text-green-600" />,   cls: "text-green-600" },
            { label: "Outstanding Balance",value: stats.totalBalance,   sub: `${(stats.partial ?? 0) + (stats.pending ?? 0)} students pending`,           icon: <AlertCircle className="h-4 w-4 text-red-600" />,     cls: "text-red-600" },
            { label: "Cleared Students",   value: null,                 sub: `${stats.total ? ((stats.cleared!/stats.total)*100).toFixed(1) : 0}% cleared`, icon: <CheckCircle className="h-4 w-4 text-green-600" />,  cls: "" },
          ].map((c, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
                {c.icon}
              </CardHeader>
              <CardContent>
                {loading.stats
                  ? <div className="h-8 bg-muted animate-pulse rounded" />
                  : i === 3
                    ? <div className="text-2xl font-bold">{stats.cleared ?? 0} / {stats.total ?? 0}</div>
                    : <div className={`text-2xl font-bold ${c.cls}`}>KSH {(c.value ?? 0).toLocaleString()}</div>
                }
                <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="students"><Users className="w-4 h-4 mr-2" />Student Fees</TabsTrigger>
            <TabsTrigger value="structure"><FileText className="w-4 h-4 mr-2" />Fee Structure</TabsTrigger>
            <TabsTrigger value="payments"><DollarSign className="w-4 h-4 mr-2" />Payment History</TabsTrigger>
          </TabsList>

          {/* ── STUDENTS TAB ───────────────────────────────────────────── */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div>
                    <CardTitle>Student Fee Records</CardTitle>
                    <CardDescription>{students.length} students · live from MongoDB</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by name or adm no..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} className="pl-8 w-full sm:w-[220px]" />
                    </div>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Class" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {["Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading.students
                  ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                  : <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Adm No.</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Term</TableHead>
                            <TableHead className="text-right">Total Fees</TableHead>
                            <TableHead className="text-right">Amount Paid</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.length === 0 && (
                            <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">No students found</TableCell></TableRow>
                          )}
                          {students.map(s => (
                            <TableRow key={s._id}>
                              <TableCell className="font-medium">{s.name}</TableCell>
                              <TableCell className="font-mono text-sm">{s.admNo}</TableCell>
                              <TableCell>{s.class}</TableCell>
                              <TableCell>{s.term} {s.year}</TableCell>
                              <TableCell className="text-right">KSH {s.totalFees.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-green-600 font-medium">KSH {s.amountPaid.toLocaleString()}</TableCell>
                              <TableCell className={`text-right font-medium ${s.balance > 0 ? "text-red-600" : "text-green-600"}`}>KSH {s.balance.toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(s.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" title="View Details" onClick={() => openViewStudent(s)}><Eye className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditStudent(s)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" title="Print Statement" onClick={() => printStatement(s, payments.filter(p => p.admNo === s.admNo))}><Printer className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── FEE STRUCTURE TAB ──────────────────────────────────────── */}
          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Fee Structure</CardTitle>
                    <CardDescription>Manage fee categories and amounts per class</CardDescription>
                  </div>
                  <Button onClick={openAddFee}><Plus className="w-4 h-4 mr-2" />Add Fee Structure</Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.fees
                  ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                  : <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Class</TableHead><TableHead>Term</TableHead><TableHead>Year</TableHead>
                            <TableHead className="text-right">Tuition</TableHead>
                            <TableHead className="text-right">Boarding</TableHead>
                            <TableHead className="text-right">Activity</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {feeStructures.length === 0 && (
                            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No fee structures yet</TableCell></TableRow>
                          )}
                          {feeStructures.map(fs => (
                            <TableRow key={fs._id}>
                              <TableCell className="font-medium">{fs.class}</TableCell>
                              <TableCell>{fs.term}</TableCell>
                              <TableCell>{fs.year}</TableCell>
                              <TableCell className="text-right">KSH {fs.tuition.toLocaleString()}</TableCell>
                              <TableCell className="text-right">KSH {fs.boarding.toLocaleString()}</TableCell>
                              <TableCell className="text-right">KSH {fs.activity.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-bold text-blue-600">KSH {fs.total.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditFee(fs)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteFeeStructure(fs._id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── PAYMENT HISTORY TAB ────────────────────────────────────── */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>{payments.length} total payments · live from MongoDB</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => exportCSV(payments as any, "payment-history.csv")}>
                    <Download className="w-4 h-4 mr-2" />Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.payments
                  ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                  : <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Receipt No.</TableHead><TableHead>Student Name</TableHead>
                            <TableHead>Adm No.</TableHead><TableHead className="text-right">Amount</TableHead>
                            <TableHead>Method</TableHead><TableHead>Reference</TableHead>
                            <TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.length === 0 && (
                            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No payments recorded yet</TableCell></TableRow>
                          )}
                          {payments.map(p => (
                            <TableRow key={p._id}>
                              <TableCell className="font-medium text-blue-600">{p.receipt}</TableCell>
                              <TableCell>{p.studentName}</TableCell>
                              <TableCell className="font-mono text-sm">{p.admNo}</TableCell>
                              <TableCell className="text-right text-green-600 font-medium">KSH {p.amount.toLocaleString()}</TableCell>
                              <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                              <TableCell className="font-mono text-sm">{p.reference}</TableCell>
                              <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" title="Print Receipt" onClick={() => printReceipt(p)}><Printer className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" title="Reverse Payment" onClick={() => handleReversePayment(p._id)} className="text-red-500 hover:text-red-700"><RotateCcw className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ════════════════════ DIALOGS ════════════════════ */}

      {/* Record Payment */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <DialogDescription>Enter payment details for a student</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Student Admission No.</Label>
              <Input placeholder="e.g. 2024001" value={payForm.admNo}
                onChange={e => setPayForm(f => ({ ...f, admNo: e.target.value }))} />
              {payForm.admNo && (
                <p className={`text-xs font-medium ${lookupStudent ? "text-green-600" : "text-red-500"}`}>
                  {lookupStudent ? `✓ ${lookupStudent.name} — Balance: KSH ${lookupStudent.balance.toLocaleString()}` : "✗ Student not found in loaded list"}
                </p>
              )}
              {payErrors.admNo && <p className="text-xs text-red-500">{payErrors.admNo}</p>}
            </div>
            <div className="space-y-2">
              <Label>Amount (KSH)</Label>
              <Input type="number" placeholder="Enter amount" value={payForm.amount}
                onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} />
              {payErrors.amount && <p className="text-xs text-red-500">{payErrors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={payForm.method} onValueChange={v => setPayForm(f => ({ ...f, method: v }))}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
              {payErrors.method && <p className="text-xs text-red-500">{payErrors.method}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input placeholder="Transaction ref" value={payForm.reference}
                  onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))} />
                {payErrors.reference && <p className="text-xs text-red-500">{payErrors.reference}</p>}
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input type="date" value={payForm.date}
                  onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} />
                {payErrors.date && <p className="text-xs text-red-500">{payErrors.date}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialog(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fee Structure (Add / Edit) */}
      <Dialog open={feeDialog} onOpenChange={v => { setFeeDialog(v); if (!v) setEditFeeDialog(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editFeeDialog ? "Edit Fee Structure" : "Add Fee Structure"}</DialogTitle>
            <DialogDescription>Define fees for a specific class and term</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={feeForm.class} onValueChange={v => setFeeForm(f => ({ ...f, class: v }))}>
                  <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
                  <SelectContent>
                    {["Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {feeErrors.class && <p className="text-xs text-red-500">{feeErrors.class}</p>}
              </div>
              <div className="space-y-2">
                <Label>Term</Label>
                <Select value={feeForm.term} onValueChange={v => setFeeForm(f => ({ ...f, term: v }))}>
                  <SelectTrigger><SelectValue placeholder="Term" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
                {feeErrors.term && <p className="text-xs text-red-500">{feeErrors.term}</p>}
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input placeholder="2026" value={feeForm.year} onChange={e => setFeeForm(f => ({ ...f, year: e.target.value }))} />
                {feeErrors.year && <p className="text-xs text-red-500">{feeErrors.year}</p>}
              </div>
            </div>
            {(["tuition","boarding","activity"] as const).map(k => (
              <div key={k} className="space-y-2">
                <Label>{k.charAt(0).toUpperCase() + k.slice(1)} Fee (KSH)</Label>
                <Input type="number" placeholder="0" value={feeForm[k]}
                  onChange={e => setFeeForm(f => ({ ...f, [k]: e.target.value }))} />
                {feeErrors[k] && <p className="text-xs text-red-500">{feeErrors[k]}</p>}
              </div>
            ))}
            {feeTotal > 0 && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
                <p className="font-bold text-blue-700 dark:text-blue-300">Total: KSH {feeTotal.toLocaleString()}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setFeeDialog(false); setEditFeeDialog(null); }}>Cancel</Button>
            <Button onClick={handleSaveFeeStructure} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Structure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student */}
      <Dialog open={!!editStudentDialog} onOpenChange={v => { if (!v) setEditStudentDialog(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Student Record</DialogTitle>
            <DialogDescription>Update student fee information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={editStForm.name ?? ""} onChange={e => setEditStForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Admission No.</Label>
                <Input value={editStForm.admNo ?? ""} onChange={e => setEditStForm(f => ({ ...f, admNo: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={editStForm.class ?? ""} onValueChange={v => setEditStForm(f => ({ ...f, class: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Term</Label>
                <Select value={editStForm.term ?? ""} onValueChange={v => setEditStForm(f => ({ ...f, term: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={editStForm.year ?? ""} onChange={e => setEditStForm(f => ({ ...f, year: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Fees (KSH)</Label>
                <Input type="number" value={editStForm.totalFees ?? ""} onChange={e => setEditStForm(f => ({ ...f, totalFees: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Amount Paid (KSH)</Label>
                <Input type="number" value={editStForm.amountPaid ?? ""} onChange={e => setEditStForm(f => ({ ...f, amountPaid: +e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStudentDialog(null)}>Cancel</Button>
            <Button onClick={handleSaveStudent} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Detail */}
      <Dialog open={!!viewDialog} onOpenChange={v => { if (!v) setViewDialog(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Fee Details</DialogTitle>
            <DialogDescription>{viewDialog?.name} · {viewDialog?.admNo}</DialogDescription>
          </DialogHeader>
          {viewDialog && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">Total Fees</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">KSH {viewDialog.totalFees.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-1">Amount Paid</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">KSH {viewDialog.amountPaid.toLocaleString()}</p>
                </div>
                <div className={`rounded-lg border p-3 ${viewDialog.balance > 0 ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"}`}>
                  <p className={`text-xs font-semibold uppercase mb-1 ${viewDialog.balance > 0 ? "text-red-600" : "text-green-600"}`}>Balance</p>
                  <p className={`text-xl font-bold ${viewDialog.balance > 0 ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}>KSH {viewDialog.balance.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Payment History ({viewPayments.length} payments)</p>
                {viewLoading
                  ? <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  : viewPayments.length === 0
                    ? <p className="text-sm text-muted-foreground text-center py-6">No payments recorded yet</p>
                    : <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Receipt</TableHead><TableHead>Date</TableHead>
                            <TableHead>Method</TableHead><TableHead>Reference</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewPayments.map(p => (
                            <TableRow key={p._id}>
                              <TableCell className="font-medium text-blue-600">{p.receipt}</TableCell>
                              <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                              <TableCell>{p.method}</TableCell>
                              <TableCell className="font-mono text-sm">{p.reference}</TableCell>
                              <TableCell className="text-right text-green-600 font-medium">KSH {p.amount.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => printReceipt(p)}><Printer className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleReversePayment(p._id)} className="text-red-500 hover:text-red-700"><RotateCcw className="h-4 w-4" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                }
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => viewDialog && printStatement(viewDialog, viewPayments)}>
              <Printer className="w-4 h-4 mr-2" /> Print Statement
            </Button>
            <Button onClick={() => setViewDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
}
