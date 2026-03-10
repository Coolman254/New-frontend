import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Eye, EyeOff, ArrowRight, GraduationCap, Users, UserCheck, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoginBranding } from "@/components/login/LoginBranding";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !role) return;
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password, role }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role",  data.role);

      toast({ title: "Welcome!", description: `Signed in successfully as ${data.role}.` });

      if (data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate(`/${data.role}`);
      }
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoginBranding />
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent shadow-glow">
              <School className="h-6 w-6 text-accent-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Globaltech Model Academy</h1>
          </div>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your learning portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role"><SelectValue placeholder="Select your role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student"><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />Student</div></SelectItem>
                      <SelectItem value="teacher"><div className="flex items-center gap-2"><UserCheck className="h-4 w-4" />Teacher</div></SelectItem>
                      <SelectItem value="parent"><div className="flex items-center gap-2"><Users className="h-4 w-4" />Parent</div></SelectItem>
                      <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="h-4 w-4" />Admin</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@globaltech.ac.ke" className="h-11"
                    value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                      className="h-11 pr-10" value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" size="lg"
                  className="w-full min-h-[48px] gradient-accent text-accent-foreground font-semibold hover:opacity-90"
                  disabled={!role || loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</> : <>Sign In<ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/contact" className="text-accent font-medium hover:underline">Contact Admin</Link>
              </div>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground">© 2024 Globaltech Model Academy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
