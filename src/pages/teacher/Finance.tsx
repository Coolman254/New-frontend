import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, CheckCircle, AlertCircle, Clock, Users, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface StudentClearance {
  _id:         string;
  firstName:   string;
  lastName:    string;
  admissionNo: number;
  class:       string;
  totalFees:   number;
  amountPaid:  number;
  feeStatus:   "cleared" | "partial" | "pending";
}

function StatusBadge({ status }: { status: string }) {
  if (status === "cleared") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" />Cleared</Badge>;
  if (status === "partial")  return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Partial</Badge>;
  return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
}

export default function TeacherFinance() {
  const [students,       setStudents]       = useState<StudentClearance[]>([]);
  const [classList,      setClassList]      = useState<string[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [selectedClass,  setSelectedClass]  = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/teacher-dashboard/students");
        const raw: any[] = res.data;

        const mapped: StudentClearance[] = raw.map(s => {
          const balance = (s.totalFees ?? 0) - (s.amountPaid ?? 0);
          const feeStatus: StudentClearance["feeStatus"] =
            (s.totalFees ?? 0) === 0 ? "cleared"
            : balance <= 0           ? "cleared"
            : (s.amountPaid ?? 0) > 0 ? "partial"
            : "pending";

          return {
            _id:         s._id,
            firstName:   s.firstName,
            lastName:    s.lastName,
            admissionNo: s.admissionNo,
            class:       s.class,
            totalFees:   s.totalFees ?? 0,
            amountPaid:  s.amountPaid ?? 0,
            feeStatus,
          };
        });

        setStudents(mapped);
        const classes = [...new Set(mapped.map(s => s.class))].sort();
        setClassList(classes);
        if (classes.length) setSelectedClass(classes[0]);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = students.filter(s => {
    const matchSearch  = s.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      || s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      || String(s.admissionNo).includes(searchTerm);
    const matchClass  = selectedClass === "all" || s.class === selectedClass;
    const matchStatus = selectedStatus === "all" || s.feeStatus === selectedStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const stats = {
    total:   filtered.length,
    cleared: filtered.filter(s => s.feeStatus === "cleared").length,
    partial: filtered.filter(s => s.feeStatus === "partial").length,
    pending: filtered.filter(s => s.feeStatus === "pending").length,
  };

  return (
    <PublicLayout pageTitle="Fee Clearance Status">
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6 space-y-6">

        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold">Fee Clearance Status</h1>
            <p className="text-muted-foreground">View clearance status for your assigned classes</p>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Read-Only Access</AlertTitle>
          <AlertDescription>As a teacher, you can view fee clearance status only. For detailed financial information, contact administration.</AlertDescription>
        </Alert>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { label: "Total",   value: stats.total,   icon: Users,        color: "text-primary" },
                { label: "Cleared", value: stats.cleared, icon: CheckCircle,  color: "text-green-600" },
                { label: "Partial", value: stats.partial, icon: Clock,        color: "text-yellow-600" },
                { label: "Pending", value: stats.pending, icon: AlertCircle,  color: "text-red-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label}>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className={`text-2xl font-bold ${color}`}>{value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Student List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div>
                    <CardTitle>Student Clearance List</CardTitle>
                    <CardDescription>{filtered.length} students shown</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search students..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} className="pl-8 w-full sm:w-[200px]" />
                    </div>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Class" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Adm No.</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Fee Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length > 0 ? filtered.map(s => (
                        <TableRow key={s._id}>
                          <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                          <TableCell>{s.admissionNo}</TableCell>
                          <TableCell>{s.class}</TableCell>
                          <TableCell><StatusBadge status={s.feeStatus} /></TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No students found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
