import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { BookOpen, ExternalLink, Search, FolderOpen, File, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch, BASE } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Material {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  fileType: string;   // may be full MIME "application/pdf" or short "pdf"
  fileSize?: number;
  createdAt: string;  // Mongoose timestamps field
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// Normalise MIME type or any string → short key for colour + label
const shortType = (ft: string): string => {
  if (!ft) return "other";
  if (ft.includes("pdf"))                  return "pdf";
  if (ft.includes("wordprocessing") || ft.includes("msword")) return "docx";
  if (ft.includes("presentation")   || ft.includes("powerpoint")) return "pptx";
  if (ft.startsWith("image/"))             return "image";
  if (ft.includes("sheet") || ft.includes("excel")) return "xlsx";
  if (ft.includes("text/plain"))           return "txt";
  return ft.split("/").pop()?.toLowerCase() ?? "other";
};

const FILE_COLORS: Record<string, string> = {
  pdf:   "bg-red-100    text-red-700    dark:bg-red-900    dark:text-red-300",
  docx:  "bg-blue-100   text-blue-700   dark:bg-blue-900   dark:text-blue-300",
  doc:   "bg-blue-100   text-blue-700   dark:bg-blue-900   dark:text-blue-300",
  pptx:  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  ppt:   "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  image: "bg-green-100  text-green-700  dark:bg-green-900  dark:text-green-300",
  xlsx:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  txt:   "bg-muted text-muted-foreground",
  other: "bg-muted text-muted-foreground",
};

const formatBytes = (b?: number) =>
  !b ? "" : b < 1_048_576
    ? `${(b / 1024).toFixed(1)} KB`
    : `${(b / 1_048_576).toFixed(1)} MB`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function MaterialsPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [search,    setSearch]    = useState("");
  const [subject,   setSubject]   = useState("All");

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("studentToken")) { navigate("/student/login"); return; }
      const res = await apiFetch("/student-dashboard/materials", {}, "studentToken");
      setMaterials(res.data ?? []);
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

  const subjects = ["All", ...Array.from(new Set(materials.map(m => m.subject))).sort()];
  const filtered = materials.filter(m => {
    const matchSub    = subject === "All" || m.subject === subject;
    const matchSearch = !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchSearch;
  });
  const grouped = filtered.reduce<Record<string, Material[]>>((acc, m) => {
    (acc[m.subject] ??= []).push(m); return acc;
  }, {});

  const handleOpen = (m: Material) => {
    const token = localStorage.getItem("studentToken");
    const url   = `${BASE}/api/student-dashboard/materials/${m._id}/download?token=${token}`;
    const a     = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.click();
    toast.success(`Opening "${m.title}"`);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
        <p className="text-sm text-muted-foreground">Loading materials…</p>
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
      <MobileHeader title="Study Materials" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl space-y-4">

        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold">Study Materials</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search materials…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Subject filter pills */}
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

        {/* Empty state */}
        {filtered.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center space-y-2">
              <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                {search ? "No materials match your search." : "No materials available yet."}
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
                {items.map(m => {
                  const type = shortType(m.fileType);
                  return (
                    <div key={m._id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                        <File className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.title}</p>
                        {m.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{m.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline"
                            className={cn("text-xs border-0", FILE_COLORS[type] ?? FILE_COLORS.other)}>
                            {type.toUpperCase()}
                          </Badge>
                          {m.fileSize && (
                            <span className="text-xs text-muted-foreground">{formatBytes(m.fileSize)}</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0 h-9 w-9"
                        onClick={() => handleOpen(m)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        )}
      </main>
      <BottomNav />
    </div>
  );
}
