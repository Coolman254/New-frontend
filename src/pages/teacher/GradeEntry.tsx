import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle, Search, Loader2, BarChart3, BookOpen,
  Users, GraduationCap, CheckCircle2, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface Student {
  _id: string; firstName: string; lastName: string;
  admissionNo: number; class: string;
}
interface GradeRecord {
  _id: string; subject: string; score: number; grade: string;
  term: string; year: string; examType: string; date: string; remarks?: string;
  student: { _id: string; firstName: string; lastName: string; admissionNo: number; class: string };
}
interface TeacherInfo {
  subject: string; classesAssigned: string[];
}

const gradeColor = (s: number) => s >= 80 ? "bg-green-100 text-green-800" : s >= 60 ? "bg-blue-100 text-blue-800" : s >= 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

const CURRENT_YEAR = String(new Date().getFullYear());

export default function TeacherGradeEntry() {
  const navigate = useNavigate();

  const [teacher,   setTeacher]   = useState<TeacherInfo | null>(null);
  const [students,  setStudents]  = useState<Student[]>([]);
  const [grades,    setGrades]    = useState<GradeRecord[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filterCls, setFilterCls] = useState("all");
  const [filterTerm, setFilterTerm] = useState("all");

  // Grade form dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [done,       setDone]       = useState(false);
  const emptyForm = {
    studentId: "", subject: "", score: "", term: "Term 1",
    year: CURRENT_YEAR, examType: "End Term", date: new Date().toISOString().split("T")[0], remarks: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!localStorage.getItem("token")) { navigate("/login"); return; }
      const [dashRes, stuRes, gradeRes] = await Promise.all([
        apiFetch("/teacher-dashboard"),
        apiFetch("/teacher-dashboard/students"),
        apiFetch("/teacher-dashboard/grades"),
      ]);
      setTeacher(dashRes.data?.teacher ?? null);
      setStudents(stuRes.data ?? []);
      setGrades(gradeRes.data ?? []);
      setForm(f => ({ ...f, subject: dashRes.data?.teacher?.subject ?? "" }));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentId)        e.studentId = "Select a student";
    if (!form.subject.trim())   e.subject   = "Subject is required";
    if (!form.score)            e.score     = "Score is required";
    else if (isNaN(Number(form.score)) || Number(form.score) < 0 || Number(form.score) > 100)
      e.score = "Score must be 0–100";
    if (!form.term)             e.term      = "Term is required";
    if (!form.year.trim())      e.year      = "Year is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await apiFetch("/teacher-dashboard/grades", {
        method: "POST",
        body: JSON.stringify({ ...form, score: Number(form.score) }),
      });
      setDone(true);
      toast.success("Grade entered successfully");
      load();
      setTimeout(() => { setDialogOpen(false); setDone(false); setForm({ ...emptyForm, subject: teacher?.subject ?? "" }); }, 1500);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const openDialog = (studentId = "") => {
    setForm({ ...emptyForm, subject: teacher?.subject ?? "", studentId });
    setFormErrors({});
    setDone(false);
    setDialogOpen(true);
  };

  const classes = teacher?.classesAssigned ?? [];
  const filteredStudents = students.filter(s =>
    (filterCls === "all" || s.class === filterCls) &&
    (`${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
     String(s.admissionNo).includes(search))
  );
  const filteredGrades = grades.filter(g =>
    (filterTerm === "all" || g.term === filterTerm) &&
    (filterCls === "all" || g.student?.class === filterCls)
  );

  const avg = grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const content = (
    <div style={{ fontFamily: "Times New Roman, Times, serif", fontSize: 12 }}>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Students",     value: students.length,      icon: Users,         bg: "bg-blue-50",   color: "text-blue-600" },
          { label: "Grades Entered", value: grades.length,      icon: BarChart3,     bg: "bg-green-50",  color: "text-green-600" },
          { label: "Avg Score",    value: `${avg}%`,            icon: GraduationCap, bg: "bg-purple-50", color: "text-purple-600" },
          { label: "Classes",      value: classes.length,       icon: BookOpen,      bg: "bg-orange-50", color: "text-orange-600" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students Table with Enter Grade per student */}
      <Card className="border-border/50 mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />My Students
              </CardTitle>
              <CardDescription>{filteredStudents.length} students</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search student…" value={search}
                  onChange={e => setSearch(e.target.value)} className="pl-8 w-48" />
              </div>
              <Select value={filterCls} onValueChange={setFilterCls}>
                <SelectTrigger className="w-36"><SelectValue placeholder="All Classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => openDialog()} className="gap-2">
                <PlusCircle className="h-4 w-4" />Enter Grade
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Adm No.</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.map(s => (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                      <TableCell className="text-muted-foreground">{s.admissionNo}</TableCell>
                      <TableCell><Badge variant="outline">{s.class}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => openDialog(s._id)}
                          className="gap-1 text-xs">
                          <PlusCircle className="h-3 w-3" />Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Records */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />Grade Records
              </CardTitle>
              <CardDescription>{filteredGrades.length} records</CardDescription>
            </div>
            <Select value={filterTerm} onValueChange={setFilterTerm}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Terms" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      No grade records yet. Click "Enter Grade" to add grades.
                    </TableCell>
                  </TableRow>
                ) : filteredGrades.map(g => (
                  <TableRow key={g._id}>
                    <TableCell className="font-medium">
                      {g.student?.firstName} {g.student?.lastName}
                      <span className="block text-xs text-muted-foreground">{g.student?.class}</span>
                    </TableCell>
                    <TableCell>{g.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{g.term}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{g.examType}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold">{g.score}%</span>
                        <Badge className={cn("text-xs", gradeColor(g.score))}>{g.grade}</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={v => { if (!saving) { setDialogOpen(v); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-accent" />Enter Grade
            </DialogTitle>
            <DialogDescription>Record a student's exam or assessment score</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">

            <div className="space-y-2">
              <Label>Student *</Label>
              <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}
                disabled={saving || done}>
                <SelectTrigger><SelectValue placeholder="Select student…" /></SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.firstName} {s.lastName} — {s.class} ({s.admissionNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.studentId && <p className="text-xs text-red-500">{formErrors.studentId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Mathematics" disabled={saving || done} />
                {formErrors.subject && <p className="text-xs text-red-500">{formErrors.subject}</p>}
              </div>
              <div className="space-y-2">
                <Label>Score (0–100) *</Label>
                <Input type="number" min={0} max={100} value={form.score}
                  onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                  placeholder="e.g. 78" disabled={saving || done} />
                {formErrors.score && <p className="text-xs text-red-500">{formErrors.score}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Term *</Label>
                <Select value={form.term} onValueChange={v => setForm(f => ({ ...f, term: v }))}
                  disabled={saving || done}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.term && <p className="text-xs text-red-500">{formErrors.term}</p>}
              </div>
              <div className="space-y-2">
                <Label>Year *</Label>
                <Input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2025" disabled={saving || done} />
                {formErrors.year && <p className="text-xs text-red-500">{formErrors.year}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select value={form.examType} onValueChange={v => setForm(f => ({ ...f, examType: v }))}
                  disabled={saving || done}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="End Term">End Term</SelectItem>
                    <SelectItem value="Mid Term">Mid Term</SelectItem>
                    <SelectItem value="CAT">CAT</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  disabled={saving || done} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Remarks <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea placeholder="e.g. Excellent work, needs improvement in…" rows={2}
                value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                disabled={saving || done} className="resize-none" />
            </div>

            {form.score && !isNaN(Number(form.score)) && (
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Grade Preview</span>
                  <Badge className={cn("font-bold", gradeColor(Number(form.score)))}>
                    {Number(form.score) >= 90 ? "A"
                      : Number(form.score) >= 80 ? "A-"
                      : Number(form.score) >= 75 ? "B+"
                      : Number(form.score) >= 70 ? "B"
                      : Number(form.score) >= 65 ? "B-"
                      : Number(form.score) >= 60 ? "C+"
                      : Number(form.score) >= 55 ? "C"
                      : Number(form.score) >= 50 ? "C-"
                      : Number(form.score) >= 45 ? "D+"
                      : Number(form.score) >= 40 ? "D" : "E"}
                  </Badge>
                </div>
                <Progress value={Number(form.score)} className="h-2" />
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 px-3 py-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Grade saved successfully!</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || done} className="gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : done ? <><CheckCircle2 className="w-4 h-4" />Saved!</>
                : <><PlusCircle className="w-4 h-4" />Save Grade</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Use AdminLayout on desktop
  if (typeof window !== "undefined" && window.innerWidth >= 768) {
    return (
      <AdminLayout title="Grade Entry" subtitle="Enter and manage student grades across subjects and terms.">
        {content}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Grade Entry" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">{content}</main>
      <BottomNav />
    </div>
  );
}
