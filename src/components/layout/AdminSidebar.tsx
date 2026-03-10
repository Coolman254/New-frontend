import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, UserCheck,
  BookOpen, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  School, FileText, BarChart3, DollarSign, KeyRound,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem { icon: React.ElementType; label: string; path: string; }
interface NavGroup { label: string; icon: React.ElementType; items: NavItem[]; }

const navStructure: (NavItem | NavGroup)[] = [
  { icon: LayoutDashboard, label: "Dashboard",  path: "/admin" },
  { icon: School,          label: "School Info", path: "/admin/school-info" },
  {
    label: "People", icon: Users,
    items: [
      { icon: Users,         label: "All Users",     path: "/admin/users" },
      { icon: GraduationCap, label: "Students",      path: "/admin/students" },
      { icon: UserCheck,     label: "Teachers",      path: "/admin/teachers" },
      { icon: Users,         label: "Parents",       path: "/admin/parents" },
      { icon: KeyRound,      label: "User Accounts", path: "/admin/users/accounts" },
    ],
  },
  {
    label: "Academics", icon: BookOpen,
    items: [
      { icon: BookOpen,  label: "Classes",       path: "/admin/classes" },
      { icon: FileText,  label: "Content",       path: "/admin/content" },
      { icon: BarChart3, label: "Reports",       path: "/admin/reports" },
      { icon: Bell,      label: "Announcements", path: "/admin/announcements" },
    ],
  },
  { icon: DollarSign, label: "Finance",  path: "/admin/finance" },
  { icon: Settings,   label: "Settings", path: "/admin/settings" },
];

function isGroup(item: NavItem | NavGroup): item is NavGroup {
  return "items" in item;
}

export function AdminSidebar() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [openGroups,  setOpenGroups]  = useState<Record<string, boolean>>({ People: true, Academics: true });
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); navigate("/"); };
  const toggleGroup  = (label: string) => setOpenGroups((p) => ({ ...p, [label]: !p[label] }));
  const isActive     = (path: string) => path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);
  const isGroupActive = (g: NavGroup) => g.items.some((i) => isActive(i.path));

  return (
    <aside className={cn("fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col", collapsed ? "w-20" : "w-64")}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent shadow-glow flex-shrink-0">
            <School className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-sidebar-foreground text-sm">Globaltech Model</span>
              <span className="text-xs text-sidebar-muted">Academy</span>
            </div>
          )}
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navStructure.map((item) => {
            if (!isGroup(item)) {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link to={item.path} title={collapsed ? item.label : undefined}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active ? "bg-sidebar-accent text-sidebar-primary shadow-md" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50")}>
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", active && "text-sidebar-primary")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            }

            const groupActive = isGroupActive(item);
            const groupOpen   = openGroups[item.label] ?? true;

            return (
              <li key={item.label}>
                <button onClick={() => !collapsed && toggleGroup(item.label)} title={collapsed ? item.label : undefined}
                  className={cn("w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-sidebar-accent/40",
                    groupActive ? "text-sidebar-primary" : "text-sidebar-foreground/60 hover:text-sidebar-foreground")}>
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", groupActive && "text-sidebar-primary")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {groupOpen ? <ChevronUp className="h-3.5 w-3.5 text-sidebar-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-sidebar-muted" />}
                    </>
                  )}
                </button>
                {!collapsed && groupOpen && (
                  <ul className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-0.5">
                    {item.items.map((sub) => {
                      const subActive = isActive(sub.path);
                      return (
                        <li key={sub.path}>
                          <Link to={sub.path}
                            className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-all duration-200",
                              subActive ? "bg-sidebar-accent text-sidebar-primary font-semibold" : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50")}>
                            <sub.icon className={cn("h-4 w-4 flex-shrink-0", subActive && "text-sidebar-primary")} />
                            <span>{sub.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <Separator className="mb-3 bg-sidebar-border" />
        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", collapsed ? "justify-center" : "")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent flex-shrink-0">
            <span className="text-sm font-semibold text-sidebar-accent-foreground">AD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-muted truncate">admin@globaltech.ac.ke</p>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={handleLogout}
          className={cn("w-full mt-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10", collapsed ? "px-0" : "")}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
