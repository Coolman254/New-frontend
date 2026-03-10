import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [form, setForm]             = useState({ admissionNo: "", password: "" });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.admissionNo.trim()) e.admissionNo = "Admission number is required";
    if (!form.password)           e.password    = "Password is required";
    return e;
  };

  const handleLogin = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const data = await apiFetch("/student-auth/login", {
        method: "POST",
        body: JSON.stringify({ admissionNo: form.admissionNo, password: form.password }),
      });
      localStorage.setItem("studentToken", data.token);
      toast.success(`Welcome back, ${data.data.firstName}!`);
      navigate("/student/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <GraduationCap className="h-7 w-7 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">Student Portal</CardTitle>
          <CardDescription>Sign in with your admission number and password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Admission Number</Label>
            <Input placeholder="e.g. 2024001" value={form.admissionNo}
              onChange={e => setForm(f => ({ ...f, admissionNo: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
            {errors.admissionNo && <p className="text-xs text-red-500">{errors.admissionNo}</p>}
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin()} />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Sign In
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Contact your school administrator if you need your password set.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
