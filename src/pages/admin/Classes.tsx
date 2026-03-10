import { useEffect, useState } from "react";
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
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookOpen, Users, UserCheck, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

// ── API config ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000";
const ENDPOINT = `${API_BASE}/api/classes`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ClassItem {
  _id: string;
  name: string;
  stream: string;
  students: number;
  classTeacher: string;
  subjects: number;
  status: string;
}

const emptyForm = {
  name: "",
  stream: "",
  students: "",
  classTeacher: "",
  subjects: "",
  status: "Active",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ClassesPage() {
  const [classes, setClasses]           = useState<ClassItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState<ClassItem | null>(null);
  const [form, setForm]                 = useState(emptyForm);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<ClassItem | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch all classes ───────────────────────────────────────────────────────
  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ClassItem[] = await res.json();
      setClasses(data);
    } catch (e: any) {
      setError(e.message || "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalStudents = classes.reduce((sum, c) => sum + Number(c.students), 0);
  const totalClasses  = classes.length;
  const uniqueGrades  = new Set(classes.map((c) => c.name)).size;

  // ── Open dialog ─────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEdit = (cls: ClassItem) => {
    setEditTarget(cls);
    setForm({
      name:         cls.name,
      stream:       cls.stream,
      students:     String(cls.students),
      classTeacher: cls.classTeacher,
      subjects:     String(cls.subjects),
      status:       cls.status,
    });
    setFormError(null);
    setDialogOpen(true);
  };

  // ── Save (create or update) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name || !form.stream || !form.classTeacher) {
      setFormError("Name, stream, and class teacher are required.");
      return;
    }
    setSaving(true);
    setFormError(null);

    const payload = {
      name:         form.name.trim(),
      stream:       form.stream.trim(),
      students:     Number(form.students) || 0,
      classTeacher: form.classTeacher.trim(),
      subjects:     Number(form.subjects) || 0,
      status:       form.status,
    };

    try {
      const url    = editTarget ? `${ENDPOINT}/${editTarget._id}` : ENDPOINT;
      const method = editTarget ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Server error: ${res.status}`);
      }

      setDialogOpen(false);
      await fetchClasses();
    } catch (e: any) {
      setFormError(e.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${ENDPOINT}/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setDeleteTarget(null);
      await fetchClasses();
    } catch (e: any) {
      // Optionally surface error
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Classes" subtitle="Manage all school classes and streams">

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{loading ? "—" : totalClasses}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{loading ? "—" : totalStudents.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Grade Levels</p>
              <p className="text-2xl font-bold">{loading ? "—" : uniqueGrades}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Classes</CardTitle>
          <Button className="gradient-accent text-accent-foreground" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Class
          </Button>
        </CardHeader>
        <CardContent>
          {/* Error state */}
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              ⚠ {error}{" "}
              <button className="underline ml-2" onClick={fetchClasses}>Retry</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading classes…</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Class Teacher</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      No classes found. Click <strong>Add Class</strong> to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls) => (
                    <TableRow key={cls._id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.stream}</TableCell>
                      <TableCell>{cls.students}</TableCell>
                      <TableCell>{cls.classTeacher}</TableCell>
                      <TableCell>{cls.subjects}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {cls.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(cls)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm" variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(cls)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Class" : "Add New Class"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name" placeholder="e.g. Grade 1"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="stream">Stream *</Label>
                <Input
                  id="stream" placeholder="e.g. A"
                  value={form.stream}
                  onChange={e => setForm(f => ({ ...f, stream: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="classTeacher">Class Teacher *</Label>
              <Input
                id="classTeacher" placeholder="e.g. Mrs. Sarah Wanjiku"
                value={form.classTeacher}
                onChange={e => setForm(f => ({ ...f, classTeacher: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="students">No. of Students</Label>
                <Input
                  id="students" type="number" min={0} placeholder="0"
                  value={form.students}
                  onChange={e => setForm(f => ({ ...f, students: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="subjects">No. of Subjects</Label>
                <Input
                  id="subjects" type="number" min={0} placeholder="0"
                  value={form.subjects}
                  onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {formError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{formError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name} {deleteTarget?.stream}</strong> from the database. This action cannot be undone.
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
