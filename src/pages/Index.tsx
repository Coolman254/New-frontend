import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  GraduationCap,
  BookOpen,
  Users,
  Bell,
  BarChart3,
  FileText,
  ArrowRight,
  CheckCircle,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Student Portal",
    description:
      "Access revision materials, download notes, track grades, and view assignments all in one place.",
  },
  {
    icon: BookOpen,
    title: "Teacher Dashboard",
    description:
      "Upload materials, manage classes, enter marks, and communicate with students and parents.",
  },
  {
    icon: Users,
    title: "Parent Access",
    description:
      "Monitor your child's progress, receive notifications, and communicate with teachers.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Visual progress charts, term summaries, and downloadable report cards.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Stay updated with instant alerts for grades, announcements, and important events.",
  },
  {
    icon: FileText,
    title: "Content Library",
    description:
      "Comprehensive repository of notes, PDFs, videos, and revision materials.",
  },
];

const stats = [
  { value: "1,245+", label: "Students" },
  { value: "48", label: "Teachers" },
  { value: "24", label: "Classes" },
  { value: "890+", label: "Parents" },
];

export default function LandingPage() {
  return (
    <PublicLayout pageTitle="Globaltech Academy">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23222222%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs md:text-sm font-medium text-accent">
              <Smartphone className="h-4 w-4" />
              Now available on mobile
            </div>
            
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground animate-slide-up">
              Transform Learning at{" "}
              <span className="text-gradient">Globaltech Model Academy</span>
            </h1>
            
            <p className="mt-4 md:mt-6 text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
              A comprehensive e-learning platform connecting students, teachers, and
              parents. Access materials, track progress, and stay connected.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-h-[48px] px-8 gradient-accent text-accent-foreground font-semibold hover:opacity-90 shadow-glow"
              >
                <Link to="/login">
                  Access Your Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-h-[48px] px-8"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 md:mt-20 grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 md:p-6 rounded-2xl bg-card border border-border shadow-sm animate-scale-in"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <p className="font-display text-xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Everything You Need to Excel
            </h2>
            <p className="mt-3 md:mt-4 text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools for every member of the Globaltech Model Academy community
            </p>
          </div>

          {/* Single column on mobile, grid on larger screens */}
          <div className="space-y-4 md:space-y-0 md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card hover:shadow-lg transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-4 font-display text-lg md:text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-2xl md:rounded-3xl gradient-hero p-6 md:p-8 lg:p-12 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            
            <div className="relative z-10">
              <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="mt-3 md:mt-4 text-sm md:text-lg opacity-80 max-w-xl mx-auto">
                Join the Globaltech Model Academy learning community today.
              </p>

              <ul className="mt-6 md:mt-8 flex flex-col md:flex-row flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm">
                {[
                  "Free for registered students",
                  "Parent dashboard included",
                  "24/7 access to materials",
                ].map((item, index) => (
                  <li key={index} className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="mt-6 md:mt-8 min-h-[48px] w-full sm:w-auto px-8 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-glow"
              >
                <Link to="/login">
                  Sign In Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
