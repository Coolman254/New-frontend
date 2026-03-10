import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { BarChart3, Loader2, Trophy, TrendingUp, TrendingDown, Download, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SubjectGrade { subject: string; score: number; grade: string; remarks?: string; }
interface ReportData {
  student:          { fullName: string; admissionNo: number; class: string };
  term:             string;
  year:             string;
  average:          number;
  position?:        number;
  totalStudents?:   number;
  grades:           SubjectGrade[];
  teacherRemark?:   string;
  principalRemark?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const gradeColor = (g: string) => {
  const u = g.toUpperCase();
  if (u.startsWith("A")) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
  if (u.startsWith("B")) return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
  if (u.startsWith("C")) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
  return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
};
const scoreColor = (s: number) => s >= 75 ? "text-green-600" : s >= 50 ? "text-yellow-600" : "text-red-600";
const perfLabel  = (s: number) => s >= 80 ? "Excellent" : s >= 65 ? "Good" : s >= 50 ? "Average" : "Needs Work";

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReportCardPage() {
  const navigate = useNavigate();
  const [data,      setData]      = useState<ReportData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [term,      setTerm]      = useState<string>("");
  const [allTerms,  setAllTerms]  = useState<string[]>([]);

  const loadTerm = useCallback(async (selectedTerm?: string) => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("studentToken")) { navigate("/student/login"); return; }

      // Fetch grades array + student info in parallel
      const [gradesRes, dashRes] = await Promise.all([
        apiFetch(
          `/student-dashboard/grades${selectedTerm ? `?term=${encodeURIComponent(selectedTerm)}` : ""}`,
          {}, "studentToken"
        ),
        apiFetch("/student-dashboard", {}, "studentToken"),
      ]);

      const gradesArray: any[] = gradesRes.data ?? [];
      const student            = dashRes.data?.student ?? {};

      // Derive available terms from all grades (fetch without filter for term list)
      const allGradesRes  = await apiFetch("/student-dashboard/grades", {}, "studentToken");
      const allGrades: any[] = allGradesRes.data ?? [];
      const terms = [...new Set(allGrades.map((g: any) => `${g.term} ${g.year}`))].sort();
      setAllTerms(terms);

      // Pick the active term
      const activeTerm = selectedTerm ?? (gradesArray[0] ? `${gradesArray[0].term} ${gradesArray[0].year}` : "");
      setTerm(activeTerm);

      // Filter to selected term if not already filtered
      const filtered = selectedTerm
        ? gradesArray
        : allGrades.filter((g: any) => `${g.term} ${g.year}` === activeTerm);

      // Compute average
      const average = filtered.length
        ? Math.round(filtered.reduce((s: number, g: any) => s + g.score, 0) / filtered.length)
        : 0;

      // Shape into the ReportData format the UI expects
      setData({
        student: {
          fullName:    student.fullName ?? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim(),
          admissionNo: student.admissionNo ?? 0,
          class:       student.class ?? "",
        },
        term:    activeTerm,
        year:    gradesArray[0]?.year ?? new Date().getFullYear().toString(),
        average,
        grades:  filtered.map((g: any) => ({
          subject: g.subject,
          score:   g.score,
          grade:   g.grade,
          remarks: g.remarks,
        })),
      });
    } catch (e: any) {
      if (e.message?.includes("401")) { localStorage.removeItem("studentToken"); navigate("/student/login"); }
      else { setError(e.message); toast.error(e.message); }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadTerm(); }, [loadTerm]);

  const handleTermChange = (t: string) => {
    setTerm(t);
    // t is like "Term 1 2025" — split into term + year for the API
    const parts     = t.split(" ");
    const year      = parts[parts.length - 1];
    const termPart  = parts.slice(0, -1).join(" ");
    loadTerm(`${termPart}&year=${year}`);
  };
  const handlePrint = () => window.print();

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading report card…</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-sm text-muted-foreground">{error ?? "No report data found"}</p>
          <Button onClick={() => loadTerm()} className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );

  const sorted = [...data.grades].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Report Card" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl space-y-4">

        {/* Heading */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-accent" />
            <h1 className="font-display text-2xl font-bold">Report Card</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
            <Download className="h-3.5 w-3.5" />Print
          </Button>
        </div>

        {/* Student info */}
        <Card className="border-border/50 bg-accent/5">
          <CardContent className="p-4">
            <p className="font-semibold">{data.student.fullName}</p>
            <p className="text-sm text-muted-foreground">{data.student.class} · Adm No. {data.student.admissionNo}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{data.year}</p>
          </CardContent>
        </Card>

        {/* Term selector – only shown when API returns multiple terms */}
        {allTerms.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allTerms.map(t => (
              <button key={t} onClick={() => handleTermChange(t)}
                className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  term === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}>
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className={cn("text-2xl font-bold", scoreColor(data.average))}>{data.average}%</p>
              <p className="text-xs text-muted-foreground mt-1">Average</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {data.position}<span className="text-sm text-muted-foreground">/{data.totalStudents}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Position</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Trophy className={cn("h-7 w-7 mx-auto mt-1", data.average >= 70 ? "text-yellow-500" : "text-muted-foreground")} />
              <p className="text-xs text-muted-foreground mt-1">{perfLabel(data.average)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Grades */}
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Subject Performance · {term}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {sorted.map((g, i) => (
              <div key={g.subject} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium">{g.subject}</p>
                    {i === 0 && <TrendingUp className="h-3.5 w-3.5 text-green-500" />}
                    {i === sorted.length - 1 && sorted.length > 1 && <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold", scoreColor(g.score))}>{g.score}%</span>
                    <Badge variant="outline" className={cn("text-xs border-0 min-w-[34px] justify-center", gradeColor(g.grade))}>
                      {g.grade}
                    </Badge>
                  </div>
                </div>
                <Progress value={g.score} className="h-1.5" />
                {g.remarks && <p className="text-xs text-muted-foreground italic">{g.remarks}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Remarks */}
        {(data.teacherRemark || data.principalRemark) && (
          <Card className="border-border/50">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Remarks</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {data.teacherRemark && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Class Teacher</p>
                  <p className="text-sm bg-muted/30 rounded-lg p-3 border border-border/50">{data.teacherRemark}</p>
                </div>
              )}
              {data.principalRemark && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Principal</p>
                  <p className="text-sm bg-muted/30 rounded-lg p-3 border border-border/50">{data.principalRemark}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </main>
      <BottomNav />
    </div>
  );
}
