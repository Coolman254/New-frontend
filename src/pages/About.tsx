import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for academic and moral excellence in everything we do.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We uphold honesty, transparency, and ethical behavior at all times.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster a supportive environment where everyone belongs.",
  },
  {
    icon: BookOpen,
    title: "Innovation",
    description: "We embrace modern teaching methods and technology in education.",
  },
];

const milestones = [
  { year: "1995", event: "School founded with 50 students" },
  { year: "2005", event: "Expanded to include secondary section" },
  { year: "2015", event: "Introduced digital learning resources" },
  { year: "2023", event: "Launched comprehensive e-learning platform" },
];

export default function AboutPage() {
  return (
    <PublicLayout pageTitle="About Us" showBackButton>
      {/* Hero Section */}
      <section className="py-12 md:py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold">
            About Globaltech Model Academy
          </h1>
          <p className="mt-4 text-sm md:text-lg opacity-80 max-w-2xl mx-auto">
            A premier learning institution committed to nurturing tomorrow's leaders
            through quality education and holistic development.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 mb-6">
                  <Target className="h-7 w-7 text-accent" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide quality education that develops the intellectual, 
                  physical, social, and moral capabilities of every learner, 
                  preparing them to be responsible and productive citizens in 
                  a rapidly changing world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 mb-6">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be a center of excellence in education, recognized for 
                  producing well-rounded individuals who excel academically 
                  and contribute positively to society through innovation, 
                  leadership, and service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Our Core Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Our Journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              Key milestones in our history
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-accent-foreground font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-display font-bold text-foreground">
                    {milestone.year}
                  </p>
                  <p className="text-muted-foreground mt-1">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Award className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Join Our Community
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Be part of a school that values every student and is committed to 
            their success in academics and life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-accent text-accent-foreground min-h-[48px]">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[48px]">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
