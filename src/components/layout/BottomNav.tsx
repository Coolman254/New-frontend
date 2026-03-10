import { Link, useLocation } from "react-router-dom";
import { Home, GraduationCap, UserCheck, Users, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/teacher", label: "Teachers", icon: UserCheck },
  { to: "/student", label: "Students", icon: GraduationCap },
  { to: "/parent", label: "Parents", icon: Users },
  { to: "/contact", label: "Contact", icon: Phone },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== "/" && location.pathname.startsWith(item.to));
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] min-h-[48px] rounded-lg transition-colors touch-manipulation",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground active:text-foreground active:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-accent")} />
              <span className={cn(
                "text-[10px] font-medium leading-none",
                isActive ? "text-accent" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
