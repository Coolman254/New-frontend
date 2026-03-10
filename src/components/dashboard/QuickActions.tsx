import { useNavigate } from "react-router-dom";
import { UserPlus, BookPlus, Bell, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: UserPlus,
    label: "Add User",
    description: "Register student, teacher, or parent",
    variant: "default" as const,
    path: "/admin/add-user",
  },
  {
    icon: BookPlus,
    label: "Create Class",
    description: "Set up a new class section",
    variant: "default" as const,
    path: "/admin/classes",
  },
  {
    icon: Bell,
    label: "Send Announcement",
    description: "Notify students and parents",
    variant: "default" as const,
    path: "/admin/announcements",
  },
  {
    icon: FileText,
    label: "Generate Report",
    description: "Create performance reports",
    variant: "default" as const,
    path: "/admin/reports",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => navigate(action.path)}
              className="h-auto flex-col items-start gap-2 p-4 hover:bg-accent/5 hover:border-accent transition-all duration-200 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted group-hover:bg-accent/10 transition-colors">
                <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
