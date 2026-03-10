import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Bell, Shield, Globe, Palette, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Your changes have been saved successfully." });
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure school and application settings">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="gap-2"><School className="h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="system" className="gap-2"><Database className="h-4 w-4" /> System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Update your school details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input defaultValue="Globaltech Model Academy" />
                </div>
                <div className="space-y-2">
                  <Label>School Motto</Label>
                  <Input defaultValue="Empowering Education Through Technology" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="info@globaltech.ac.ke" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+254 700 123456" />
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input defaultValue="Nairobi" />
                </div>
                <div className="space-y-2">
                  <Label>Sub-County</Label>
                  <Input defaultValue="Westlands" />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current Academic Year</Label>
                  <Select defaultValue="2026">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Term</Label>
                  <Select defaultValue="1">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Term 1</SelectItem>
                      <SelectItem value="2">Term 2</SelectItem>
                      <SelectItem value="3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSave} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Email Notifications", desc: "Receive email alerts for important updates", default: true },
                { label: "SMS Notifications", desc: "Send SMS alerts to parents and teachers", default: false },
                { label: "Fee Payment Reminders", desc: "Auto-send fee balance reminders to parents", default: true },
                { label: "New Announcement Alerts", desc: "Notify users when announcements are published", default: true },
                { label: "Report Card Notifications", desc: "Alert parents when report cards are ready", default: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
              <Button onClick={handleSave} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" /> Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage authentication and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Enforce Strong Passwords", desc: "Require 8+ characters with mixed case, numbers, and symbols", default: true },
                { label: "Two-Factor Authentication", desc: "Require 2FA for admin accounts", default: false },
                { label: "Session Timeout", desc: "Auto-logout after 30 minutes of inactivity", default: true },
                { label: "Login Attempt Limiting", desc: "Lock account after 5 failed login attempts", default: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <Label>Password Expiry (days)</Label>
                <Input type="number" defaultValue="90" className="w-32" />
              </div>
              <Button onClick={handleSave} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" /> Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce spacing for denser information display</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleSave} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" /> Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Database and system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Data Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Log Retention (days)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable access for non-admin users</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Audit Logging</p>
                  <p className="text-sm text-muted-foreground">Track all user actions for compliance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" /> Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
