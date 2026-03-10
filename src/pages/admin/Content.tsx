import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText, Video, Image, Upload, Search,
  Download, Eye, Trash2, BookOpen, Loader2, X,
} from "lucide-react";

// ── API config ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000";
const ENDPOINT = `${API_BASE}/api/content`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ContentItem {
  _id: string;
  title: string;
  type: "PDF" | "Video" | "Image";
  subject: string;
  grade: string;
  teacher: string;
  size: string;
  downloads: number;
  status: "Published" | "Draft" | "Review";
  filename: string;
  originalName: string;
  createdAt: string;
}

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Video: Video,
  Image: Image,
};

const emptyForm = {
  title: "",
  subject: "",
  grade: "",
  teacher: "",
  status: "Published",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const [items, setItems]               = useState<ContentItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [activeTab, setActiveTab]       = useState("all");

  // Upload dialog
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [file, setFile]                 = useState<File | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchItems = async (type?: string, q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type && type !== "all") params.append("type", capitalize(type === "pdf" ? "PDF" : type));
      if (q) params.append("search", q);
      const res = await fetch(`${ENDPOINT}?${params.toString()}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ContentItem[] = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  useEffect(() => { fetchItems(); }, []);

  // ── Search with debounce ──────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(activeTab, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, activeTab]);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalMaterials  = items.length;
  const totalDocuments  = items.filter(i => i.type === "PDF").length;
  const totalVideos     = items.filter(i => i.type === "Video").length;
  const totalDownloads  = items.reduce((sum, i) => sum + i.downloads, 0);

  // ── Upload ────────────────────────────────────────────────────────────────
  const openUpload = () => {
    setForm(emptyForm);
    setFile(null);
    setFormError(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    // Auto-fill title from filename if empty
    if (f && !form.title) {
      setForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, "") }));
    }
  };

  const handleUpload = async () => {
    if (!file)                        return setFormError("Please select a file.");
    if (!form.title.trim())           return setFormError("Title is required.");
    if (!form.subject.trim())         return setFormError("Subject is required.");
    if (!form.grade.trim())           return setFormError("Grade is required.");
    if (!form.teacher.trim())         return setFormError("Teacher name is required.");

    setUploading(true);
    setFormError(null);

    const fd = new FormData();
    fd.append("file",    file);
    fd.append("title",   form.title.trim());
    fd.append("subject", form.subject.trim());
    fd.append("grade",   form.grade.trim());
    fd.append("teacher", form.teacher.trim());
    fd.append("status",  form.status);

    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: fd });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Server error: ${res.status}`);
      }
      setDialogOpen(false);
      await fetchItems(activeTab, search);
    } catch (e: any) {
      setFormError(e.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = async (item: ContentItem) => {
    window.open(`${ENDPOINT}/${item._id}/download`, "_blank");
    // Optimistically update local counter
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, downloads: i.downloads + 1 } : i));
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${ENDPOINT}/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setDeleteTarget(null);
      await fetchItems(activeTab, search);
    } catch (e: any) {
      // optionally surface error
    } finally {
      setDeleting(false);
    }
  };

  // ── Tab change ────────────────────────────────────────────────────────────
  const handleTabChange = (val: string) => {
    setActiveTab(val);
  };

  // ── Table renderer ────────────────────────────────────────────────────────
  const renderTable = (data: ContentItem[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Downloads</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
              No materials found.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const Icon = typeIcons[item.type] || FileText;
            return (
              <TableRow key={item._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[220px]">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.grade}</TableCell>
                <TableCell>{item.teacher}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.downloads}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.status === "Published"
                        ? "bg-success/10 text-success border-success/20"
                        : item.status === "Draft"
                        ? "bg-muted text-muted-foreground border-border"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      title="View file"
                      onClick={() => window.open(`${API_BASE}/uploads/${item.filename}`, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      title="Download"
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                      title="Delete"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Content Management" subtitle="Manage learning materials and resources">

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Materials</p>
              <p className="text-2xl font-bold">{loading ? "—" : totalMaterials}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="text-2xl font-bold">{loading ? "—" : totalDocuments}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <Video className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Videos</p>
              <p className="text-2xl font-bold">{loading ? "—" : totalVideos}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Download className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
              <p className="text-2xl font-bold">{loading ? "—" : totalDownloads.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main table card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Learning Materials</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                className="pl-9 w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button className="gradient-accent text-accent-foreground" onClick={openUpload}>
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              ⚠ {error}{" "}
              <button className="underline ml-2" onClick={() => fetchItems(activeTab, search)}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading materials…</span>
            </div>
          ) : (
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pdf">Documents</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
              </TabsList>
              <TabsContent value="all"   className="mt-4">{renderTable(items)}</TabsContent>
              <TabsContent value="pdf"   className="mt-4">{renderTable(items.filter(i => i.type === "PDF"))}</TabsContent>
              <TabsContent value="video" className="mt-4">{renderTable(items.filter(i => i.type === "Video"))}</TabsContent>
              <TabsContent value="image" className="mt-4">{renderTable(items.filter(i => i.type === "Image"))}</TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* ── Upload Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Learning Material</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* File picker */}
            <div className="space-y-1">
              <Label>File *</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium truncate max-w-xs">{file.name}</span>
                    <button
                      className="ml-2 text-muted-foreground hover:text-destructive"
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>Click to select a file</p>
                    <p className="text-xs mt-1">PDF, Video (MP4), or Image (JPG, PNG) — max 100MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,video/mp4,video/mpeg,video/quicktime,video/webm,image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title" placeholder="e.g. Mathematics Grade 8 - Algebra Notes"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject" placeholder="e.g. Mathematics"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade" placeholder="e.g. Grade 8"
                  value={form.grade}
                  onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="teacher">Uploaded By *</Label>
                <Input
                  id="teacher" placeholder="e.g. Mr. James Ochieng"
                  value={form.teacher}
                  onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{formError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={uploading}>Cancel</Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.title}</strong> and remove the file from the server. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}
