import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  GraduationCap,
  UserCheck,
  Users,
  BookOpen,
  BarChart3,
  Bell,
  FileText,
  Calendar,
  MessageCircle,
  Download,
  Settings,
  ArrowRight,
} from "lucide-react";

const studentFeatures = [
  { icon: BookOpen, title: "Learning Materials", desc: "Access notes, PDFs, videos, and revision materials organized by subject" },
  { icon: BarChart3, title: "Performance Tracking", desc: "View your grades, rankings, and progress over time" },
  { icon: Calendar, title: "Assignments", desc: "View pending assignments and submit your work online" },
  { icon: Bell, title: "Notifications", desc: "Stay updated with announcements and important dates" },
  { icon: Download, title: "Downloads", desc: "Download materials for offline study" },
  { icon: MessageCircle, title: "Communication", desc: "Message your teachers for guidance and support" },
];

const teacherFeatures = [
  { icon: FileText, title: "Content Management", desc: "Upload and organize learning materials for your classes" },
  { icon: BarChart3, title: "Grade Entry", desc: "Enter and manage student grades for exams and assessments" },
  { icon: Users, title: "Class Management", desc: "View and manage your assigned classes and students" },
  { icon: Bell, title: "Announcements", desc: "Send announcements to students and parents" },
  { icon: Calendar, title: "Assignments", desc: "Create and track student assignments" },
  { icon: MessageCircle, title: "Parent Communication", desc: "Communicate with parents about student progress" },
];

const parentFeatures = [
  { icon: BarChart3, title: "Progress Monitoring", desc: "Track your child's academic performance and grades" },
  { icon: Calendar, title: "Attendance", desc: "View your child's attendance records" },
  { icon: Bell, title: "Notifications", desc: "Receive updates about your child's activities and school events" },
  { icon: MessageCircle, title: "Teacher Communication", desc: "Message teachers directly for feedback and concerns" },
  { icon: FileText, title: "Report Cards", desc: "View and download your child's report cards" },
  { icon: Settings, title: "Account Settings", desc: "Manage your profile and notification preferences" },
];

export default function InfoPage() {
  return (
    <PublicLayout pageTitle="Platform Info" showBackButton>
      {/* Hero */}
      <section className="py-12 md:py-16 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl md:text-4xl font-bold">Platform Information</h1>
          <p className="mt-3 md:mt-4 text-sm md:text-lg opacity-80 max-w-2xl mx-auto">
            Discover how our e-learning platform helps students, teachers, and parents 
            stay connected and engaged in the learning process.
          </p>
        </div>
      </section>

      {/* Portal Guides */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="student" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 h-auto">
              <TabsTrigger value="student" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 min-h-[48px] text-xs md:text-sm">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden md:inline">Student Portal</span>
                <span className="md:hidden">Student</span>
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 min-h-[48px] text-xs md:text-sm">
                <UserCheck className="h-4 w-4" />
                <span className="hidden md:inline">Teacher Portal</span>
                <span className="md:hidden">Teacher</span>
              </TabsTrigger>
              <TabsTrigger value="parent" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 min-h-[48px] text-xs md:text-sm">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Parent Portal</span>
                <span className="md:hidden">Parent</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card className="border-border/50">
                <CardHeader className="py-4 md:py-6">
                  <CardTitle className="flex items-center gap-3 text-lg md:text-2xl">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-accent/10">
                      <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    Student Portal Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                    The Student Portal is your central hub for learning. Access all your 
                    educational materials, track your performance, and stay connected.
                  </p>
                  <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                    {studentFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-border/50 bg-muted/20"
                      >
                        <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-accent mb-2 md:mb-3" />
                        <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                          {feature.title}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 md:mt-8 text-center">
                    <Button asChild size="lg" className="min-h-[48px] w-full md:w-auto gradient-accent text-accent-foreground">
                      <Link to="/login">
                        Access Student Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teacher">
              <Card className="border-border/50">
                <CardHeader className="py-4 md:py-6">
                  <CardTitle className="flex items-center gap-3 text-lg md:text-2xl">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-accent/10">
                      <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    Teacher Portal Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                    The Teacher Portal empowers educators to manage their classes, share 
                    learning materials, and communicate effectively with students and parents.
                  </p>
                  <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                    {teacherFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-border/50 bg-muted/20"
                      >
                        <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-accent mb-2 md:mb-3" />
                        <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                          {feature.title}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 md:mt-8 text-center">
                    <Button asChild size="lg" className="min-h-[48px] w-full md:w-auto gradient-accent text-accent-foreground">
                      <Link to="/login">
                        Access Teacher Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parent">
              <Card className="border-border/50">
                <CardHeader className="py-4 md:py-6">
                  <CardTitle className="flex items-center gap-3 text-lg md:text-2xl">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-accent/10">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    Parent Portal Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                    The Parent Portal keeps you connected with your child's education. 
                    Monitor progress, communicate with teachers, and stay informed.
                  </p>
                  <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                    {parentFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-border/50 bg-muted/20"
                      >
                        <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-accent mb-2 md:mb-3" />
                        <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                          {feature.title}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 md:mt-8 text-center">
                    <Button asChild size="lg" className="min-h-[48px] w-full md:w-auto gradient-accent text-accent-foreground">
                      <Link to="/login">
                        Access Parent Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-xl md:text-3xl font-bold text-foreground">
              Getting Started
            </h2>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
              Follow these simple steps to start using the platform
            </p>
          </div>

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Sign In", desc: "Use your school-provided credentials to log into your portal" },
              { step: "2", title: "Explore", desc: "Navigate through the dashboard to discover all features" },
              { step: "3", title: "Engage", desc: "Start accessing materials, tracking progress, and communicating" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full gradient-accent text-accent-foreground font-bold text-lg md:text-xl mx-auto mb-3 md:mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
