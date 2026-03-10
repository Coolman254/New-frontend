import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BarChart3, ChevronDown, Loader2, AlertCircle, Trophy,
  BookOpen, TrendingUp, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface GradeRecord {
  _id: string; subject: string; score: number; grade: string;
  term: string; year: string; examType: string; date: string; remarks?: string;
}
interface TermSummary {
  term: string; avg: number; grades: GradeRecord[];
}
interface ReportData {
  student: { _id: string; fullName: string; class: string; admissionNo: number };
  overallAvg: number;
  termSummaries: TermSummary[];
  allGrades: GradeRecord[];
}

const gradeColor = (score: number) => {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
};

const gradeBadgeClass = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (score >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (score >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};

export default function ParentAcademicReport() {
  const { childId } = useParams<{ childId: string }>();
  const navigate    = useNavigate();

  const [data,    setData]    = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [openTerms, setOpenTerms] = useState<Record<string, boolean>>({});
  const [filterSubject, setFilterSubject] = useState("all");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("token")) { navigate("/login"); return; }
      const res = await apiFetch(`/parent-dashboard/child/${childId}/academic-report`);
      setData(res.data);
      // Default: open first term
      if (res.data?.termSummaries?.length) {
        setOpenTerms({ [res.data.termSummaries[0].term]: true });
      }
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [childId, navigate]);

  useEffect(() => { load(); }, [load]);

  const subjects = data
    ? [...new Set(data.allGrades.map((g) => g.subject))].sort()
    : [];

  const filteredSummaries = data?.termSummaries.map((ts) => ({
    ...ts,
    grades: filterSubject === "all" ? ts.grades : ts.grades.filter((g) => g.subject === filterSubject),
  })) ?? [];

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-sm text-muted-foreground">{error ?? "Failed to load report"}</p>
          <Button onClick={load} className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );

  const { student, overallAvg, termSummaries } = data;

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12 }}>
      <MobileHeader title="Academic Report" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">

        {/* Student Header */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.fullName}</h2>
              <p className="text-white/80 text-sm">{student.class} · Adm No. {student.admissionNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Overall Avg", value: `${overallAvg}%`, icon: Trophy },
              { label: "Terms",       value: termSummaries.length, icon: BookOpen },
              { label: "Subjects",    value: subjects.length, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
                <Icon className="h-4 w-4 mx-auto mb-1 text-white/80" />
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        {subjects.length > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">Filter:</span>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Term Sections */}
        {filteredSummaries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No grades recorded yet</p>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((ts) => (
            <Collapsible
              key={ts.term}
              open={openTerms[ts.term]}
              onOpenChange={(v) => setOpenTerms((o) => ({ ...o, [ts.term]: v }))}
              className="mb-3"
            >
              <Card className="border-border/50 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ background: gradeColor(ts.avg) + "20" }}>
                          <BarChart3 className="h-4 w-4" style={{ color: gradeColor(ts.avg) }} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{ts.term}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {ts.grades.length} subject{ts.grades.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={cn("text-sm font-bold px-3", gradeBadgeClass(ts.avg))}>
                          {ts.avg}%
                        </Badge>
                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          openTerms[ts.term] && "rotate-180"
                        )} />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4 pb-4">
                    {ts.grades.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No grades for this filter in {ts.term}
                      </p>
                    ) : (
                      ts.grades.map((g) => (
                        <div key={g._id} className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/40">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{g.subject}</p>
                              <p className="text-xs text-muted-foreground">
                                {g.examType} · {new Date(g.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{g.score}%</p>
                              <Badge className={cn("text-xs", gradeBadgeClass(g.score))}>
                                {g.grade}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={g.score} className="h-2"
                            style={{ "--progress-background": gradeColor(g.score) } as React.CSSProperties} />
                          {g.remarks && (
                            <p className="text-xs text-muted-foreground italic">
                              Remarks: {g.remarks}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </main>
      <BottomNav />
    </div>
  );
}
