import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import {
  FileText, Download, Search, BookOpen, Loader2, AlertCircle,
  FileImage, Film, Presentation, File, Filter, X,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────
interface Material {
  _id:         string;
  title:       string;
  subject:     string;
  class:       string;
  description?: string;
  fileUrl:     string;
  fileName:    string;
  fileType:    string;
  fileSize:    number;
  uploadedBy:  string;   // teacher name
  createdAt:   string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number) => {
  if (bytes < 1024)           return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileIcon = (type: string) => {
  if (type.startsWith("image/"))       return FileImage;
  if (type.startsWith("video/"))       return Film;
  if (type.includes("pdf"))            return FileText;
  if (type.includes("presentation") || type.includes("powerpoint")) return Presentation;
  return File;
};

const fileColor = (type: string) => {
  if (type.includes("pdf"))            return "text-red-500 bg-red-50 dark:bg-red-950";
  if (type.startsWith("image/"))       return "text-purple-500 bg-purple-50 dark:bg-purple-950";
  if (type.startsWith("video/"))       return "text-blue-500 bg-blue-50 dark:bg-blue-950";
  if (type.includes("presentation") || type.includes("powerpoint"))
                                       return "text-orange-500 bg-orange-50 dark:bg-orange-950";
  return "text-green-500 bg-green-50 dark:bg-green-950";
};

const friendlyType = (type: string) => {
  if (type.includes("pdf"))            return "PDF";
  if (type.startsWith("image/"))       return "Image";
  if (type.startsWith("video/"))       return "Video";
  if (type.includes("presentation") || type.includes("powerpoint")) return "Slides";
  if (type.includes("word") || type.includes("document")) return "Doc";
  return "File";
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudentMaterials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [search,    setSearch]    = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterType,    setFilterType]    = useState("all");
  const [downloading, setDownloading]     = useState<string | null>(null);

  // ── Load materials ─────────────────────────────────────────────────────────
  const loadMaterials = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (!localStorage.getItem("studentToken")) { navigate("/student/login"); return; }
      const res = await apiFetch("/student-dashboard/materials", {}, "studentToken");
      const list: Material[] = Array.isArray(res) ? res : (res.data ?? res.materials ?? []);
      setMaterials(list);
    } catch (e: any) {
      if (e.message.includes("401")) {
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

  useEffect(() => { loadMaterials(); }, [loadMaterials]);

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = async (material: Material) => {
    setDownloading(material._id);
    try {
      const token = localStorage.getItem("studentToken");
      const baseUrl = (import.meta as any).env?.VITE_API_URL ?? "";
      const response = await fetch(`${baseUrl}/api/student-dashboard/materials/${material._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = material.fileName;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded "${material.title}"`);
    } catch (e: any) {
      toast.error(e.message ?? "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const subjects = Array.from(new Set(materials.map(m => m.subject))).sort();

  const filtered = materials.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || m.title.toLowerCase().includes(q)
      || m.subject.toLowerCase().includes(q)
      || m.description?.toLowerCase().includes(q);
    const matchSubject = filterSubject === "all" || m.subject === filterSubject;
    const matchType    = filterType    === "all" || friendlyType(m.fileType) === filterType;
    return matchSearch && matchSubject && matchType;
  });

  const hasFilters = search || filterSubject !== "all" || filterType !== "all";
  const clearFilters = () => { setSearch(""); setFilterSubject("all"); setFilterType("all"); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Materials" showBack showMenu />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" /> Learning Materials
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Notes, slides, and resources uploaded by your teachers
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="flex-1">
                <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="File type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Doc">Document</SelectItem>
                <SelectItem value="Slides">Slides</SelectItem>
                <SelectItem value="Image">Image</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
              <p className="text-sm text-muted-foreground">Loading materials…</p>
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={loadMaterials} className="w-full">Try Again</Button>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="font-medium text-muted-foreground">
              {hasFilters ? "No materials match your filters" : "No materials available yet"}
            </p>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-1">
              {filtered.length} material{filtered.length !== 1 ? "s" : ""}
              {hasFilters && " (filtered)"}
            </p>
            {filtered.map(material => {
              const Icon    = fileIcon(material.fileType);
              const colors  = fileColor(material.fileType);
              const isNew   = Date.now() - new Date(material.createdAt).getTime() < 3 * 86400000;

              return (
                <Card key={material._id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* File type icon */}
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", colors)}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm leading-tight line-clamp-2">{material.title}</p>
                          {isNew && (
                            <Badge className="shrink-0 bg-accent/20 text-accent text-xs border-0">New</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                          <span className="text-xs font-medium text-accent">{material.subject}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{friendlyType(material.fileType)}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{formatBytes(material.fileSize)}</span>
                        </div>
                        {material.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{material.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-3 gap-2">
                          <p className="text-xs text-muted-foreground">
                            By {material.uploadedBy} · {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1.5 min-h-[36px]"
                            disabled={downloading === material._id}
                            onClick={() => handleDownload(material)}
                          >
                            {downloading === material._id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Download className="h-3.5 w-3.5" />}
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
