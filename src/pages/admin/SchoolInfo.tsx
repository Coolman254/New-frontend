import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/ui/back-button";
import {
  School,
  MapPin,
  Phone,
  Mail,
  Award,
  BookOpen,
  Save,
  Edit,
  X,
  Building,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SchoolData {
  name: string;
  motto: string;
  location: string;
  type: string;
  about: string;
  phone: string;
  email: string;
  sections: string[];
  curriculum: string[];
}

export default function SchoolInfoPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [schoolData, setSchoolData] = useState<SchoolData>({
    name: "Globaltech Model Academy",
    motto: "Excellence Through Innovation",
    location: "Ruiru, Kenya",
    type: "Primary & Secondary Institution",
    about:
      "Globaltech Model Academy is a modern learning institution committed to academic excellence, innovation, and holistic student development. The school integrates technology into teaching and learning to enhance student performance and parental engagement.",
    phone: "+254 7XX XXX XXX",
    email: "info@globaltechacademy.ac.ke",
    sections: ["Primary Section", "Junior Secondary Section", "Senior Secondary Section"],
    curriculum: ["CBC (Competency Based Curriculum)", "8-4-4 (Transition Classes)"],
  });

  const [editData, setEditData] = useState<SchoolData>(schoolData);

  const handleSave = () => {
    setSchoolData(editData);
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "School information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditData(schoolData);
    setIsEditing(false);
  };

  return (
    <AdminLayout
      title="School Information"
      subtitle="View and manage school details"
    >
      <div className="mb-4">
        <BackButton fallbackPath="/admin" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                General Information
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="gap-2 gradient-accent text-accent-foreground"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* School Name */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">School Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-xl font-bold text-foreground">
                    {schoolData.name}
                  </p>
                )}
              </div>

              {/* Motto */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Motto
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.motto}
                    onChange={(e) =>
                      setEditData({ ...editData, motto: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-lg italic text-primary">"{schoolData.motto}"</p>
                )}
              </div>

              {/* Location & Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{schoolData.location}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    School Type
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.type}
                      onChange={(e) =>
                        setEditData({ ...editData, type: e.target.value })
                      }
                    />
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      {schoolData.type}
                    </Badge>
                  )}
                </div>
              </div>

              {/* About */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">About the School</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.about}
                    onChange={(e) =>
                      setEditData({ ...editData, about: e.target.value })
                    }
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {schoolData.about}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Structure */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Academic Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-muted-foreground">Sections</Label>
                  <div className="space-y-2">
                    {schoolData.sections.map((section, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-foreground">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Curriculum Offered
                  </Label>
                  <div className="space-y-2">
                    {schoolData.curriculum.map((curr, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/10"
                      >
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span className="text-foreground">{curr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium">{schoolData.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground font-medium break-all">
                    {schoolData.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 gradient-hero text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-lg mb-2">Quick Tip</h3>
              <p className="text-sm opacity-80">
                Keep your school information updated to ensure accurate
                communication with students, parents, and staff.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
