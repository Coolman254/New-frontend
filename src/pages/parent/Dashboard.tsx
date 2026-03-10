import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3, Bell, FileText, ChevronRight, MessageCircle,
  GraduationCap, ChevronDown, DollarSign, Loader2,
  AlertCircle, LogOut, Send, Calendar, UserCheck, TrendingUp,
  CreditCard, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  class: string;
  admissionNo: number;
  avgScore: number;
  recentGrades: Array<{ _id: string; subject: string; score: number; grade: string; date: string; term: string }>;
  fee: { totalFees: number; amountPaid: number; balance: number; feeStatus: string };
}
interface ParentData {
  parent: { _id: string; firstName: string; fullName: string };
  children: Child[];
  announcements: Array<{ _id: string; title: string; body?: string; createdAt: string }>;
  upcomingEvents: Array<{ _id: string; title: string; date: string }>;
}
interface ReportTermData {
  [term: string]: Array<{ _id: string; subject: string; score: number; grade: string; date: string; term: string }>;
}
interface AttendanceData {
  summary: { totalDays: number; presentDays: number; absentDays: number; lateDays: number; percentage: number };
  records: Array<{ _id: string; date: string; status: "present" | "absent" | "late" }>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ParentDashboard() {
  const navigate = useNavigate();
  const [data,          setData]          = useState<ParentData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState(0);
  const [gradesOpen,    setGradesOpen]    = useState(true);
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;

  // Report Card dialog
  const [reportOpen,    setReportOpen]    = useState(false);
  const [reportData,    setReportData]    = useState<ReportTermData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Attendance dialog
  const [attendOpen,    setAttendOpen]    = useState(false);
  const [attendData,    setAttendData]    = useState<AttendanceData | null>(null);
  const [attendLoading, setAttendLoading] = useState(false);

  // Message Teacher dialog
  const [msgOpen,      setMsgOpen]      = useState(false);
  const [msgTeacherId, setMsgTeacherId] = useState("");
  const [msgBody,      setMsgBody]      = useState("");
  const [msgSending,   setMsgSending]   = useState(false);
  const [teachers,     setTeachers]     = useState<Array<{ _id: string; firstName: string; lastName: string; subject: string }>>([]);


  // Make Payment dialog
  const [payOpen,      setPayOpen]      = useState(false);
  const [payMethod,    setPayMethod]    = useState("");
  const [payAmount,    setPayAmount]    = useState("");
  const [payRef,       setPayRef]       = useState("");
  const [payNotes,     setPayNotes]     = useState("");
  const [paying,       setPaying]       = useState(false);
  const [payDone,      setPayDone]      = useState(false);
  const [payChildId,   setPayChildId]   = useState("");

  // ── Load Dashboard ─────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("token")) { navigate("/login"); return; }
      const res = await apiFetch("/parent-dashboard");
      setData(res.data);
    } catch (e: any) {
      if (e.message.includes("401") || e.message.toLowerCase().includes("token")) {
        navigate("/login");
      } else {
        setError(e.message);
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };


  // ── Make Payment ───────────────────────────────────────────────────────────
  const openPayDialog = (childId: string) => {
    setPayChildId(childId);
    setPayMethod(""); setPayAmount(""); setPayRef(""); setPayNotes(""); setPayDone(false);
    setPayOpen(true);
  };

  const handleMakePayment = async () => {
    if (!payMethod) { toast.error("Please select a payment method"); return; }
    if (!payAmount || isNaN(Number(payAmount)) || Number(payAmount) <= 0) {
      toast.error("Enter a valid amount"); return;
    }
    if (!payRef.trim()) { toast.error("Transaction reference is required"); return; }
    setPaying(true);
    try {
      const res = await apiFetch(`/parent-dashboard/child/${payChildId}/payment`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(payAmount), method: payMethod, reference: payRef, notes: payNotes }),
      });
      setPayDone(true);
      toast.success(`Payment of KSH ${Number(payAmount).toLocaleString()} recorded! Receipt: ${res.data?.receipt}`);
      loadDashboard();
      setTimeout(() => { setPayOpen(false); setPayDone(false); }, 2000);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPaying(false);
    }
  };

  // ── Report Card ────────────────────────────────────────────────────────────
  const openReportCard = async (childId: string) => {
    setReportOpen(true);
    setReportData(null);
    setReportLoading(true);
    try {
      const res = await apiFetch(`/parent-dashboard/child/${childId}/report-card`);
      setReportData(res.data);
    } catch (e: any) {
      toast.error(e.message);
      setReportOpen(false);
    } finally {
      setReportLoading(false);
    }
  };

  // ── Attendance ─────────────────────────────────────────────────────────────
  const openAttendance = async (childId: string) => {
    setAttendOpen(true);
    setAttendData(null);
    setAttendLoading(true);
    try {
      const res = await apiFetch(`/parent-dashboard/child/${childId}/attendance`);
      setAttendData(res.data);
    } catch (e: any) {
      toast.error(e.message);
      setAttendOpen(false);
    } finally {
      setAttendLoading(false);
    }
  };

  // ── Message Teacher ────────────────────────────────────────────────────────
  const openMessageTeacher = async () => {
    setMsgOpen(true);
    setMsgBody("");
    setMsgTeacherId("");
    try {
      const res = await apiFetch("/teachers");
      const list = Array.isArray(res) ? res : (res.data ?? res.teachers ?? []);
      setTeachers(list);
    } catch {
      // non-fatal — dropdown just stays empty
    }
  };

  const handleSendMessage = async () => {
    if (!msgTeacherId) { toast.error("Please select a teacher"); return; }
    if (!msgBody.trim()) { toast.error("Please write a message"); return; }

    const child = data!.children[selectedChild];
    setMsgSending(true);
    try {
      await apiFetch("/parent-dashboard/messages", {
        method: "POST",
        body: JSON.stringify({
          teacherId: msgTeacherId,
          studentId: child._id,
          body:      msgBody.trim(),
        }),
      });
      toast.success("Message sent successfully");
      setMsgOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setMsgSending(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-sm text-muted-foreground">{error ?? "Failed to load dashboard"}</p>
          <Button onClick={loadDashboard} className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );

  const { children, announcements } = data;
  const child = children[selectedChild];

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Parent Portal" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl">

        {/* Welcome */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Welcome! 👋</h1>
            <p className="text-muted-foreground mt-1 text-sm">Monitor your child's progress and stay connected.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {children.length === 0 ? (
          <Card className="border-border/50 mb-6">
            <CardContent className="pt-6 text-center space-y-2">
              <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No children linked to your account yet. Contact the admin.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Child selector */}
            {children.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {children.map((c, i) => (
                  <button key={c._id} onClick={() => setSelectedChild(i)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors",
                      i === selectedChild
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-border text-muted-foreground",
                    )}>
                    {c.firstName}
                  </button>
                ))}
              </div>
            )}

            {/* Child Overview */}
            <Card className="border-border/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <GraduationCap className="h-7 w-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold">{child.fullName}</h2>
                    <p className="text-sm text-muted-foreground">{child.class} • Adm: {child.admissionNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold">{child.avgScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className={cn("text-2xl font-bold capitalize",
                      child.fee.feeStatus === "cleared" ? "text-green-600"
                      : child.fee.feeStatus === "partial" ? "text-yellow-600" : "text-red-600")}>
                      {child.fee.feeStatus}
                    </p>
                    <p className="text-xs text-muted-foreground">Fees</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-2xl font-bold">{child.recentGrades.length}</p>
                    <p className="text-xs text-muted-foreground">Grades</p>
                  </div>
                </div>
                {child.fee.balance > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-700 dark:text-red-300 text-center">
                      Outstanding balance: <strong>KSH {child.fee.balance.toLocaleString()}</strong>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions — all functional */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="flex-col h-20 gap-2 text-xs"
                onClick={openMessageTeacher}>
                <MessageCircle className="h-5 w-5 text-accent" />Message Teacher
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-2 text-xs"
                onClick={() => openReportCard(child._id)}>
                <FileText className="h-5 w-5 text-accent" />Report Card
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-2 text-xs"
                onClick={() => openAttendance(child._id)}>
                <UserCheck className="h-5 w-5 text-accent" />Attendance
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-2 text-xs"
                onClick={() => openPayDialog(child._id)}>
                <CreditCard className="h-5 w-5 text-accent" />Make Payment
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
                <Link to={`/parent/academic-report/${child._id}`}>
                  <BarChart3 className="h-5 w-5 text-accent" />Academic Report
                </Link>
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
                <Link to="/parent/finance">
                  <DollarSign className="h-5 w-5 text-accent" />Fee Statement
                </Link>
              </Button>
            </div>

            {/* Recent Grades */}
            <Collapsible open={gradesOpen} onOpenChange={setGradesOpen} className="mb-4">
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer flex flex-row items-center justify-between py-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-5 w-5 text-accent" />Recent Grades
                    </CardTitle>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", gradesOpen && "rotate-180")} />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {child.recentGrades.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No grades recorded yet</p>
                    ) : child.recentGrades.map((g) => (
                      <div key={g._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{g.subject}</p>
                            <p className="text-xs text-muted-foreground">{new Date(g.date).toLocaleDateString()} · {g.term}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{g.score}%</p>
                            <p className="text-xs text-accent">{g.grade}</p>
                          </div>
                        </div>
                        <Progress value={g.score} className="h-2" />
                      </div>
                    ))}
                    {child.recentGrades.length > 0 && (
                      <Button variant="ghost" size="lg" className="w-full min-h-[48px] mt-2"
                        onClick={() => openReportCard(child._id)}>
                        View All Grades <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </>
        )}

        {/* Announcements */}
        <Card className="border-border/50">
          <CardHeader className="py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5 text-accent" />Announcements
              {announcements.filter(a => new Date(a.createdAt).getTime() > cutoff).length > 0 && (
                <span className="ml-1 rounded-full bg-accent/20 text-accent text-xs px-2 py-0.5">
                  {announcements.filter(a => new Date(a.createdAt).getTime() > cutoff).length} new
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {announcements.length === 0
              ? <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>
              : announcements.map(a => {
                const isNew = new Date(a.createdAt).getTime() > cutoff;
                return (
                  <div key={a._id} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm flex-1">{a.title}</p>
                      {isNew && <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs shrink-0">New</span>}
                    </div>
                    {a.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
          </CardContent>
        </Card>

      </main>

      {/* ── Message Teacher Dialog ─────────────────────────────────────────────── */}
      <Dialog open={msgOpen} onOpenChange={v => { if (!msgSending) setMsgOpen(v); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message a Teacher</DialogTitle>
            <DialogDescription>Send a message about {data?.children[selectedChild]?.firstName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Teacher *</Label>
              <Select value={msgTeacherId} onValueChange={setMsgTeacherId}>
                <SelectTrigger><SelectValue placeholder="Choose a teacher…" /></SelectTrigger>
                <SelectContent>
                  {teachers.map(t => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.firstName} {t.lastName} — {t.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea placeholder="Write your message here…" rows={4}
                value={msgBody} disabled={msgSending}
                onChange={e => setMsgBody(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMsgOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={msgSending} className="gap-2">
              {msgSending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
                : <><Send className="w-4 h-4" />Send Message</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Report Card Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />{child?.firstName}'s Report Card
            </DialogTitle>
            <DialogDescription>{child?.class}</DialogDescription>
          </DialogHeader>
          {reportLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : reportData && Object.keys(reportData).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No grades recorded yet</p>
          ) : reportData ? (
            <div className="space-y-6 py-2">
              {Object.entries(reportData).map(([term, grades]) => {
                const avg = Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length);
                return (
                  <div key={term}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">{term}</h3>
                      <Badge variant="secondary" className="bg-accent/20 text-accent">Avg: {avg}%</Badge>
                    </div>
                    <div className="space-y-3">
                      {grades.map(g => (
                        <div key={g._id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{g.subject}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{g.score}%</span>
                              <Badge className="text-xs bg-accent/10 text-accent border-0">{g.grade}</Badge>
                            </div>
                          </div>
                          <Progress value={g.score} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ── Attendance Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={attendOpen} onOpenChange={setAttendOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent" />{child?.firstName}'s Attendance
            </DialogTitle>
          </DialogHeader>
          {attendLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : attendData ? (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Rate",    value: `${attendData.summary.percentage}%`, color: "text-green-600" },
                  { label: "Present", value: attendData.summary.presentDays,      color: "text-green-600" },
                  { label: "Absent",  value: attendData.summary.absentDays,       color: "text-red-600" },
                  { label: "Late",    value: attendData.summary.lateDays,         color: "text-yellow-600" },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-lg bg-muted/30">
                    <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <Progress value={attendData.summary.percentage} className="h-2" />
              {attendData.records.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No attendance records yet</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Recent Records</p>
                  {attendData.records.slice(0, 20).map(r => (
                    <div key={r._id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{new Date(r.date).toLocaleDateString()}</span>
                      </div>
                      <Badge className={cn("text-xs border-0 capitalize",
                        r.status === "present" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : r.status === "absent" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300")}>
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>


      {/* ── Make Payment Dialog ─────────────────────────────────────────────── */}
      <Dialog open={payOpen} onOpenChange={v => { if (!paying) setPayOpen(v); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />Make a Payment
            </DialogTitle>
            <DialogDescription>
              Record a fee payment for {data?.children[selectedChild]?.firstName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select value={payMethod} onValueChange={setPayMethod} disabled={paying || payDone}>
                <SelectTrigger><SelectValue placeholder="Select payment method…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                  <SelectItem value="Equity Bank">Equity Bank</SelectItem>
                  <SelectItem value="KCB Bank">KCB Bank</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (KSH) *</Label>
              <Input type="number" placeholder="e.g. 5000" value={payAmount}
                onChange={e => setPayAmount(e.target.value)} disabled={paying || payDone}
                min={1} />
            </div>
            <div className="space-y-2">
              <Label>Transaction Reference *</Label>
              <Input placeholder={payMethod === "M-Pesa" ? "e.g. QJK872319" : "e.g. Ref No / Cheque No"}
                value={payRef} onChange={e => setPayRef(e.target.value)} disabled={paying || payDone} />
              <p className="text-xs text-muted-foreground">
                {payMethod === "M-Pesa" ? "Enter the M-Pesa confirmation code"
                  : payMethod === "Equity Bank" || payMethod === "KCB Bank" ? "Enter the bank transaction reference"
                  : "Enter a unique reference for this payment"}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input placeholder="e.g. Term 1 school fees" value={payNotes}
                onChange={e => setPayNotes(e.target.value)} disabled={paying || payDone} />
            </div>
            {payDone && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-3 py-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Payment recorded successfully!</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)} disabled={paying}>Cancel</Button>
            <Button onClick={handleMakePayment} disabled={paying || payDone} className="gap-2">
              {paying ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
                : payDone ? <><CheckCircle2 className="w-4 h-4" />Paid</>
                : <><CreditCard className="w-4 h-4" />Submit Payment</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
