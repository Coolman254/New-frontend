import { useState, useEffect } from "react";
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
import { GraduationCap, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const studentFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.coerce.number().min(4, "Student must be at least 4 years old").max(25),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  admissionNo: z.coerce.number().min(1000, "Admission number must be at least 4 digits").max(99999),
  studentClass: z.string().min(1, "Please select a class"),
  stream: z.string().optional(),
  subjects: z.string().optional(),
  parentId: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  declaration: z.boolean().refine((val) => val === true, "You must accept the declaration"),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

const classes = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Form 1", "Form 2", "Form 3", "Form 4",
];

const streams = ["A", "B", "C", "D", "East", "West"];

export default function AddStudentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchParents() {
      try {
        const res = await fetch(`${API}/api/parents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setParents(
            data.map((p: any) => ({
              id: p._id,
              name: `${p.firstName} ${p.lastName}`,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch parents:", err);
      }
    }
    fetchParents();
  }, []);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male",
      age: 10,
      email: "",
      admissionNo: 0,
      studentClass: "",
      stream: "",
      subjects: "",
      parentId: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      declaration: false,
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/students`, {
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
          admissionNo: data.admissionNo,
          class: data.studentClass + (data.stream ? ` ${data.stream}` : ""),
          parentId: data.parentId || null,
          parentName: data.parentName || null,
          parentPhone: data.parentPhone || null,
          parentEmail: data.parentEmail || null,
          subjects: data.subjects || null,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to register student");

      toast({
        title: "Student registered successfully",
        description: `${data.firstName} ${data.lastName} has been added to the system.`,
      });
      navigate("/admin/users");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Register Student" subtitle="Add a new student to the system">
      <div className="mb-6">
        <BackButton fallbackPath="/admin/add-user" />
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display text-xl">Student Registration</CardTitle>
                <CardDescription>Fill in all required information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Personal Information
                  </h3>
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
                        <FormControl><Input type="number" placeholder="12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="student@globaltech.ac.ke" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Academic Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Academic Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="admissionNo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Number *</FormLabel>
                        <FormControl><Input type="number" placeholder="5012" {...field} /></FormControl>
                        <FormDescription>Unique admission number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="studentClass" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class / Grade *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="stream" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {streams.map((stream) => (
                              <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="subjects" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjects Registered</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Mathematics, English, Science, Social Studies" {...field} />
                      </FormControl>
                      <FormDescription>List all subjects the student is taking</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Parent/Guardian Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">
                    Parent / Guardian Information
                  </h3>
                  <FormField control={form.control} name="parentId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Existing Parent</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select parent (if already registered)" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parents.map((parent) => (
                            <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select an existing parent or fill in the details below for a new parent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="parentName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Name</FormLabel>
                        <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="parentPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Phone Number</FormLabel>
                        <FormControl><Input placeholder="0712 345 678" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="parentEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Email</FormLabel>
                      <FormControl><Input type="email" placeholder="parent@email.com" {...field} /></FormControl>
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
                    Register Student
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
