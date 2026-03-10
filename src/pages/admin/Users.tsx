import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Plus, MoreHorizontal, Edit,
  Trash2, Eye, Download, Filter, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 10;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  classOrSubject: string;
  status: string;
  joinedDate: string;
}

const roleColors: Record<string, string> = {
  student: "bg-primary/10 text-primary",
  teacher: "bg-accent/10 text-accent",
  parent:  "bg-success/10 text-success",
  admin:   "bg-info/10 text-info",
};

const statusColors: Record<string, string> = {
  Active:   "bg-success/10 text-success",
  Inactive: "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [allUsers, setAllUsers]     = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Pre-fill role filter from ?role= query param (set by dashboard cards)
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "all");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  // Re-apply filter if URL param changes (e.g. navigating from dashboard)
  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    if (roleFromUrl) setRoleFilter(roleFromUrl);
  }, [searchParams]);

  // Fetch all users
  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [studentsRes, parentsRes, teachersRes] = await Promise.all([
          fetch(`${API}/api/students`, { headers }),
          fetch(`${API}/api/parents`,  { headers }),
          fetch(`${API}/api/teachers`, { headers }),
        ]);

        const students = studentsRes.ok ? await studentsRes.json() : [];
        const parents  = parentsRes.ok  ? await parentsRes.json()  : [];
        const teachers = teachersRes.ok ? await teachersRes.json() : [];

        const fmt = (d: Date) =>
          new Date(d).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          });

        const formatted: User[] = [
          ...students.map((s: any) => ({
            id:             s._id,
            name:           `${s.firstName} ${s.lastName}`,
            email:          s.email || "—",
            role:           "student",
            classOrSubject: s.class || "—",
            status:         s.status || "Active",
            joinedDate:     fmt(s.createdAt),
          })),
          ...parents.map((p: any) => ({
            id:             p._id,
            name:           `${p.firstName} ${p.lastName}`,
            email:          p.email || "—",
            role:           "parent",
            classOrSubject: p.relationship || "—",
            status:         p.status || "Active",
            joinedDate:     fmt(p.createdAt),
          })),
          ...teachers.map((t: any) => ({
            id:             t._id,
            name:           `${t.firstName} ${t.lastName}`,
            email:          t.email || "—",
            role:           "teacher",
            classOrSubject: t.subject || "—",
            status:         t.status || "Active",
            joinedDate:     fmt(t.createdAt),
          })),
        ];

        setAllUsers(formatted);
      } catch {
        toast({
          title: "Failed to load users",
          description: "Could not connect to the server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAllUsers();
  }, []);

  // Filter
  const filtered = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Delete
  const handleDelete = async (id: string, role: string) => {
    const endpoint = role === "student" ? "students"
                   : role === "parent"  ? "parents"
                   : "teachers";
    try {
      const res = await fetch(`${API}/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAllUsers(prev => prev.filter(u => u.id !== id));
      toast({ title: "User deleted successfully." });
    } catch {
      toast({ title: "Failed to delete user.", variant: "destructive" });
    }
  };

  // Role badge counts for header summary
  const counts = {
    student: allUsers.filter(u => u.role === "student").length,
    teacher: allUsers.filter(u => u.role === "teacher").length,
    parent:  allUsers.filter(u => u.role === "parent").length,
  };

  return (
    <AdminLayout title="User Management" subtitle="Manage all users in the system">
      <div className="mb-6">
        <BackButton fallbackPath="/admin" />
      </div>

      {/* Summary badges */}
      {!loading && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {(["all", "student", "teacher", "parent"] as const).map(role => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setCurrentPage(1); }}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                roleFilter === role
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {role === "all"
                ? `All Users (${allUsers.length})`
                : `${role.charAt(0).toUpperCase() + role.slice(1)}s (${counts[role]})`}
            </button>
          ))}
        </div>
      )}

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">
            {roleFilter === "all" ? "All Users" : `${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}s`}
            {!loading && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filtered.length} total)
              </span>
            )}
          </CardTitle>
          <Button
            onClick={() => navigate("/admin/add-user")}
            className="gradient-accent text-accent-foreground hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={val => { setRoleFilter(val); setCurrentPage(1); }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Class / Subject</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Loading users...</p>
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("font-medium capitalize", roleColors[user.role])}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.classOrSubject}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("font-medium", statusColors[user.status])}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(user.id, user.role)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline" size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline" size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
