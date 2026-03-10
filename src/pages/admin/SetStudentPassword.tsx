import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function SetStudentPassword() {
  const [form, setForm]             = useState({ admissionNo: "", password: "", confirm: "" });
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess]       = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.admissionNo.trim())       e.admissionNo = "Admission number is required";
    if (!form.password)                 e.password    = "Password is required";
    else if (form.password.length < 6)  e.password    = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm     = "Passwords do not match";
    return e;
  };

  const handleSubmit = async () => {
    setSuccess(null);
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const data = await apiFetch("/student-auth/set-password", {
        method: "POST",
        body: JSON.stringify({
          admissionNo: form.admissionNo,
          password:    form.password,
        }),
      });
      setSuccess(data.message);
      toast.success(data.message);
      setForm({ admissionNo: "", password: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.message);
      setErrors({ general: err.message });
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
              <KeyRound className="h-7 w-7 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set Student Password</CardTitle>
          <CardDescription>
            Activate a student's portal account by setting their login password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
              <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
            </div>
          )}

          {errors.general && (
            <p className="text-sm text-red-500 text-center">{errors.general}</p>
          )}

          <div className="space-y-2">
            <Label>Admission Number</Label>
            <Input
              placeholder="e.g. 2024001"
              value={form.admissionNo}
              onChange={e => setForm(f => ({ ...f, admissionNo: e.target.value }))}
            />
            {errors.admissionNo && <p className="text-xs text-red-500">{errors.admissionNo}</p>}
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Repeat the password"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Setting Password...</>
              : "Set Password"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            The student can change their password after logging in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
