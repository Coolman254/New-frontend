import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Command, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList,
} from "@/components/ui/command";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  UserPlus, Search, KeyRound, Trash2, Loader2,
  ShieldCheck, GraduationCap, Users, UserCheck, Eye, EyeOff,
  ChevronsUpDown, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface UserAccount {
  _id:       string;
  name:      string;
  email:     string;
  role:      "admin" | "teacher" | "parent" | "student";
  createdAt: string;
}

/** Shape returned by /teachers, /parents, /students profile endpoints */
interface ProfileOption {
  _id:         string;
  name:        string;
  email?:      string;       // students may not have email
  admissionNo?: string;      // students only
}

const ROLE_CONFIG = {
  admin:   { label: "Admin",   icon: ShieldCheck,   color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  teacher: { label: "Teacher", icon: UserCheck,     color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  parent:  { label: "Parent",  icon: Users,         color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  student: { label: "Student", icon: GraduationCap, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
};

// Map role → API endpoint that returns profile list
const PROFILE_ENDPOINT: Record<string, string> = {
  teacher: "/teachers",
  parent:  "/parents",
  student: "/students",
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminUserAccounts() {
  const [users,      setUsers]      = useState<UserAccount[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Create dialog
  const [createOpen,   setCreateOpen]   = useState(false);
  const [creating,     setCreating]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emptyForm = { name: "", email: "", password: "", role: "", admissionNo: "" };
  const [form,       setForm]       = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Profile dropdown state
  const [profiles,        setProfiles]        = useState<ProfileOption[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profileOpen,     setProfileOpen]     = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileOption | null>(null);

  // Reset password dialog
  const [resetOpen,    setResetOpen]    = useState(false);
  const [resetting,    setResetting]    = useState(false);
  const [resetUser,    setResetUser]    = useState<UserAccount | null>(null);
  const [newPassword,  setNewPassword]  = useState("");
  const [showNewPwd,   setShowNewPwd]   = useState(false);
  const [resetAdmNo,   setResetAdmNo]   = useState("");

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [deleteUser, setDeleteUser] = useState<UserAccount | null>(null);

  // ── Load user accounts ──────────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/users");
      setUsers(res.data ?? res.users ?? res);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ── Load profiles when role changes ────────────────────────────────────────
  useEffect(() => {
    // Reset selection whenever role changes
    setSelectedProfile(null);
    setForm(f => ({ ...f, name: "", email: "", admissionNo: "" }));
    setProfiles([]);

    const endpoint = PROFILE_ENDPOINT[form.role];
    if (!endpoint) return; // "admin" has no profile list

    const fetchProfiles = async () => {
      setProfilesLoading(true);
      try {
        const res = await apiFetch(endpoint);
        // Normalise: accept array or { data: [...] }
        const list: ProfileOption[] = Array.isArray(res) ? res : (res.data ?? res.teachers ?? res.parents ?? res.students ?? []);
        setProfiles(list);
      } catch (e: any) {
        toast.error(`Could not load ${form.role} profiles: ${e.message}`);
      } finally {
        setProfilesLoading(false);
      }
    };

    fetchProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.role]);

  // ── When a profile is selected, populate form fields ───────────────────────
  const handleSelectProfile = (profile: ProfileOption) => {
    setSelectedProfile(profile);
    setProfileOpen(false);
    if (form.role === "student") {
      setForm(f => ({
        ...f,
        admissionNo: profile.admissionNo ?? "",
        name: profile.name,
      }));
    } else {
      setForm(f => ({
        ...f,
        name:  profile.name,
        email: profile.email ?? "",
      }));
    }
  };

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  // ── Create user ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.role) { e.role = "Role is required"; setFormErrors(e); return false; }

    if (form.role === "student") {
      if (!form.admissionNo.trim()) e.admissionNo = "Admission number is required";
      if (!form.password)           e.password    = "Password is required";
      else if (form.password.length < 6) e.password = "Minimum 6 characters";
    } else {
      if (!form.name.trim())  e.name    = "Name is required";
      if (!form.email.trim()) e.email   = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.password)     e.password = "Password is required";
      else if (form.password.length < 6) e.password = "Minimum 6 characters";
    }
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setCreating(true);
    try {
      if (form.role === "student") {
        const data = await apiFetch("/student-auth/set-password", {
          method: "POST",
          body: JSON.stringify({
            admissionNo: form.admissionNo,
            password:    form.password,
          }),
        });
        toast.success(data.message ?? "Student password set successfully");
      } else {
        await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name:     form.name,
            email:    form.email,
            password: form.password,
            role:     form.role,
          }),
        });
        toast.success(`Account created for ${form.name}`);
        loadUsers();
      }
      setCreateOpen(false);
      setForm(emptyForm);
      setFormErrors({});
      setSelectedProfile(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setCreateOpen(open);
    if (!open) {
      setForm(emptyForm);
      setFormErrors({});
      setSelectedProfile(null);
      setProfiles([]);
      setShowPassword(false);
    }
  };

  // ── Reset password ──────────────────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setResetting(true);
    try {
      if (resetUser?.role === "student") {
        if (!resetAdmNo.trim()) {
          toast.error("Admission number is required for students");
          setResetting(false);
          return;
        }
        const data = await apiFetch("/student-auth/set-password", {
          method: "POST",
          body: JSON.stringify({ admissionNo: resetAdmNo, password: newPassword }),
        });
        toast.success(data.message ?? "Student password updated");
      } else {
        await apiFetch(`/auth/users/${resetUser!._id}/password`, {
          method: "PATCH",
          body: JSON.stringify({ password: newPassword }),
        });
        toast.success(`Password updated for ${resetUser!.name}`);
      }
      setResetOpen(false);
      setNewPassword("");
      setResetAdmNo("");
      setResetUser(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setResetting(false);
    }
  };

  // ── Delete user ─────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/auth/users/${deleteUser!._id}`, { method: "DELETE" });
      toast.success(`Account deleted for ${deleteUser!.name}`);
      setDeleteOpen(false);
      setDeleteUser(null);
      loadUsers();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const profileButtonLabel = () => {
    if (selectedProfile) return selectedProfile.name;
    if (profilesLoading)  return "Loading…";
    if (!form.role || form.role === "admin") return "Select role first";
    return `Select a ${form.role}…`;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="User Accounts" subtitle="Create and manage login credentials for all portal users.">

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(Object.entries(ROLE_CONFIG) as [string, typeof ROLE_CONFIG[keyof typeof ROLE_CONFIG]][]).map(([role, cfg]) => {
          const Icon  = cfg.icon;
          const count = users.filter(u => u.role === role).length;
          return (
            <Card key={role} className="border-border/50 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterRole(role === filterRole ? "all" : role)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table card */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All User Accounts</CardTitle>
              <CardDescription>{filtered.length} account{filtered.length !== 1 ? "s" : ""} found</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name or email..." value={search}
                  onChange={e => setSearch(e.target.value)} className="pl-8 w-full sm:w-[220px]" />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="All roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setCreateOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" /> Create Account
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                        No accounts found
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(user => {
                    const cfg  = ROLE_CONFIG[user.role];
                    const Icon = cfg.icon;
                    return (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={cfg.color}>
                            <Icon className="w-3 h-3 mr-1" />{cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" title="Reset password"
                              onClick={() => { setResetUser(user); setResetOpen(true); }}>
                              <KeyRound className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Delete account"
                              onClick={() => { setDeleteUser(user); setDeleteOpen(true); }}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Create Account Dialog ─────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create User Account</DialogTitle>
            <DialogDescription>
              {form.role === "student"
                ? "Students log in with their admission number — no email needed."
                : form.role === "admin"
                ? "Fill in details for the new admin account."
                : "Select a registered profile to pre-fill details, then set a password."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* ── Step 1: Role selector ── */}
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-xs text-red-500">{formErrors.role}</p>}
            </div>

            {/* ── Step 2: Profile picker (teachers, parents, students only) ── */}
            {form.role && form.role !== "admin" && (
              <div className="space-y-2">
                <Label>
                  Select {form.role.charAt(0).toUpperCase() + form.role.slice(1)} *
                </Label>
                <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={profileOpen}
                      disabled={profilesLoading || profiles.length === 0}
                      className="w-full justify-between font-normal"
                    >
                      <span className={cn("truncate", !selectedProfile && "text-muted-foreground")}>
                        {profileButtonLabel()}
                      </span>
                      {profilesLoading
                        ? <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                        : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={`Search ${form.role}s…`} />
                      <CommandList>
                        <CommandEmpty>No {form.role}s found.</CommandEmpty>
                        <CommandGroup>
                          {profiles.map(p => (
                            <CommandItem
                              key={p._id}
                              value={p.name + (p.email ?? "") + (p.admissionNo ?? "")}
                              onSelect={() => handleSelectProfile(p)}
                            >
                              <Check className={cn(
                                "mr-2 h-4 w-4",
                                selectedProfile?._id === p._id ? "opacity-100" : "opacity-0"
                              )} />
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium truncate">{p.name}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {form.role === "student"
                                    ? `Adm: ${p.admissionNo ?? "—"}`
                                    : p.email ?? "—"}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {profiles.length === 0 && !profilesLoading && form.role && (
                  <p className="text-xs text-muted-foreground">
                    No {form.role} profiles found. Make sure profiles are created first.
                  </p>
                )}
              </div>
            )}

            {/* ── Step 3: Pre-filled / editable fields ── */}

            {/* Student: admission number (read-only if selected from dropdown) */}
            {form.role === "student" && (
              <div className="space-y-2">
                <Label>Admission Number *</Label>
                <Input
                  placeholder="e.g. 2024001"
                  value={form.admissionNo}
                  readOnly={!!selectedProfile}
                  className={cn(selectedProfile && "bg-muted/50 cursor-default")}
                  onChange={e => setForm(f => ({ ...f, admissionNo: e.target.value }))}
                />
                {formErrors.admissionNo && <p className="text-xs text-red-500">{formErrors.admissionNo}</p>}
              </div>
            )}

            {/* Non-student, non-admin: name + email (pre-filled, editable) */}
            {form.role && form.role !== "student" && (
              <>
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="e.g. James Mwangi"
                    value={form.name}
                    readOnly={!!selectedProfile && form.role !== "admin"}
                    className={cn(selectedProfile && form.role !== "admin" && "bg-muted/50 cursor-default")}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="must match their profile email"
                    value={form.email}
                    readOnly={!!selectedProfile && form.role !== "admin"}
                    className={cn(selectedProfile && form.role !== "admin" && "bg-muted/50 cursor-default")}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
              </>
            )}

            {/* ── Step 4: Password — always shown ── */}
            <div className="space-y-2">
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {form.role === "student" ? "Set Password" : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset Password Dialog ─────────────────────────────────────────────── */}
      <Dialog open={resetOpen} onOpenChange={v => { setResetOpen(v); if (!v) { setNewPassword(""); setResetAdmNo(""); setResetUser(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for <strong>{resetUser?.name}</strong>
              {resetUser?.role === "student" && " — enter their admission number to confirm."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {resetUser?.role === "student" && (
              <div className="space-y-2">
                <Label>Admission Number</Label>
                <Input placeholder="e.g. 2024001" value={resetAdmNo}
                  onChange={e => setResetAdmNo(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showNewPwd ? "text" : "password"} placeholder="Min. 6 characters"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowNewPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={resetting}>
              {resetting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the login account for <strong>{deleteUser?.name}</strong> ({deleteUser?.email}).
              Their profile data will NOT be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}
