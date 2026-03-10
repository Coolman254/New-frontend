import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, UserCheck, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const userTypes = [
  {
    id: "teacher",
    label: "Teacher",
    description: "Register a new teacher with subject and department details",
    icon: UserCheck,
    path: "/admin/add-teacher",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "student",
    label: "Student",
    description: "Register a new student with class and parent information",
    icon: GraduationCap,
    path: "/admin/add-student",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "parent",
    label: "Parent / Guardian",
    description: "Register a parent or guardian linked to students",
    icon: Users,
    path: "/admin/add-parent",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export default function AddUserPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <AdminLayout
      title="Add New User"
      subtitle="Select user type to register"
    >
      <div className="mb-6">
        <BackButton fallbackPath="/admin" />
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl">Select User Type</CardTitle>
            <CardDescription>
              Choose the type of user you want to register in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => navigate(type.path)}
                  onMouseEnter={() => setSelectedType(type.id)}
                  onMouseLeave={() => setSelectedType(null)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-xl border border-border/50 text-left transition-all duration-200",
                    "hover:border-accent hover:bg-accent/5 group"
                  )}
                >
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                    type.bgColor
                  )}>
                    <type.icon className={cn("h-7 w-7", type.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {type.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                  <ArrowRight className={cn(
                    "h-5 w-5 text-muted-foreground transition-all",
                    "group-hover:text-accent group-hover:translate-x-1"
                  )} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
