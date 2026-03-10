import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";
import {
  Download,
  FileText,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Eye,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  data: { label: string; value: string; trend?: "up" | "down" | "neutral" }[];
  lastUpdated: string;
}

const reports: Report[] = [
  {
    id: "student-performance",
    title: "Student Performance Report",
    description: "Shows average scores per subject and class for the current term.",
    icon: GraduationCap,
    iconColor: "text-primary",
    data: [
      { label: "Class", value: "Grade 8", trend: "neutral" },
      { label: "Average Score", value: "68%", trend: "up" },
      { label: "Best Subject", value: "Mathematics", trend: "up" },
      { label: "Least Performed Subject", value: "English", trend: "down" },
    ],
    lastUpdated: "2 hours ago",
  },
  {
    id: "class-performance",
    title: "Class Performance Report",
    description: "Compares academic performance between classes.",
    icon: BarChart3,
    iconColor: "text-accent",
    data: [
      { label: "Grade 7", value: "72% average", trend: "up" },
      { label: "Grade 8", value: "68% average", trend: "neutral" },
      { label: "Grade 9", value: "75% average", trend: "up" },
    ],
    lastUpdated: "1 day ago",
  },
  {
    id: "teacher-activity",
    title: "Teacher Activity Report",
    description: "Tracks teacher engagement on the platform.",
    icon: Users,
    iconColor: "text-success",
    data: [
      { label: "Materials Uploaded", value: "45", trend: "up" },
      { label: "Assignments Created", value: "18", trend: "up" },
      { label: "Announcements Sent", value: "12", trend: "neutral" },
    ],
    lastUpdated: "3 hours ago",
  },
  {
    id: "content-usage",
    title: "Content Usage Report",
    description: "Monitors how often learning materials are accessed.",
    icon: BookOpen,
    iconColor: "text-info",
    data: [
      { label: "Most Downloaded Subject", value: "Mathematics", trend: "up" },
      { label: "Total Downloads This Term", value: "1,240", trend: "up" },
      { label: "Active Students", value: "92%", trend: "up" },
    ],
    lastUpdated: "5 hours ago",
  },
  {
    id: "parent-engagement",
    title: "Parent Engagement Report",
    description: "Measures parent interaction with the platform.",
    icon: Activity,
    iconColor: "text-warning",
    data: [
      { label: "Active Parent Accounts", value: "85%", trend: "up" },
      { label: "Notifications Viewed", value: "78%", trend: "neutral" },
      { label: "Performance Reports Accessed", value: "64%", trend: "down" },
    ],
    lastUpdated: "1 hour ago",
  },
];

const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-success" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

export default function ReportsPage() {
  const handleDownload = (reportId: string, reportTitle: string) => {
    toast({
      title: "Download Started",
      description: `${reportTitle} is being downloaded...`,
    });
  };

  const handleRefresh = (reportId: string) => {
    toast({
      title: "Refreshing Report",
      description: "Fetching latest data...",
    });
  };

  const handleView = (reportId: string) => {
    toast({
      title: "Opening Report",
      description: "Loading detailed view...",
    });
  };

  return (
    <AdminLayout
      title="Reports"
      subtitle="View and download school performance reports"
    >
      <div className="mb-4">
        <BackButton fallbackPath="/admin" />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">72%</p>
                <p className="text-xs text-muted-foreground">Avg. Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-xs text-muted-foreground">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Activity className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-xs text-muted-foreground">Parent Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {reports.map((report, index) => (
          <Card
            key={report.id}
            className="border-border/50 hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      report.iconColor.replace("text-", "bg-") + "/10"
                    )}
                  >
                    <report.icon className={cn("h-6 w-6", report.iconColor)} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Updated {report.lastUpdated}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {report.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Data */}
              <div className="space-y-2">
                {report.data.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {item.value}
                      </span>
                      {getTrendIcon(item.trend)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(report.id)}
                  className="gap-2 flex-1 min-w-[100px]"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefresh(report.id)}
                  className="gap-2 flex-1 min-w-[100px]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(report.id, report.title)}
                  className="gap-2 flex-1 min-w-[100px] gradient-accent text-accent-foreground"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
