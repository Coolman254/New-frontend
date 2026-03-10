import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Download,
  Printer,
  BookOpen,
  Users,
  GraduationCap,
  UserCheck,
  School,
  Bell,
  FileText,
  DollarSign,
  Settings,
  LogIn,
  Smartphone,
  Wifi,
  Shield,
  ChevronRight,
  Monitor,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TableOfContents = [
  { id: "introduction", title: "1. Introduction", icon: BookOpen },
  { id: "requirements", title: "2. System Requirements", icon: Monitor },
  { id: "getting-started", title: "3. Getting Started", icon: LogIn },
  { id: "admin-guide", title: "4. Admin User Guide", icon: Shield },
  { id: "teacher-guide", title: "5. Teacher User Guide", icon: UserCheck },
  { id: "parent-guide", title: "6. Parent User Guide", icon: Users },
  { id: "student-guide", title: "7. Student User Guide", icon: GraduationCap },
  { id: "finance-module", title: "8. Finance Module", icon: DollarSign },
  { id: "troubleshooting", title: "9. Troubleshooting", icon: AlertCircle },
  { id: "contact-support", title: "10. Contact & Support", icon: Info },
];

export default function UserManual() {
  const [activeSection, setActiveSection] = useState("introduction");

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version and trigger download
    const printContent = document.getElementById("manual-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Globaltech Model Academy - User Manual</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #1a365d; border-bottom: 2px solid #3182ce; padding-bottom: 10px; }
              h2 { color: #2c5282; margin-top: 30px; }
              h3 { color: #2d3748; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
              th { background-color: #edf2f7; }
              .step { background: #f7fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #3182ce; }
              .note { background: #fefcbf; padding: 15px; margin: 10px 0; border-left: 4px solid #d69e2e; }
              .warning { background: #fed7d7; padding: 15px; margin: 10px 0; border-left: 4px solid #e53e3e; }
              ul { margin-left: 20px; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <h1>📚 Globaltech Model Academy</h1>
            <h2>E-Learning Platform User Manual</h2>
            <p><strong>Version:</strong> 1.0 | <strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
            <hr/>
            
            <h2>1. Introduction</h2>
            <p>Welcome to the Globaltech Model Academy E-Learning Platform. This comprehensive system is designed to facilitate seamless communication and learning between administrators, teachers, parents, and students.</p>
            <p><strong>Motto:</strong> "Excellence Through Innovation"</p>
            <p><strong>Location:</strong> Ruiru, Kenya</p>
            <p><strong>Curriculum:</strong> CBC and 8-4-4 (Primary, Junior Secondary, Senior Secondary)</p>
            
            <h2>2. System Requirements</h2>
            <table>
              <tr><th>Requirement</th><th>Specification</th></tr>
              <tr><td>Device</td><td>Android or iOS smartphone, Tablet, or Computer</td></tr>
              <tr><td>Internet</td><td>Stable internet connection (3G minimum, 4G/WiFi recommended)</td></tr>
              <tr><td>Browser</td><td>Chrome, Safari, Firefox, or Edge (latest version)</td></tr>
              <tr><td>Account</td><td>Valid user credentials provided by the school</td></tr>
            </table>
            
            <h2>3. Getting Started</h2>
            <h3>3.1 Accessing the Application</h3>
            <div class="step"><strong>Step 1:</strong> Open your web browser or install the mobile application</div>
            <div class="step"><strong>Step 2:</strong> Navigate to the Globaltech Model Academy portal</div>
            <div class="step"><strong>Step 3:</strong> Click on "Login" button</div>
            <div class="step"><strong>Step 4:</strong> Enter your email address and password</div>
            <div class="step"><strong>Step 5:</strong> Click "Sign In" to access your dashboard</div>
            
            <h3>3.2 User Roles</h3>
            <table>
              <tr><th>Role</th><th>Access Level</th><th>Primary Functions</th></tr>
              <tr><td>Admin</td><td>Full Access</td><td>Manage all users, content, finances, and system settings</td></tr>
              <tr><td>Teacher</td><td>Moderate Access</td><td>Upload content, view assigned students, grade management</td></tr>
              <tr><td>Parent</td><td>Limited Access</td><td>View child's performance, fees, and announcements</td></tr>
              <tr><td>Student</td><td>Basic Access</td><td>Access learning materials, view grades and fees</td></tr>
            </table>
            
            <h2>4. Admin User Guide</h2>
            
            <h3>4.1 Dashboard Overview</h3>
            <p>The Admin Dashboard provides a comprehensive overview of the school's digital operations including:</p>
            <ul>
              <li>Total number of students, teachers, and parents</li>
              <li>Recent activity feed</li>
              <li>Quick action buttons for common tasks</li>
              <li>Performance charts and analytics</li>
            </ul>
            
            <h3>4.2 Managing Users</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Users from the sidebar</div>
            <div class="step"><strong>Step 2:</strong> View list of all users (Students, Teachers, Parents)</div>
            <div class="step"><strong>Step 3:</strong> Click "Add User" button to create new user</div>
            <div class="step"><strong>Step 4:</strong> Fill in required details (Name, Email, Role, etc.)</div>
            <div class="step"><strong>Step 5:</strong> Click "Save" to create the user account</div>
            
            <h3>4.3 Managing Classes</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Classes</div>
            <div class="step"><strong>Step 2:</strong> View all existing classes</div>
            <div class="step"><strong>Step 3:</strong> Click "Add Class" to create new class</div>
            <div class="step"><strong>Step 4:</strong> Assign class teacher and students</div>
            <div class="step"><strong>Step 5:</strong> Configure class schedule and subjects</div>
            
            <h3>4.4 Creating Announcements</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Announcements</div>
            <div class="step"><strong>Step 2:</strong> Click the "New Announcement" button (blue, top right)</div>
            <div class="step"><strong>Step 3:</strong> Enter the announcement title</div>
            <div class="step"><strong>Step 4:</strong> Write the announcement message in the text area</div>
            <div class="step"><strong>Step 5:</strong> Select target audience (All Users, Students Only, Teachers Only, Parents Only, Students & Parents)</div>
            <div class="step"><strong>Step 6:</strong> Click "Send Now" to publish immediately, or "Save as Draft" to save for later</div>
            
            <h4>Announcement Action Buttons:</h4>
            <ul>
              <li><strong>Edit:</strong> Modify announcement content and settings</li>
              <li><strong>Continue:</strong> Resume editing a draft announcement</li>
              <li><strong>Delete:</strong> Remove announcement (requires confirmation)</li>
            </ul>
            
            <h3>4.5 Managing Content</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Content</div>
            <div class="step"><strong>Step 2:</strong> View all uploaded materials by teachers</div>
            <div class="step"><strong>Step 3:</strong> Approve or reject pending content</div>
            <div class="step"><strong>Step 4:</strong> Remove inappropriate or outdated content</div>
            
            <h3>4.6 Generating Reports</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Reports</div>
            <div class="step"><strong>Step 2:</strong> Select report type (Student Performance, Teacher Activity, etc.)</div>
            <div class="step"><strong>Step 3:</strong> Click "View" to see detailed report</div>
            <div class="step"><strong>Step 4:</strong> Click "Download" to export as PDF</div>
            <div class="step"><strong>Step 5:</strong> Click "Refresh" to update with latest data</div>
            
            <h2>5. Teacher User Guide</h2>
            
            <h3>5.1 Dashboard Overview</h3>
            <p>The Teacher Dashboard displays:</p>
            <ul>
              <li>Assigned classes and subjects</li>
              <li>Upcoming lessons and schedules</li>
              <li>Quick access to content upload</li>
              <li>Recent announcements</li>
            </ul>
            
            <h3>5.2 Uploading Learning Materials</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Content → Upload Materials</div>
            <div class="step"><strong>Step 2:</strong> Click "Upload New Material" button</div>
            <div class="step"><strong>Step 3:</strong> Select file type (PDF, DOCX, Video, etc.)</div>
            <div class="step"><strong>Step 4:</strong> Choose the target class and subject</div>
            <div class="step"><strong>Step 5:</strong> Add title and description</div>
            <div class="step"><strong>Step 6:</strong> Click "Upload" to submit for approval</div>
            
            <h3>5.3 Viewing Student Fee Status</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Finance from the dashboard</div>
            <div class="step"><strong>Step 2:</strong> View fee clearance status for assigned students</div>
            <div class="note"><strong>Note:</strong> Teachers can only view clearance status (Cleared/Pending). Actual amounts are not visible for privacy.</div>
            
            <h2>6. Parent User Guide</h2>
            
            <h3>6.1 Dashboard Overview</h3>
            <p>The Parent Dashboard provides:</p>
            <ul>
              <li>Child's academic performance summary</li>
              <li>Fee balance and payment history</li>
              <li>School announcements</li>
              <li>Teacher contact information</li>
            </ul>
            
            <h3>6.2 Viewing Child's Academic Progress</h3>
            <div class="step"><strong>Step 1:</strong> Log in to the parent portal</div>
            <div class="step"><strong>Step 2:</strong> View performance summary on dashboard</div>
            <div class="step"><strong>Step 3:</strong> Click on subject areas for detailed grades</div>
            
            <h3>6.3 Managing Fees</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Finance from the dashboard</div>
            <div class="step"><strong>Step 2:</strong> View total fees, amount paid, and balance</div>
            <div class="step"><strong>Step 3:</strong> Review payment history with dates and methods</div>
            <div class="step"><strong>Step 4:</strong> Download fee statement using the "Download Statement" button</div>
            
            <h2>7. Student User Guide</h2>
            
            <h3>7.1 Dashboard Overview</h3>
            <p>The Student Dashboard shows:</p>
            <ul>
              <li>Personal academic performance</li>
              <li>Available learning materials</li>
              <li>Fee balance (read-only)</li>
              <li>School announcements</li>
            </ul>
            
            <h3>7.2 Accessing Learning Materials</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to E-Learning section</div>
            <div class="step"><strong>Step 2:</strong> Select your class and subject</div>
            <div class="step"><strong>Step 3:</strong> Browse available materials</div>
            <div class="step"><strong>Step 4:</strong> Click "Download" to save materials</div>
            <div class="step"><strong>Step 5:</strong> Click "View" to read online</div>
            
            <h3>7.3 Viewing Fee Status</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Finance from the dashboard</div>
            <div class="step"><strong>Step 2:</strong> View your fee balance and payment progress</div>
            <div class="note"><strong>Note:</strong> Students have read-only access to their fee information.</div>
            
            <h2>8. Finance Module</h2>
            
            <h3>8.1 Overview</h3>
            <p>The Finance Module provides comprehensive school financial management with strict role-based access controls and data privacy. All financial transactions are logged for auditing purposes.</p>
            
            <h3>8.2 Role-Based Access Control</h3>
            
            <h4>Admin Access - Full Control</h4>
            <ul>
              <li>Create and update fee structures for different classes and terms</li>
              <li>View all student financial records and balances</li>
              <li>Record and verify student payments</li>
              <li>Generate termly and annual finance reports</li>
              <li>Update payment status (Cleared/Partial/Pending)</li>
              <li>Access complete financial audit logs</li>
            </ul>
            
            <h4>Teacher Access - Limited Read-Only</h4>
            <ul>
              <li>View fee clearance status for assigned classes only</li>
              <li>See student names and clearance status (Cleared, Partial, or Pending)</li>
              <li><strong>NO ACCESS to:</strong> Specific payment amounts, payment methods, or financial reports</li>
              <li>Cannot modify any financial data</li>
            </ul>
            
            <h4>Parent Access - Child-Specific View</h4>
            <ul>
              <li>View linked child's fee balance and outstanding amount</li>
              <li>Access complete payment history with dates and amounts</li>
              <li>Download fee statements and payment receipts</li>
              <li>Receive fee reminder notifications</li>
              <li>View payment methods used</li>
              <li>Cannot access other students' records</li>
            </ul>
            
            <h4>Student Access - Personal Read-Only</h4>
            <ul>
              <li>View personal fee balance and payment status</li>
              <li>View total fees and amount already paid</li>
              <li>See outstanding balance</li>
              <li>Access personal payment history</li>
              <li>Read-only access only</li>
            </ul>
            
            <h3>8.3 Financial Data Fields</h3>
            <table>
              <tr><th>Field</th><th>Description</th></tr>
              <tr><td>Student Name</td><td>Full name of the student</td></tr>
              <tr><td>Admission Number</td><td>Unique student ID for identification</td></tr>
              <tr><td>Class</td><td>Current class/form assigned to student</td></tr>
              <tr><td>Academic Year</td><td>School year (e.g., 2024-2025)</td></tr>
              <tr><td>Academic Term</td><td>Term 1, 2, or 3</td></tr>
              <tr><td>Total Fees Payable</td><td>Complete fee amount for the term</td></tr>
              <tr><td>Amount Paid</td><td>Total amount paid to date</td></tr>
              <tr><td>Outstanding Balance</td><td>Remaining balance to be paid</td></tr>
              <tr><td>Payment Date</td><td>Date payment was received</td></tr>
              <tr><td>Payment Method</td><td>How payment was made (Cash, M-Pesa, Bank, Cheque, etc.)</td></tr>
              <tr><td>Receipt Number</td><td>Unique receipt identifier for verification</td></tr>
            </table>
            
            <h3>8.4 Admin - Managing Fee Structures</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Finance</div>
            <div class="step"><strong>Step 2:</strong> Click "Fee Structures" tab</div>
            <div class="step"><strong>Step 3:</strong> Click "Add Fee Structure" button</div>
            <div class="step"><strong>Step 4:</strong> Enter academic year (e.g., 2024)</div>
            <div class="step"><strong>Step 5:</strong> Select term (Term 1, 2, or 3)</div>
            <div class="step"><strong>Step 6:</strong> Select class (Form 1, 2, 3, 4, etc.)</div>
            <div class="step"><strong>Step 7:</strong> Enter fee type (Tuition, Boarding, Transport, etc.)</div>
            <div class="step"><strong>Step 8:</strong> Enter amount in KSH</div>
            <div class="step"><strong>Step 9:</strong> Click "Save" to create fee structure</div>
            
            <h3>8.5 Admin - Recording Payments</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Finance</div>
            <div class="step"><strong>Step 2:</strong> Click "Student Payments" tab</div>
            <div class="step"><strong>Step 3:</strong> Click "Record Payment" button</div>
            <div class="step"><strong>Step 4:</strong> Select the student from the dropdown</div>
            <div class="step"><strong>Step 5:</strong> Enter payment amount</div>
            <div class="step"><strong>Step 6:</strong> Select payment method (Cash, M-Pesa, Bank Transfer, etc.)</div>
            <div class="step"><strong>Step 7:</strong> Enter payment date</div>
            <div class="step"><strong>Step 8:</strong> Add receipt number (optional)</div>
            <div class="step"><strong>Step 9:</strong> Add notes (optional - e.g., "Partial payment Term 1")</div>
            <div class="step"><strong>Step 10:</strong> Click "Save Payment" to record</div>
            
            <h3>8.6 Admin - Viewing Financial Reports</h3>
            <div class="step"><strong>Step 1:</strong> Navigate to Admin → Finance</div>
            <div class="step"><strong>Step 2:</strong> Click "Reports" tab</div>
            <div class="step"><strong>Step 3:</strong> Select report type:</div>
            <ul>
              <li><strong>Student Fee Balance Report:</strong> Shows all students with balances</li>
              <li><strong>Payment Collection Report:</strong> Total payments received by period</li>
              <li><strong>Defaulter Report:</strong> Students with outstanding balances</li>
              <li><strong>Term Summary:</strong> Complete term-wise financial summary</li>
            </ul>
            <div class="step"><strong>Step 4:</strong> Select academic year and term filters</div>
            <div class="step"><strong>Step 5:</strong> Click "Generate Report"</div>
            <div class="step"><strong>Step 6:</strong> Click "Download as PDF" to export</div>
            
            <h3>8.7 Parent - Viewing Child's Fees</h3>
            <div class="step"><strong>Step 1:</strong> Log in to parent account</div>
            <div class="step"><strong>Step 2:</strong> Navigate to Finance from dashboard</div>
            <div class="step"><strong>Step 3:</strong> View child's fee summary showing:</div>
            <ul>
              <li>Total fees for current term</li>
              <li>Amount paid to date</li>
              <li>Outstanding balance</li>
              <li>Payment status indicator</li>
            </ul>
            <div class="step"><strong>Step 4:</strong> Click on a payment to view details</div>
            <div class="step"><strong>Step 5:</strong> Click "Download Statement" to save fee summary as PDF</div>
            
            <h3>8.8 Student - Viewing Fee Balance</h3>
            <div class="step"><strong>Step 1:</strong> Log in to student account</div>
            <div class="step"><strong>Step 2:</strong> Navigate to Finance from dashboard</div>
            <div class="step"><strong>Step 3:</strong> View personal fee information (read-only):</div>
            <ul>
              <li>Total fees payable</li>
              <li>Amount paid</li>
              <li>Outstanding balance</li>
              <li>Current payment status</li>
            </ul>
            <div class="step"><strong>Step 4:</strong> View payment history list</div>
            <div class="note"><strong>Reminder:</strong> If you have an outstanding balance, inform your parent/guardian to make payment to avoid suspension from school activities.</div>
            
            <h3>8.9 Security & Privacy Measures</h3>
            <ul>
              <li><strong>Data Encryption:</strong> All financial information is encrypted in transit and at rest</li>
              <li><strong>Access Control:</strong> Parents restricted to linked student accounts only</li>
              <li><strong>Teacher Restrictions:</strong> Teachers cannot view monetary amounts, only clearance status</li>
              <li><strong>Audit Logging:</strong> Every financial action is logged with timestamp and user information</li>
              <li><strong>Role-Based Views:</strong> Different users see only information relevant to their role</li>
              <li><strong>Payment Verification:</strong> Only admins can verify and record payments</li>
            </ul>
            
            <h2>9. Troubleshooting</h2>
            
            <h3>Common Issues and Solutions</h3>
            
            <table>
              <tr><th>Issue</th><th>Solution</th></tr>
              <tr><td>Cannot log in</td><td>Verify credentials, check internet connection, contact admin for password reset</td></tr>
              <tr><td>Page not loading</td><td>Clear browser cache, try different browser, check internet connection</td></tr>
              <tr><td>Content not displaying</td><td>Refresh the page, check if content is approved, verify class assignment</td></tr>
              <tr><td>Fee information incorrect</td><td>Contact school administration for fee record verification</td></tr>
              <tr><td>Announcement not received</td><td>Check target audience settings, verify notification preferences</td></tr>
            </table>
            
            <h2>10. Contact & Support</h2>
            
            <p><strong>Globaltech Model Academy</strong></p>
            <p>Location: Ruiru, Kenya</p>
            <p>Email: info@globaltech.ac.ke</p>
            <p>Phone: +254 700 000 000</p>
            <p>Website: www.globaltech.ac.ke</p>
            
            <div class="note">
              <strong>Technical Support Hours:</strong><br/>
              Monday - Friday: 8:00 AM - 5:00 PM<br/>
              Saturday: 9:00 AM - 1:00 PM<br/>
              Sunday: Closed
            </div>
            
            <hr/>
            <p style="text-align: center; color: #718096; margin-top: 40px;">
              © ${new Date().getFullYear()} Globaltech Model Academy. All Rights Reserved.<br/>
              "Excellence Through Innovation"
            </p>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold">
                      User Manual
                    </h1>
                    <p className="text-primary-foreground/80">
                      Globaltech Model Academy E-Learning Platform
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Version 1.0
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Last Updated: {new Date().toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrint}
                  variant="secondary"
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  onClick={handleDownload}
                  className="gap-2 bg-white text-primary hover:bg-white/90"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl py-8 px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-display">
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1 pb-4">
                    {TableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                          activeSection === item.id
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8" id="manual-content">
              {/* 1. Introduction */}
              <section id="introduction" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      1. Introduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Welcome to the <strong>Globaltech Model Academy E-Learning Platform</strong>. 
                      This comprehensive user manual provides step-by-step guidance on how to use 
                      all features of the platform effectively.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold mb-2">School Information</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            Globaltech Model Academy
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Motto: "Excellence Through Innovation"
                          </li>
                          <li className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Location: Ruiru, Kenya
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold mb-2">Curriculum Offered</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• CBC (Competency Based Curriculum)</li>
                          <li>• 8-4-4 System</li>
                          <li>• Primary, Junior Secondary, Senior Secondary</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 2. System Requirements */}
              <section id="requirements" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Monitor className="h-6 w-6 text-primary" />
                      </div>
                      2. System Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-4 p-4 border rounded-xl">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Smartphone className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Device</h4>
                          <p className="text-sm text-muted-foreground">
                            Android or iOS smartphone, Tablet, or Computer
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 border rounded-xl">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Wifi className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Internet Connection</h4>
                          <p className="text-sm text-muted-foreground">
                            Stable connection (3G minimum, 4G/WiFi recommended)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 border rounded-xl">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Monitor className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Web Browser</h4>
                          <p className="text-sm text-muted-foreground">
                            Chrome, Safari, Firefox, or Edge (latest version)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 border rounded-xl">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Shield className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Valid Account</h4>
                          <p className="text-sm text-muted-foreground">
                            User credentials provided by school administration
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 3. Getting Started */}
              <section id="getting-started" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <LogIn className="h-6 w-6 text-primary" />
                      </div>
                      3. Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">3.1 Accessing the Application</h3>
                      <div className="space-y-3">
                        {[
                          "Open your web browser or install the mobile application",
                          "Navigate to the Globaltech Model Academy portal URL",
                          "Click on the 'Login' button on the homepage",
                          "Enter your email address and password",
                          "Click 'Sign In' to access your personalized dashboard",
                        ].map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-foreground pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">3.2 User Roles & Access Levels</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border p-3 text-left">Role</th>
                              <th className="border p-3 text-left">Access Level</th>
                              <th className="border p-3 text-left">Primary Functions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-3">
                                <Badge className="bg-primary/10 text-primary">Admin</Badge>
                              </td>
                              <td className="border p-3">Full Access</td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                Manage all users, content, finances, and system settings
                              </td>
                            </tr>
                            <tr className="bg-muted/30">
                              <td className="border p-3">
                                <Badge className="bg-accent/10 text-accent">Teacher</Badge>
                              </td>
                              <td className="border p-3">Moderate Access</td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                Upload content, view assigned students, grade management
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-3">
                                <Badge className="bg-success/10 text-success">Parent</Badge>
                              </td>
                              <td className="border p-3">Limited Access</td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                View child's performance, fees, and announcements
                              </td>
                            </tr>
                            <tr className="bg-muted/30">
                              <td className="border p-3">
                                <Badge className="bg-warning/10 text-warning">Student</Badge>
                              </td>
                              <td className="border p-3">Basic Access</td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                Access learning materials, view grades and fees
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 4. Admin User Guide */}
              <section id="admin-guide" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      4. Admin User Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="dashboard">
                        <AccordionTrigger className="text-lg font-semibold">
                          4.1 Dashboard Overview
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <p className="text-muted-foreground">
                            The Admin Dashboard provides a comprehensive overview of the school's digital operations:
                          </p>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {[
                              "Total students, teachers, and parents count",
                              "Recent activity feed with real-time updates",
                              "Quick action buttons for common tasks",
                              "Performance charts and analytics",
                              "System health and status indicators",
                              "Pending approvals and notifications",
                            ].map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-success" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="users">
                        <AccordionTrigger className="text-lg font-semibold">
                          4.2 Managing Users
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              { step: "Navigate to Admin → Users from the sidebar", icon: ChevronRight },
                              { step: "View list of all users (Students, Teachers, Parents)", icon: Eye },
                              { step: "Click 'Add User' button to create new user", icon: Plus },
                              { step: "Fill in required details (Name, Email, Role, etc.)", icon: Edit },
                              { step: "Click 'Save' to create the user account", icon: CheckCircle },
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                  <item.icon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{item.step}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                            <h5 className="font-semibold text-warning mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Available Buttons
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="gap-1">
                                <Plus className="h-3 w-3" /> Add User
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Edit className="h-3 w-3" /> Edit
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Trash2 className="h-3 w-3" /> Delete
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <Search className="h-3 w-3" /> Search
                              </Badge>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="classes">
                        <AccordionTrigger className="text-lg font-semibold">
                          4.3 Managing Classes
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Admin → Classes from the sidebar",
                              "View all existing classes in the list",
                              "Click 'Add Class' button to create new class",
                              "Assign class teacher and add students",
                              "Configure class schedule and subjects",
                              "Click 'Save' to finalize class creation",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="announcements">
                        <AccordionTrigger className="text-lg font-semibold">
                          4.4 Creating Announcements
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Admin → Announcements from the sidebar",
                              "Click the 'New Announcement' button (gradient blue, top right)",
                              "Enter the announcement title in the Title field",
                              "Write the announcement message in the text area",
                              "Select target audience from dropdown (All Users, Students Only, Teachers Only, Parents Only, Students & Parents)",
                              "Click 'Send Now' to publish immediately, or 'Save as Draft' to save for later",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4" />

                          <div>
                            <h5 className="font-semibold mb-3">Announcement Action Buttons:</h5>
                            <div className="grid sm:grid-cols-3 gap-4">
                              <div className="p-4 border rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Edit className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Edit</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Modify announcement content and settings
                                </p>
                              </div>
                              <div className="p-4 border rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <ChevronRight className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Continue</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Resume editing a draft announcement
                                </p>
                              </div>
                              <div className="p-4 border rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                  <span className="font-medium">Delete</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Remove announcement (requires confirmation)
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="content">
                        <AccordionTrigger className="text-lg font-semibold">
                          4.5 Managing Content
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Admin → Content from the sidebar",
                              "View all uploaded materials by teachers",
                              "Review pending content awaiting approval",
                              "Click 'Approve' to make content available to students",
                              "Click 'Reject' to decline inappropriate content",
                              "Use 'Delete' to remove outdated materials",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="reports">
                        <AccordionTrigger className="text-lg font-semibold">
                          4.6 Generating Reports
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Admin → Reports from the sidebar",
                              "Select report type (Student Performance, Teacher Activity, Content Usage, Parent Engagement, Financial Summary)",
                              "Click 'View' to see detailed report data",
                              "Click 'Refresh' to update with latest data",
                              "Click 'Download' to export report as PDF",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-info/10 border border-info/30 rounded-xl">
                            <h5 className="font-semibold text-info mb-2 flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Available Report Types
                            </h5>
                            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                              <li>• Student Performance Report</li>
                              <li>• Teacher Activity Report</li>
                              <li>• Content Usage Report</li>
                              <li>• Parent Engagement Report</li>
                              <li>• Financial Summary Report</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* 5. Teacher User Guide */}
              <section id="teacher-guide" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <UserCheck className="h-6 w-6 text-accent" />
                      </div>
                      5. Teacher User Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="teacher-dashboard">
                        <AccordionTrigger className="text-lg font-semibold">
                          5.1 Dashboard Overview
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <p className="text-muted-foreground">
                            The Teacher Dashboard displays essential information for daily teaching activities:
                          </p>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {[
                              "Assigned classes and subjects",
                              "Upcoming lessons and schedules",
                              "Quick access to content upload",
                              "Recent school announcements",
                              "Student attendance summary",
                              "Pending assignments to grade",
                            ].map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-accent" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="upload-materials">
                        <AccordionTrigger className="text-lg font-semibold">
                          5.2 Uploading Learning Materials
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Content → Upload Materials",
                              "Click 'Upload New Material' button",
                              "Select file type (PDF, DOCX, Video, etc.)",
                              "Choose the target class and subject",
                              "Add descriptive title and description",
                              "Click 'Upload' to submit for admin approval",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-muted rounded-xl">
                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Supported File Formats
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">PDF</Badge>
                              <Badge variant="secondary">DOCX</Badge>
                              <Badge variant="secondary">PPTX</Badge>
                              <Badge variant="secondary">MP4</Badge>
                              <Badge variant="secondary">MP3</Badge>
                              <Badge variant="secondary">Images</Badge>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="teacher-finance">
                        <AccordionTrigger className="text-lg font-semibold">
                          5.3 Viewing Student Fee Status
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Finance from the dashboard",
                              "View fee clearance status for assigned students",
                              "Filter by class or student name",
                              "Check status badges (Cleared, Partial, Pending)",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                            <h5 className="font-semibold text-warning mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Important Note
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              Teachers can only view clearance status (Cleared/Pending). 
                              Actual fee amounts are not visible for privacy and security reasons.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* 6. Parent User Guide */}
              <section id="parent-guide" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <Users className="h-6 w-6 text-success" />
                      </div>
                      6. Parent User Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="parent-dashboard">
                        <AccordionTrigger className="text-lg font-semibold">
                          6.1 Dashboard Overview
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <p className="text-muted-foreground">
                            The Parent Dashboard provides a comprehensive view of your child's academic journey:
                          </p>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {[
                              "Child's academic performance summary",
                              "Current fee balance and payment history",
                              "School announcements and notifications",
                              "Teacher contact information",
                              "Attendance records",
                              "Upcoming events and schedules",
                            ].map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-success" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="parent-academics">
                        <AccordionTrigger className="text-lg font-semibold">
                          6.2 Viewing Child's Academic Progress
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Log in to the parent portal with your credentials",
                              "View performance summary on the dashboard",
                              "Click on subject areas for detailed grades",
                              "Review teacher comments and feedback",
                              "Download report cards when available",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-success-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="parent-fees">
                        <AccordionTrigger className="text-lg font-semibold">
                          6.3 Managing Fees
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Finance from the dashboard",
                              "View total fees, amount paid, and outstanding balance",
                              "Review complete payment history with dates and methods",
                              "Click 'Download Statement' to save fee statement",
                              "Receive notifications for upcoming fee deadlines",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success text-success-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* 7. Student User Guide */}
              <section id="student-guide" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-warning" />
                      </div>
                      7. Student User Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="student-dashboard">
                        <AccordionTrigger className="text-lg font-semibold">
                          7.1 Dashboard Overview
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <p className="text-muted-foreground">
                            The Student Dashboard is your central hub for learning:
                          </p>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {[
                              "Personal academic performance grades",
                              "Available learning materials by subject",
                              "Fee balance (read-only)",
                              "School announcements",
                              "Class timetable and schedule",
                              "Assignment submissions",
                            ].map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-warning" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="learning-materials">
                        <AccordionTrigger className="text-lg font-semibold">
                          7.2 Accessing Learning Materials
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to E-Learning section from dashboard",
                              "Select your class and subject",
                              "Browse available materials uploaded by teachers",
                              "Click 'Download' to save materials to your device",
                              "Click 'View' to read materials online",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning text-warning-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="student-fees">
                        <AccordionTrigger className="text-lg font-semibold">
                          7.3 Viewing Fee Status
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-3">
                            {[
                              "Navigate to Finance from the dashboard",
                              "View your current fee balance",
                              "Check payment progress bar",
                              "See fee breakdown by term",
                            ].map((step, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning text-warning-foreground font-semibold text-xs">
                                  {index + 1}
                                </div>
                                <span className="text-sm pt-0.5">{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-info/10 border border-info/30 rounded-xl">
                            <h5 className="font-semibold text-info mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              Note
                            </h5>
                            <p className="text-sm text-muted-foreground">
                              Students have read-only access to fee information. 
                              Contact your parent or the school administration for payment-related queries.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* 8. Finance Module */}
              <section id="finance-module" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      8. Finance Module
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">8.1 Role-Based Access Overview</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border p-3 text-left">Role</th>
                              <th className="border p-3 text-left">Access</th>
                              <th className="border p-3 text-left">Capabilities</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-3 font-medium">Admin</td>
                              <td className="border p-3">
                                <Badge className="bg-success/10 text-success">Full</Badge>
                              </td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                Create fee structures, record payments, generate reports, update payment status
                              </td>
                            </tr>
                            <tr className="bg-muted/30">
                              <td className="border p-3 font-medium">Teacher</td>
                              <td className="border p-3">
                                <Badge className="bg-warning/10 text-warning">Read-Only</Badge>
                              </td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                View student clearance status only (no amounts visible)
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-3 font-medium">Parent</td>
                              <td className="border p-3">
                                <Badge className="bg-accent/10 text-accent">Limited</Badge>
                              </td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                View child's fees, payment history, download statements
                              </td>
                            </tr>
                            <tr className="bg-muted/30">
                              <td className="border p-3 font-medium">Student</td>
                              <td className="border p-3">
                                <Badge className="bg-muted text-muted-foreground">Read-Only</Badge>
                              </td>
                              <td className="border p-3 text-sm text-muted-foreground">
                                View personal fee balance only
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">8.2 Finance Data Captured</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          "Student name and admission number",
                          "Class and academic term/year",
                          "Total fees payable",
                          "Amount paid to date",
                          "Outstanding balance",
                          "Payment date and method",
                          "Receipt/reference numbers",
                          "Payment status tracking",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                      <h5 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security & Privacy
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Parents restricted to linked student accounts only</li>
                        <li>• Students restricted to personal records only</li>
                        <li>• Teachers blocked from viewing monetary values</li>
                        <li>• All finance actions logged for auditing</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 9. Troubleshooting */}
              <section id="troubleshooting" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                      </div>
                      9. Troubleshooting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          issue: "Cannot log in",
                          solution: "Verify your credentials are correct. Check your internet connection. Contact admin for password reset if needed.",
                        },
                        {
                          issue: "Page not loading",
                          solution: "Clear your browser cache and cookies. Try a different browser. Check if your internet connection is stable.",
                        },
                        {
                          issue: "Content not displaying",
                          solution: "Refresh the page. Check if the content has been approved by admin. Verify your class assignment is correct.",
                        },
                        {
                          issue: "Fee information appears incorrect",
                          solution: "Contact the school administration for fee record verification. Wait for records to sync if recent payment was made.",
                        },
                        {
                          issue: "Announcement not received",
                          solution: "Check target audience settings for the announcement. Verify your notification preferences are enabled.",
                        },
                        {
                          issue: "File upload fails",
                          solution: "Check file size limits (max 10MB). Ensure file format is supported. Try compressing large files before upload.",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-destructive/10 rounded-lg mt-0.5">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{item.issue}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 10. Contact & Support */}
              <section id="contact-support" className="scroll-mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-display">
                      <div className="p-2 bg-info/10 rounded-lg">
                        <Info className="h-6 w-6 text-info" />
                      </div>
                      10. Contact & Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="p-6 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <School className="h-5 w-5 text-primary" />
                          School Information
                        </h4>
                        <ul className="space-y-3 text-sm">
                          <li><strong>Name:</strong> Globaltech Model Academy</li>
                          <li><strong>Location:</strong> Ruiru, Kenya</li>
                          <li><strong>Email:</strong> info@globaltech.ac.ke</li>
                          <li><strong>Phone:</strong> +254 700 000 000</li>
                          <li><strong>Website:</strong> www.globaltech.ac.ke</li>
                        </ul>
                      </div>
                      <div className="p-6 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Settings className="h-5 w-5 text-primary" />
                          Technical Support Hours
                        </h4>
                        <ul className="space-y-3 text-sm">
                          <li><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</li>
                          <li><strong>Saturday:</strong> 9:00 AM - 1:00 PM</li>
                          <li><strong>Sunday:</strong> Closed</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl text-center">
                      <p className="text-lg font-display font-semibold text-foreground mb-2">
                        "Excellence Through Innovation"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Globaltech Model Academy. All Rights Reserved.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
