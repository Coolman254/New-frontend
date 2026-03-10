import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { BookMarked, FileDown, Search, FolderOpen, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch, BASE } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Note {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  fileType: string;
  fileSize?: number;
  term?: string;
  createdAt: string;  // Mongoose timestamps
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NotesPage() {
  const navigate = useNavigate();
  const [notes,   setNotes]   = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [subject, setSubject] = useState("All");
  const [term,    setTerm]    = useState("All");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("studentToken")) { navigate("/student/login"); return; }
      const res = await apiFetch("/student-dashboard/materials", {}, "studentToken");
      setNotes(res.data ?? []);
    } catch (e: any) {
      if (e.message?.includes("401")) {
        localStorage.removeItem("studentToken"); navigate("/student/login");
      } else {
        setError(e.message); toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const subjects = ["All", ...Array.from(new Set(notes.map(n => n.subject))).sort()];
  const terms    = ["All", ...Array.from(new Set(notes.filter(n => n.term).map(n => n.term!))).sort()];

  const filtered = notes.filter(n => {
    const matchSub    = subject === "All" || n.subject === subject;
    const matchTerm   = term    === "All" || n.term    === term;
    const matchSearch = !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchTerm && matchSearch;
  });

  const grouped = filtered.reduce<Record<string, Note[]>>((acc, n) => {
    (acc[n.subject] ??= []).push(n); return acc;
  }, {});

  const handleDownload = (note: Note) => {
    const token = localStorage.getItem("studentToken");
    const url   = `${BASE}/api/student-dashboard/materials/${note._id}/download?token=${token}`;
    const a     = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.click();
    toast.success(`Downloading "${note.title}"`);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading notes…</p>
      </div>
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={load} className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Class Notes" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl space-y-4">

        <div className="flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold">Class Notes</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Subject filter */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Subject</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {subjects.map(s => (
              <button key={s} onClick={() => setSubject(s)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  subject === s
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Term filter – only shown when notes have term field */}
        {terms.length > 1 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Term</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {terms.map(t => (
                <button key={t} onClick={() => setTerm(t)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    term === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center space-y-2">
              <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                {search ? "No notes match your search." : "No notes available yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(grouped).map(([subj, items]) => (
            <Card key={subj} className="border-border/50">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {subj}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {items.map(note => (
                  <div key={note._id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0 mt-0.5">
                      <FileDown className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{note.title}</p>
                      {note.term && (
                        <p className="text-xs text-muted-foreground mt-0.5">{note.term}</p>
                      )}
                      {note.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1.5 text-xs mt-0.5"
                      onClick={() => handleDownload(note)}
                    >
                      <FileDown className="h-3.5 w-3.5" />Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </main>
      <BottomNav />
    </div>
  );
}
