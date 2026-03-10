import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const teacherFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.coerce.number().min(21, "Teacher must be at least 21 years old").max(70),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).optional().or(z.literal("")),
  teacherId: z.coerce.number().min(1000, "Employee number must be at least 4 digits").max(9999),
  subject: z.string().min(1, "Please select a subject"),
  salaryKsh: z.coerce.number().min(20000, "Minimum salary is KSH 20,000").max(200000),
  employmentType: z.enum(["fulltime", "parttime"]),
  classesAssigned: z.string().optional(),
  declaration: z.boolean().refine((val) => val === true, "You must accept the declaration"),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

const subjects = [
  "Mathematics", "English", "Kiswahili", "Physics", "Chemistry", "Biology",
  "History", "Geography", "CRE", "IRE", "Business Studies", "Agriculture",
  "Computer Studies", "Physical Education", "Art & Design", "Music", "French", "German",
];

export default function AddTeacherPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male",
      age: 30,
      email: "",
      phone: "",
      teacherId: 0,
      subject: "",
      salaryKsh: 50000,
      employmentType: "fulltime",
      classesAssigned: "",
      declaration: false,
    },
  });

  async function onSubmit(data: TeacherFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          age: data.age,
          email: data.email || null,
          phone: data.phone || null,
          teacherId: data.teacherId,
          subject: data.subject,
          salaryKsh: data.salaryKsh,
          employmentType: data.employmentType,
          classesAssigned: data.classesAssigned || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to register teacher");

      toast({
        title: "Teacher registered successfully",
        description: `${data.firstName} ${data.lastName} has been added to the system.`,
      });
      navigate("/admin/users");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register teacher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Register Teacher" subtitle="Add a new teacher to the system">
      <div className="mb-6">
        <BackButton fallbackPath="/admin/add-user" />
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <UserCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="font-display text-xl">Teacher Registration</CardTitle>
                <CardDescription>Fill in all required information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl><Input placeholder="Enter first name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl><Input placeholder="Enter last name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Male" id="male" />
                              <label htmlFor="male" className="text-sm">Male</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Female" id="female" />
                              <label htmlFor="female" className="text-sm">Female</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Other" id="other" />
                              <label htmlFor="other" className="text-sm">Other</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="teacher@globaltech.ac.ke" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="0712 345 678" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Employment Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Employment Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="teacherId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Number *</FormLabel>
                        <FormControl><Input type="number" placeholder="1234" {...field} /></FormControl>
                        <FormDescription>Unique 4-digit employee ID</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="salaryKsh" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (KSH) *</FormLabel>
                        <FormControl><Input type="number" placeholder="50000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="employmentType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fulltime" id="fulltime" />
                              <label htmlFor="fulltime" className="text-sm">Full Time</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="parttime" id="parttime" />
                              <label htmlFor="parttime" className="text-sm">Part Time</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="classesAssigned" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classes Assigned</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Form 1A, Form 2B, Form 3A" {...field} />
                      </FormControl>
                      <FormDescription>List all classes this teacher will handle</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Declaration */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Declaration</h3>
                  <FormField control={form.control} name="declaration" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I confirm that the information provided above is true and accurate</FormLabel>
                        <FormDescription>By checking this box, you verify that all details are correct</FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/admin/add-user")}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-accent text-accent-foreground" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register Teacher
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
