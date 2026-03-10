import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, School, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
}

const menuItems = [
  { to: "/", label: "Home" },
  { to: "/teacher", label: "Teachers Portal" },
  { to: "/student", label: "Student Portal" },
  { to: "/parent", label: "Parents Portal" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/help", label: "Help" },
  { to: "/login", label: "Sign In" },
];

export function MobileHeader({ title = "Globaltech Academy", showBack = false, showMenu = true }: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 safe-area-top">
      {/* Left Side */}
      <div className="flex items-center gap-2 min-w-[48px]">
        {showBack && !isHomePage ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 min-h-[48px] min-w-[48px]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent shadow-glow">
              <School className="h-5 w-5 text-accent-foreground" />
            </div>
          </Link>
        )}
      </div>

      {/* Center - Title */}
      <div className="flex-1 text-center">
        <h1 className="font-display font-semibold text-foreground text-sm truncate px-2">
          {title}
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-1 min-w-[48px] justify-end">
        <ThemeToggle />
        
        {showMenu && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[48px] min-w-[48px] md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent">
                    <School className="h-4 w-4 text-accent-foreground" />
                  </div>
                  Globaltech Academy
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors",
                      location.pathname === item.to
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
