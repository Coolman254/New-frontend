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
import { Users, Loader2, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const parentFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.coerce.number().min(25, "Parent must be at least 25 years old").max(80),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15).optional().or(z.literal("")),
  parentId: z.coerce.number().min(10000000, "Parent ID must be at least 8 digits").max(99999999),
  relationship: z.string().min(1, "Please specify relationship to student"),
  notificationMethod: z.enum(["app", "sms", "email"]),
  declaration: z.boolean().refine((val) => val === true, "You must accept the declaration"),
});

type ParentFormValues = z.infer<typeof parentFormSchema>;

const relationships = ["Father", "Mother", "Guardian", "Uncle", "Aunt", "Grandparent", "Sibling", "Other"];

export default function AddParentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<{ id: string; name: string; admissionNo: number }[]>([]);
  const [linkedStudents, setLinkedStudents] = useState<string[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`${API}/api/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(
            data.map((s: any) => ({
              id: s._id,
              name: `${s.firstName} ${s.lastName}`,
              admissionNo: s.admissionNo,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    }
    fetchStudents();
  }, []);

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male",
      age: 40,
      email: "",
      phone: "",
      parentId: 0,
      relationship: "",
      notificationMethod: "app",
      declaration: false,
    },
  });

  const addLinkedStudent = (studentId: string) => {
    if (!linkedStudents.includes(studentId)) {
      setLinkedStudents([...linkedStudents, studentId]);
    }
  };

  const removeLinkedStudent = (studentId: string) => {
    setLinkedStudents(linkedStudents.filter((id) => id !== studentId));
  };

  async function onSubmit(data: ParentFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/parents`, {
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
          nationalId: data.parentId,
          relationship: data.relationship,
          notificationMethod: data.notificationMethod,
          linkedStudents,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to register parent");

      toast({
        title: "Parent registered successfully",
        description: `${data.firstName} ${data.lastName} has been added to the system.`,
      });
      navigate("/admin/users");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register parent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Register Parent" subtitle="Add a new parent or guardian to the system">
      <div className="mb-6">
        <BackButton fallbackPath="/admin/add-user" />
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="font-display text-xl">Parent / Guardian Registration</CardTitle>
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
                        <FormControl><Input type="number" placeholder="40" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="parent@email.com" {...field} /></FormControl>
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

                  <FormField control={form.control} name="parentId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>National ID / Parent ID *</FormLabel>
                      <FormControl><Input type="number" placeholder="12345678" {...field} /></FormControl>
                      <FormDescription>8-digit national ID or unique parent ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Relationship Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Relationship Details</h3>
                  <FormField control={form.control} name="relationship" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Student *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationships.map((rel) => (
                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Link Students */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Link to Students</label>
                    <div className="flex gap-2">
                      <Select onValueChange={addLinkedStudent}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select student to link" />
                        </SelectTrigger>
                        <SelectContent>
                          {students
                            .filter((s) => !linkedStudents.includes(s.id))
                            .map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} (#{student.admissionNo})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {linkedStudents.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {linkedStudents.map((studentId) => {
                          const student = students.find((s) => s.id === studentId);
                          return (
                            <div key={studentId} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                              <span>{student?.name}</span>
                              <button type="button" onClick={() => removeLinkedStudent(studentId)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Select students this parent/guardian is responsible for
                    </p>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground border-b border-border pb-2">Notification Preferences</h3>
                  <FormField control={form.control} name="notificationMethod" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Notification Method *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="app" id="app" />
                            <label htmlFor="app" className="text-sm">App Notifications</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sms" id="sms" />
                            <label htmlFor="sms" className="text-sm">SMS</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email-notif" />
                            <label htmlFor="email-notif" className="text-sm">Email</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
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
                    Register Parent
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
