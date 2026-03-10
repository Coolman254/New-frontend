import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  School,
  Home,
  GraduationCap,
  UserCheck,
  Users,
  Phone,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/login?portal=teacher", label: "Teachers Portal", icon: UserCheck },
  { to: "/login?portal=student", label: "Student Portal", icon: GraduationCap },
  { to: "/login?portal=parent", label: "Parents Portal", icon: Users },
  { to: "/contact", label: "Contact Us", icon: Phone },
  { to: "/about", label: "About Us", icon: Info },
];

export function MainNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent shadow-glow">
            <School className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-foreground">
              Globaltech Model
            </span>
            <span className="ml-1 text-muted-foreground">Academy</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === link.to
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Sign In Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gradient-accent text-accent-foreground hidden sm:flex">
            <Link to="/login">Sign In</Link>
          </Button>
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === link.to
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full gradient-accent text-accent-foreground">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
