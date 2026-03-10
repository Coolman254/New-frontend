import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/ui/back-button";
import { Plus, Bell, Clock, Users, Send, Trash2, Edit, Save, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const announcements = [
  {
    id: 1,
    title: "School Reopening for Term Two",
    message:
      "Globaltech Model Academy will reopen for Term Two on 15th May 2026. All students are required to report on time in full school uniform.",
    audience: "Students & Parents",
    date: "May 10, 2026",
    time: "9:00 AM",
    status: "Sent",
  },
  {
    id: 2,
    title: "Mid-Term Examinations",
    message:
      "Mid-term examinations will begin on 3rd June 2026. Students are advised to revise using materials uploaded on the E-learning platform.",
    audience: "Students & Parents",
    date: "May 25, 2026",
    time: "10:30 AM",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Parents–Teachers Meeting",
    message:
      "A parents–teachers meeting will be held on Saturday, 22nd June 2026, starting at 9:00 AM. Attendance is mandatory.",
    audience: "Parents",
    date: "Jun 15, 2026",
    time: "8:00 AM",
    status: "Scheduled",
  },
  {
    id: 4,
    title: "New Revision Materials Uploaded",
    message:
      "Teachers have uploaded new revision materials for all classes. Students are encouraged to download and revise early.",
    audience: "Students",
    date: "May 8, 2026",
    time: "2:15 PM",
    status: "Sent",
  },
];

const audienceColors: Record<string, string> = {
  All: "bg-primary/10 text-primary",
  Students: "bg-accent/10 text-accent",
  Teachers: "bg-info/10 text-info",
  Parents: "bg-success/10 text-success",
  "Students & Parents": "bg-warning/10 text-warning",
};

const statusColors: Record<string, string> = {
  Sent: "bg-success/10 text-success",
  Scheduled: "bg-warning/10 text-warning",
  Draft: "bg-muted text-muted-foreground",
};

export default function AnnouncementsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSendNow = () => {
    setIsDialogOpen(false);
    toast({
      title: "Announcement Sent",
      description: "Your announcement has been sent successfully.",
    });
  };

  const handleSaveDraft = () => {
    setIsDialogOpen(false);
    toast({
      title: "Draft Saved",
      description: "Your announcement has been saved as a draft.",
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed.",
      variant: "destructive",
    });
  };

  const handleEdit = (id: number) => {
    toast({
      title: "Edit Mode",
      description: "Opening announcement for editing...",
    });
  };

  const handleContinue = (id: number) => {
    toast({
      title: "Continuing...",
      description: "Loading announcement details...",
    });
  };

  return (
    <AdminLayout
      title="Announcements"
      subtitle="Create and manage school announcements"
    >
      <div className="mb-4">
        <BackButton fallbackPath="/admin" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Announcements List */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="font-display text-lg">
                All Announcements
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-accent text-accent-foreground hover:opacity-90">
                    <Plus className="mr-2 h-4 w-4" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      Create Announcement
                    </DialogTitle>
                    <DialogDescription>
                      Send a new announcement to students, teachers, or parents.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Announcement title..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your announcement..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="students">Students Only</SelectItem>
                          <SelectItem value="teachers">Teachers Only</SelectItem>
                          <SelectItem value="parents">Parents Only</SelectItem>
                          <SelectItem value="students-parents">Students & Parents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={handleSendNow}
                      className="gradient-accent text-accent-foreground gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Now
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 flex-shrink-0">
                      <Bell className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground">
                          {announcement.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-medium w-fit",
                            statusColors[announcement.status]
                          )}
                        >
                          {announcement.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {announcement.message}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs font-medium",
                              audienceColors[announcement.audience] || audienceColors["All"]
                            )}
                          >
                            {announcement.audience}
                          </Badge>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {announcement.date} at {announcement.time}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(announcement.id)}
                          className="gap-2 min-h-[44px]"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContinue(announcement.id)}
                          className="gap-2 min-h-[44px]"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Continue
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 min-h-[44px] text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the announcement.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(announcement.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  Total Sent
                </span>
                <span className="text-2xl font-bold text-foreground">156</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="text-2xl font-bold text-accent">24</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <span className="text-2xl font-bold text-warning">3</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Drafts</span>
                <span className="text-2xl font-bold text-muted-foreground">
                  5
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 gradient-hero text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-lg mb-2">Quick Tip</h3>
              <p className="text-sm opacity-80">
                Schedule announcements in advance for better planning. Parents
                appreciate timely notifications about school events!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}