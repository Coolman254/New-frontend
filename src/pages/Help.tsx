import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  BookOpen,
  Key,
  Monitor,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const faqs = [
  {
    category: "Account & Login",
    icon: Key,
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click on 'Forgot Password' on the login page and enter your registered email. You'll receive a password reset link within a few minutes.",
      },
      {
        q: "I can't log into my account. What should I do?",
        a: "First, ensure you're using the correct email and password. If you've forgotten your password, use the reset option. If issues persist, contact the school administrator.",
      },
      {
        q: "How do I update my profile information?",
        a: "After logging in, go to Settings > Profile. You can update your contact information, profile picture, and notification preferences.",
      },
    ],
  },
  {
    category: "For Students",
    icon: BookOpen,
    questions: [
      {
        q: "How do I access my learning materials?",
        a: "After logging in to the Student Portal, navigate to 'Materials' or 'Resources' section. You can filter by subject, class, or topic.",
      },
      {
        q: "How can I view my grades and progress?",
        a: "Go to the 'Performance' or 'Grades' section in your dashboard. You'll see your scores, rankings, and progress charts for each subject.",
      },
      {
        q: "How do I submit assignments?",
        a: "Navigate to 'Assignments', select the assignment you want to submit, upload your file or enter your response, and click Submit.",
      },
    ],
  },
  {
    category: "For Parents",
    icon: Monitor,
    questions: [
      {
        q: "How do I link my child's account to mine?",
        a: "Contact the school administrator with your child's admission number. They will link the accounts, allowing you to view your child's progress.",
      },
      {
        q: "How do I view my child's performance?",
        a: "After logging in, you'll see a dashboard with all your linked children. Click on a child's profile to view their grades, attendance, and teacher feedback.",
      },
      {
        q: "How do I communicate with teachers?",
        a: "Use the 'Messages' section to send messages to your child's teachers. You can also view announcements and scheduled parent-teacher meetings.",
      },
    ],
  },
  {
    category: "For Teachers",
    icon: MessageCircle,
    questions: [
      {
        q: "How do I upload learning materials?",
        a: "Go to 'Content' > 'Upload Materials'. Select the class, subject, and topic, then upload your files (PDFs, videos, etc.).",
      },
      {
        q: "How do I enter student grades?",
        a: "Navigate to 'Grades' > 'Enter Marks'. Select the class, subject, and exam type, then enter the scores for each student.",
      },
      {
        q: "How do I create and send announcements?",
        a: "Go to 'Announcements' > 'Create New'. Write your message, select the target audience (students, parents, or both), and click Publish.",
      },
    ],
  },
];

const quickLinks = [
  { title: "Student Guide", icon: BookOpen, href: "/info" },
  { title: "Parent Guide", icon: Monitor, href: "/info" },
  { title: "Teacher Guide", icon: MessageCircle, href: "/info" },
  { title: "Contact Support", icon: HelpCircle, href: "/contact" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PublicLayout pageTitle="Help Center" showBackButton>
      {/* Hero */}
      <section className="py-12 md:py-16 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-80" />
          <h1 className="font-display text-2xl md:text-4xl font-bold">Help Center</h1>
          <p className="mt-3 md:mt-4 text-sm md:text-lg opacity-80 max-w-xl mx-auto">
            Find answers to common questions and learn how to use the platform.
          </p>

          {/* Search */}
          <div className="mt-6 md:mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for help..."
              className="h-12 min-h-[48px] pl-12 bg-background text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.href}>
                <Card className="border-border/50 hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-4 md:p-6 text-center">
                    <link.icon className="h-6 w-6 md:h-8 md:w-8 text-accent mx-auto mb-2 md:mb-3" />
                    <p className="font-medium text-foreground text-sm md:text-base">{link.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-xl md:text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
              Browse by category or search for specific topics
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {faqs.map((category, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader className="py-4 md:py-6">
                  <CardTitle className="flex items-center gap-3 text-base md:text-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <category.icon className="h-5 w-5 text-accent" />
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                        <AccordionTrigger className="text-left text-sm md:text-base min-h-[48px]">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
            Still Need Help?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Our support team is ready to assist you with any questions.
          </p>
          <Button asChild size="lg" className="min-h-[48px] gradient-accent text-accent-foreground">
            <Link to="/contact">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
