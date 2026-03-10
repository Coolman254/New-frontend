import { UserPlus, FileUp, Bell, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "user",
    title: "New student registered",
    description: "Sarah Mwangi joined Form 2A",
    time: "5 minutes ago",
    icon: UserPlus,
    iconBg: "bg-success/10 text-success",
  },
  {
    id: 2,
    type: "content",
    title: "Materials uploaded",
    description: "Mr. Kamau uploaded Physics notes",
    time: "1 hour ago",
    icon: FileUp,
    iconBg: "bg-info/10 text-info",
  },
  {
    id: 3,
    type: "announcement",
    title: "Announcement sent",
    description: "Term 2 exam schedule shared",
    time: "2 hours ago",
    icon: Bell,
    iconBg: "bg-accent/10 text-accent",
  },
  {
    id: 4,
    type: "task",
    title: "Results published",
    description: "Form 4 CAT 1 results released",
    time: "4 hours ago",
    icon: CheckCircle,
    iconBg: "bg-primary/10 text-primary",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-slide-in-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
                  activity.iconBg
                )}
              >
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
