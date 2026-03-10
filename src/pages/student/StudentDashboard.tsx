import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, BarChart3, Bell, FileText, Clock, ChevronRight,
  Download, Trophy, ChevronDown, DollarSign, Loader2,
  AlertCircle, CheckCircle, LogOut, Send, Paperclip, X,
  CheckCircle2, FileUp,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────
interface DashboardData {
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    admissionNo: number;
    class: string;
    email: string;
  };
  stats: { average: number; pendingAssignments: number; subjectCount: number };
  recentGrades: Array<{
    _id: string; subject: string; score: number; grade: string; date: string; term: string;
  }>;
  upcomingAssignments: Array<{
    _id: string; title: string; subject: string; dueDate: string;
    description?: string; submitted?: boolean;
  }>;
  announcements: Array<{ _id: string; title: string; body?: string; createdAt: string }>;
  finance: {
    totalFees: number; amountPaid: number; balance: number;
    feeStatus: "cleared" | "partial" | "pending";
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function dueDateLabel(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff === 0)  return "Due today";
  if (diff === 1)  return "Due tomorrow";
  if (diff < 0)   return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""}`;
  return `In ${diff} days`;
}
function dueDateColor(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff <= 0) return "text-red-500";
  if (diff <= 2) return "text-yellow-500";
  return "text-muted-foreground";
}
const formatBytes = (b: number) => b < 1024 * 1024
  ? `${(b / 1024).toFixed(1)} KB`
  : `${(b / (1024 * 1024)).toFixed(1)} MB`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [gradesOpen,      setGradesOpen]      = useState(true);
  const [assignmentsOpen, setAssignmentsOpen] = useState(true);

  // ── Assignment Submission Dialog ───────────────────────────────────────────
  const [submitOpen,       setSubmitOpen]       = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<DashboardData["upcomingAssignments"][0] | null>(null);
  const [submissionText,   setSubmissionText]   = useState("");
  const [submissionFile,   setSubmissionFile]   = useState<File | null>(null);
  const [submitting,       setSubmitting]       = useState(false);
  const [submitDone,       setSubmitDone]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load Dashboard ─────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("studentToken")) { navigate("/student/login"); return; }
      const res = await apiFetch("/student-dashboard", {}, "studentToken");
      setData(res.data);
    } catch (e: any) {
      if (e.message.includes("401") || e.message.toLowerCase().includes("token")) {
        localStorage.removeItem("studentToken");
        navigate("/student/login");
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
    localStorage.removeItem("studentToken");
    navigate("/student/login");
  };

  // ── Open submission dialog ─────────────────────────────────────────────────
  const openSubmitDialog = (assignment: DashboardData["upcomingAssignments"][0]) => {
    setActiveAssignment(assignment);
    setSubmissionText("");
    setSubmissionFile(null);
    setSubmitDone(false);
    setSubmitOpen(true);
  };

  // ── Handle file pick ───────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large. Max 20 MB."); return;
    }
    setSubmissionFile(file);
  };

  // ── Submit assignment ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!submissionText.trim() && !submissionFile) {
      toast.error("Please write a response or attach a file"); return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", activeAssignment!._id);
      formData.append("answer", submissionText);
      if (submissionFile) formData.append("file", submissionFile);

      const token    = localStorage.getItem("studentToken");
      const baseUrl  = (import.meta as any).env?.VITE_API_URL ?? "";
      const response = await fetch(
        `${baseUrl}/api/student-dashboard/assignments/${activeAssignment!._id}/submit`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? "Submission failed");
      }

      setSubmitDone(true);
      toast.success("Assignment submitted successfully!");
      loadDashboard(); // refresh so submitted badge shows

      setTimeout(() => {
        setSubmitOpen(false);
        setSubmitDone(false);
      }, 1800);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
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

  const { student, stats, recentGrades, upcomingAssignments, announcements, finance } = data;
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Student Portal" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Welcome back, {student.firstName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {student.class} · Adm No. {student.admissionNo}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Average",  value: `${stats.average}%`,     icon: Trophy,   bg: "bg-info/10",    color: "text-info" },
            { label: "Pending",  value: stats.pendingAssignments, icon: FileText, bg: "bg-success/10", color: "text-success" },
            { label: "Subjects", value: stats.subjectCount,       icon: BookOpen, bg: "bg-primary/10", color: "text-primary" },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <Card key={label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg)}>
                    <Icon className={cn("h-5 w-5", color)} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card
            className="border-border/50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/student/finance")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  finance.feeStatus === "cleared" ? "bg-green-100" : finance.feeStatus === "partial" ? "bg-yellow-100" : "bg-red-100",
                )}>
                  {finance.feeStatus === "cleared"
                    ? <CheckCircle className="h-5 w-5 text-green-600" />
                    : <DollarSign className={cn("h-5 w-5", finance.feeStatus === "partial" ? "text-yellow-600" : "text-red-600")} />}
                </div>
                <div>
                  <p className="text-xl font-bold capitalize">{finance.feeStatus}</p>
                  <p className="text-xs text-muted-foreground">Fee Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
            <Link to="/student/materials">
              <BookOpen className="h-5 w-5 text-accent" />Materials
            </Link>
          </Button>
          <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
            <Link to="/student/notes">
              <Download className="h-5 w-5 text-accent" />Notes
            </Link>
          </Button>
          <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
            <Link to="/student/report-card">
              <BarChart3 className="h-5 w-5 text-accent" />Report Card
            </Link>
          </Button>
          <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
            <Link to="/student/finance">
              <DollarSign className="h-5 w-5 text-accent" />Fee Status
            </Link>
          </Button>
        </div>

        {/* Fee Banner */}
        {finance.balance > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 mb-4">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">Outstanding Balance</p>
                  <p className="text-xs text-red-600">KSH {finance.balance.toLocaleString()} remaining</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-red-300 text-red-700 shrink-0" asChild>
                <Link to="/student/finance">View</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Assignments */}
        <Collapsible open={assignmentsOpen} onOpenChange={setAssignmentsOpen} className="mb-4">
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5 text-accent" />Upcoming Assignments
                  {upcomingAssignments.length > 0 && (
                    <span className="ml-1 rounded-full bg-accent/20 text-accent text-xs px-2 py-0.5">
                      {upcomingAssignments.length}
                    </span>
                  )}
                </CardTitle>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  assignmentsOpen && "rotate-180",
                )} />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {upcomingAssignments.length === 0
                  ? <p className="text-sm text-muted-foreground text-center py-4">No upcoming assignments 🎉</p>
                  : upcomingAssignments.map(a => (
                    <div key={a._id} className="flex flex-col gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">{a.title}</p>
                          {a.submitted && (
                            <Badge className="shrink-0 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0 text-xs gap-1">
                              <CheckCircle2 className="h-3 w-3" />Submitted
                            </Badge>
                          )}
                        </div>
                        <p className={cn("text-xs mt-1", dueDateColor(a.dueDate))}>
                          {a.subject} · {dueDateLabel(a.dueDate)}
                        </p>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                        )}
                      </div>
                      {a.submitted ? (
                        <Button size="lg" variant="outline" disabled className="w-full min-h-[48px] gap-2 opacity-60">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />Already Submitted
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="w-full min-h-[48px] gap-2"
                          onClick={() => openSubmitDialog(a)}
                        >
                          <Send className="h-4 w-4" />Start Assignment
                        </Button>
                      )}
                    </div>
                  ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Recent Grades */}
        <Collapsible open={gradesOpen} onOpenChange={setGradesOpen} className="mb-4">
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-accent" />Recent Grades
                </CardTitle>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  gradesOpen && "rotate-180",
                )} />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {recentGrades.length === 0
                  ? <p className="text-sm text-muted-foreground text-center py-4">No grades recorded yet</p>
                  : recentGrades.map(g => (
                    <div key={g._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{g.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(g.date).toLocaleDateString()} · {g.term}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{g.score}%</p>
                          <p className="text-xs text-accent">{g.grade}</p>
                        </div>
                      </div>
                      <Progress value={g.score} className="h-2" />
                    </div>
                  ))}
                {recentGrades.length > 0 && (
                  <Button variant="ghost" size="lg" className="w-full min-h-[48px] mt-2" asChild>
                    <Link to="/student/report-card">
                      View All Grades <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

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
                      {isNew && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs shrink-0">New</span>
                      )}
                    </div>
                    {a.body && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
          </CardContent>
        </Card>

      </main>

      {/* ── Assignment Submission Dialog ───────────────────────────────────────── */}
      <Dialog open={submitOpen} onOpenChange={v => { if (!submitting) { setSubmitOpen(v); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="line-clamp-2">{activeAssignment?.title}</DialogTitle>
            <DialogDescription>
              {activeAssignment?.subject} · {activeAssignment && dueDateLabel(activeAssignment.dueDate)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Assignment brief */}
            {activeAssignment?.description && (
              <div className="rounded-lg bg-muted/40 border border-border/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Instructions</p>
                <p className="text-sm">{activeAssignment.description}</p>
              </div>
            )}

            {/* Text answer */}
            <div className="space-y-2">
              <Label>Your Answer</Label>
              <Textarea
                placeholder="Write your answer here…"
                rows={5}
                value={submissionText}
                disabled={submitting || submitDone}
                onChange={e => setSubmissionText(e.target.value)}
                className="resize-none"
              />
            </div>

            {/* File attachment */}
            <div className="space-y-2">
              <Label>Attach File <span className="text-muted-foreground font-normal">(optional, max 20 MB)</span></Label>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {submissionFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
                  <FileUp className="h-5 w-5 text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{submissionFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(submissionFile.size)}</p>
                  </div>
                  {!submitting && !submitDone && (
                    <button
                      onClick={() => setSubmissionFile(null)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  disabled={submitting || submitDone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />Attach a file
                </Button>
              )}
            </div>

            {/* Success state */}
            {submitDone && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-3 py-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Submitted successfully!
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={submitting}
              onClick={() => setSubmitOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || submitDone}
              className="gap-2"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                : submitDone
                ? <><CheckCircle2 className="w-4 h-4" />Submitted</>
                : <><Send className="w-4 h-4" />Submit</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
