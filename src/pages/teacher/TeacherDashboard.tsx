import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Link, useNavigate } from "react-router-dom";
import {
  Users, BookOpen, BarChart3, Calendar, FileText, Clock,
  Upload, PlusCircle, ChevronDown, Plus, DollarSign,
  Loader2, AlertCircle, LogOut, Bell, X, FileUp, CheckCircle2,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────
interface TeacherData {
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    teacherId: number;
    subject: string;
    classesAssigned: string[];
    email: string;
  };
  stats: {
    totalStudents: number;
    totalClasses: number;
    pendingReview: number;
    totalAssignments: number;
  };
  classes: Array<{ name: string; subject: string; students: number }>;
  upcomingTasks: Array<{
    _id: string;
    title: string;
    subject: string;
    class: string;
    dueDate: string;
    due: string;
    priority: "high" | "medium";
  }>;
  upcomingAssignments: Array<{
    _id: string;
    title: string;
    subject: string;
    class: string;
    dueDate: string;
    description?: string;
  }>;
  announcements: Array<{
    _id: string;
    title: string;
    body?: string;
    createdAt: string;
  }>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [data,    setData]    = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const [classesOpen,       setClassesOpen]       = useState(true);
  const [announcementsOpen, setAnnouncementsOpen] = useState(true);

  // ── Assignment Dialog ──────────────────────────────────────────────────────
  const [assignDialog, setAssignDialog] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const emptyAssign = { title: "", subject: "", class: "", dueDate: "", description: "" };
  const [assignForm, setAssignForm] = useState(emptyAssign);

  // ── Upload Materials Dialog ────────────────────────────────────────────────
  const [uploadDialog,   setUploadDialog]   = useState(false);
  const [uploadClass,    setUploadClass]    = useState("");        // pre-selected class (from per-class button)
  const [uploadTitle,    setUploadTitle]    = useState("");
  const [uploadSubject,  setUploadSubject]  = useState("");
  const [uploadDesc,     setUploadDesc]     = useState("");
  const [uploadFile,     setUploadFile]     = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading,      setUploading]      = useState(false);
  const [uploadDone,     setUploadDone]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load Dashboard ─────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("token")) { navigate("/login"); return; }
      const res = await apiFetch("/teacher-dashboard");
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

  // ── Sync assignment subject from teacher profile ───────────────────────────
  useEffect(() => {
    if (data) setAssignForm(f => ({ ...f, subject: data.teacher.subject }));
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ── Create Assignment ──────────────────────────────────────────────────────
  const handleCreateAssignment = async () => {
    if (!assignForm.title || !assignForm.subject || !assignForm.class || !assignForm.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/teacher-dashboard/assignments", {
        method: "POST",
        body: JSON.stringify(assignForm),
      });
      toast.success("Assignment created successfully");
      setAssignDialog(false);
      setAssignForm({ ...emptyAssign, subject: data?.teacher.subject ?? "" });
      loadDashboard();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Open Upload Dialog (optionally pre-selecting a class) ──────────────────
  const openUploadDialog = (className = "") => {
    setUploadClass(className);
    setUploadTitle("");
    setUploadSubject(data?.teacher.subject ?? "");
    setUploadDesc("");
    setUploadFile(null);
    setUploadProgress(0);
    setUploadDone(false);
    setUploadDialog(true);
  };

  // ── File selection ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Please upload PDF, Word, PowerPoint, image, or video.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 50 MB.");
      return;
    }
    setUploadFile(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type.");
      return;
    }
    setUploadFile(file);
  };

  // ── Upload Materials ───────────────────────────────────────────────────────
  const handleUploadMaterials = async () => {
    if (!uploadTitle.trim()) { toast.error("Title is required"); return; }
    if (!uploadClass)        { toast.error("Please select a class"); return; }
    if (!uploadFile)         { toast.error("Please select a file to upload"); return; }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file",    uploadFile);
      formData.append("title",   uploadTitle);
      formData.append("subject", uploadSubject);
      formData.append("class",   uploadClass);
      formData.append("description", uploadDesc);

      // Use XMLHttpRequest for real upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const token = localStorage.getItem("token");

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            try {
              const body = JSON.parse(xhr.responseText);
              reject(new Error(body.message ?? "Upload failed"));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));

        const baseUrl = (import.meta as any).env?.VITE_API_URL ?? "";
        xhr.open("POST", `${baseUrl}/api/teacher-dashboard/materials`);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });

      setUploadDone(true);
      setUploadProgress(100);
      toast.success(`"${uploadTitle}" uploaded successfully`);
      loadDashboard();

      // Auto-close after brief success state
      setTimeout(() => {
        setUploadDialog(false);
        setUploadDone(false);
      }, 1500);
    } catch (e: any) {
      toast.error(e.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
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

  const { teacher, stats, classes, upcomingTasks, announcements } = data;

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Teacher Portal" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Welcome, {teacher.firstName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {teacher.subject} · ID {teacher.teacherId}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Students",    value: stats.totalStudents,    icon: Users,    bg: "bg-info/10",    color: "text-info" },
            { label: "Classes",     value: stats.totalClasses,     icon: BookOpen, bg: "bg-success/10", color: "text-success" },
            { label: "To Review",   value: stats.pendingReview,    icon: FileText, bg: "bg-warning/10", color: "text-warning" },
            { label: "Assignments", value: stats.totalAssignments, icon: Calendar, bg: "bg-accent/10",  color: "text-accent" },
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="flex-col h-20 gap-2 text-xs"
            onClick={() => openUploadDialog()}
          >
            <Upload className="h-5 w-5 text-accent" />Upload Materials
          </Button>
          <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
            <Link to="/teacher/grades">
              <BarChart3 className="h-5 w-5 text-accent" />Enter Grades
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-20 gap-2 text-xs"
            onClick={() => setAssignDialog(true)}
          >
            <PlusCircle className="h-5 w-5 text-accent" />Assignment
          </Button>
          <Button variant="outline" className="flex-col h-20 gap-2 text-xs" asChild>
            <Link to="/teacher/finance">
              <DollarSign className="h-5 w-5 text-accent" />Fee Status
            </Link>
          </Button>
        </div>

        {/* Upcoming Tasks */}
        <Card className="border-border/50 mb-4">
          <CardHeader className="py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-accent" />Upcoming Tasks
              {upcomingTasks.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-accent/20 text-accent text-xs">
                  {upcomingTasks.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {upcomingTasks.length === 0
              ? <p className="text-sm text-muted-foreground text-center py-4">No upcoming tasks 🎉</p>
              : upcomingTasks.map(task => (
                <div key={task._id} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.subject} · {task.class}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs shrink-0",
                      task.priority === "high"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-warning/20 text-warning",
                    )}>
                      {task.due}
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* My Classes */}
        <Collapsible open={classesOpen} onOpenChange={setClassesOpen} className="mb-4">
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-accent" />My Classes
                  <Badge variant="secondary" className="ml-1 bg-accent/20 text-accent text-xs">
                    {classes.length}
                  </Badge>
                </CardTitle>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  classesOpen && "rotate-180",
                )} />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {classes.length === 0
                  ? <p className="text-sm text-muted-foreground text-center py-4">No classes assigned yet</p>
                  : classes.map((cls, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                      <div className="mb-3">
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cls.subject} · {cls.students} students
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="lg" variant="outline" className="flex-1 min-h-[48px]" asChild>
                          <Link to={`/teacher/grades?class=${encodeURIComponent(cls.name)}`}>
                            <BarChart3 className="h-4 w-4 mr-2" />Grades
                          </Link>
                        </Button>
                        {/* Per-class Upload Materials — pre-selects this class */}
                        <Button
                          size="lg"
                          variant="outline"
                          className="flex-1 min-h-[48px]"
                          onClick={() => openUploadDialog(cls.name)}
                        >
                          <Upload className="h-4 w-4 mr-2" />Materials
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Announcements */}
        <Collapsible open={announcementsOpen} onOpenChange={setAnnouncementsOpen}>
          <Card className="border-border/50">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-5 w-5 text-accent" />Announcements
                </CardTitle>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  announcementsOpen && "rotate-180",
                )} />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {announcements.length === 0
                  ? <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>
                  : announcements.map(a => (
                    <div key={a._id} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                      <p className="font-medium text-sm">{a.title}</p>
                      {a.body && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

      </main>

      {/* ── Create Assignment Dialog ───────────────────────────────────────────── */}
      <Dialog open={assignDialog} onOpenChange={v => {
        setAssignDialog(v);
        if (!v) setAssignForm({ ...emptyAssign, subject: teacher.subject });
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>Add a new assignment for your students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Algebra Exercise 5"
                value={assignForm.title}
                onChange={e => setAssignForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  placeholder="e.g. Mathematics"
                  value={assignForm.subject}
                  onChange={e => setAssignForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select
                  value={assignForm.class}
                  onValueChange={v => setAssignForm(f => ({ ...f, class: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {teacher.classesAssigned.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={assignForm.dueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setAssignForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Instructions or details for students…"
                value={assignForm.description}
                rows={3}
                onChange={e => setAssignForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateAssignment} disabled={submitting}>
              {submitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</>
                : "Create Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Upload Materials Dialog ────────────────────────────────────────────── */}
      <Dialog open={uploadDialog} onOpenChange={v => {
        if (!uploading) { setUploadDialog(v); setUploadDone(false); }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Materials</DialogTitle>
            <DialogDescription>
              Share notes, slides, worksheets, or videos with your students
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Chapter 5 Notes"
                value={uploadTitle}
                disabled={uploading || uploadDone}
                onChange={e => setUploadTitle(e.target.value)}
              />
            </div>

            {/* Subject + Class */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Subject"
                  value={uploadSubject}
                  disabled={uploading || uploadDone}
                  onChange={e => setUploadSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select
                  value={uploadClass}
                  disabled={uploading || uploadDone}
                  onValueChange={setUploadClass}
                >
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {teacher.classesAssigned.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional notes for students…"
                value={uploadDesc}
                rows={2}
                disabled={uploading || uploadDone}
                onChange={e => setUploadDesc(e.target.value)}
              />
            </div>

            {/* Drop Zone */}
            <div className="space-y-2">
              <Label>File *</Label>
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => !uploading && !uploadDone && fileInputRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
                  uploadFile
                    ? "border-accent/50 bg-accent/5"
                    : "border-border hover:border-accent/40 hover:bg-muted/30",
                  (uploading || uploadDone) && "pointer-events-none opacity-60",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={handleFileChange}
                />
                {uploadFile ? (
                  <>
                    <FileUp className="h-8 w-8 text-accent" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate max-w-[200px]">{uploadFile.name}</span>
                      {!uploading && !uploadDone && (
                        <button
                          onClick={e => { e.stopPropagation(); setUploadFile(null); setUploadProgress(0); }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatBytes(uploadFile.size)}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click or drag to upload</p>
                    <p className="text-xs text-muted-foreground">PDF, Word, PowerPoint, Image, Video — max 50 MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {(uploading || uploadDone) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{uploadDone ? "Upload complete" : "Uploading…"}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                {uploadDone && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>File saved successfully</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => setUploadDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadMaterials}
              disabled={uploading || uploadDone || !uploadFile}
            >
              {uploading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</>
                : uploadDone
                ? <><CheckCircle2 className="w-4 h-4 mr-2" />Done</>
                : <><FileUp className="w-4 h-4 mr-2" />Upload</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FloatingActionButton aria-label="Create assignment" onClick={() => setAssignDialog(true)}>
        <Plus className="h-6 w-6" />
      </FloatingActionButton>
      <BottomNav />
    </div>
  );
}
