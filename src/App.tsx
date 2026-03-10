import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Navigate } from 'react-router-dom';
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import UsersPage from "@/pages/admin/Users";
import AnnouncementsPage from "@/pages/admin/Announcements";
import SchoolInfoPage from "@/pages/admin/SchoolInfo";
import ReportsPage from "@/pages/admin/Reports";
import AddUserPage from "@/pages/admin/AddUser";
import AddTeacherPage from "@/pages/admin/AddTeacher";
import AddStudentPage from "@/pages/admin/AddStudent";
import AddParentPage from "@/pages/admin/AddParent";
import NotFound from "@/pages/NotFound";
import UserManual from "@/pages/UserManual";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Help from "@/pages/Help";
import Info from "@/pages/Info";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentLogin from "@/pages/student/StudentLogin";
import StudentFinance from "@/pages/student/Finance";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherFinance from "@/pages/teacher/Finance";
import ParentDashboard from "@/pages/parent/Dashboard";
import ParentFinance from "@/pages/parent/Finance";
import AdminFinance from "@/pages/admin/Finance";
import ClassesPage from "@/pages/admin/Classes";
import SettingsPage from "@/pages/admin/Settings";
import ContentPage from "@/pages/admin/Content";
import AdminUserAccounts from "@/pages/admin/UserAccounts";
import SetStudentPassword from "@/pages/admin/SetStudentPassword";
import StudentMaterials from "@/pages/student/StudentMaterials";
import MaterialsPage  from "@/pages/student/MaterialsPage";
import NotesPage      from "@/pages/student/NotesPage";
import ReportCardPage from "@/pages/student/ReportCardPage";
import ParentAcademicReport from "@/pages/parent/AcademicReport";
import TeacherGradeEntry from "@/pages/teacher/GradeEntry";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/info" element={<Info />} />
            <Route path="/user-manual" element={<UserManual />} />

            {/* Student Routes */}
            <Route path="/student/login"     element={<StudentLogin />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/finance"   element={<StudentFinance />} />
            <Route path="/student"           element={<Navigate to="/student/login" />} />
            <Route path="/student/materials" element={<StudentMaterials />} />
            <Route path="/student/materials"   element={<MaterialsPage  />} />
            <Route path="/student/notes"       element={<NotesPage      />} />
            <Route path="/student/report-card" element={<ReportCardPage />} />
            

            {/* Teacher Routes */}
            <Route path="/teacher"         element={<TeacherDashboard />} />
            <Route path="/teacher/finance" element={<TeacherFinance />} />

            {/* Parent Routes */}
            <Route path="/parent"         element={<ParentDashboard />} />
            <Route path="/parent/finance" element={<ParentFinance />} />

            {/* Admin Routes */}
            <Route path="/admin"                element={<AdminDashboard />} />
            <Route path="/admin/users"          element={<UsersPage />} />
            <Route path="/admin/students"       element={<UsersPage />} />
            <Route path="/admin/teachers"       element={<UsersPage />} />
            <Route path="/admin/parents"        element={<UsersPage />} />
            <Route path="/admin/announcements"  element={<AnnouncementsPage />} />
            <Route path="/admin/school-info"    element={<SchoolInfoPage />} />
            <Route path="/admin/reports"        element={<ReportsPage />} />
            <Route path="/admin/finance"        element={<AdminFinance />} />
            <Route path="/admin/add-user"       element={<AddUserPage />} />
            <Route path="/admin/add-teacher"    element={<AddTeacherPage />} />
            <Route path="/admin/add-student"    element={<AddStudentPage />} />
            <Route path="/admin/add-parent"     element={<AddParentPage />} />
            <Route path="/admin/classes"        element={<ClassesPage />} />
            <Route path="/admin/settings"       element={<SettingsPage />} />
            <Route path="/admin/content"        element={<ContentPage />} />
            <Route path="/admin/users/accounts" element={<AdminUserAccounts />} />
            <Route path="/admin/set-student-password" element={<SetStudentPassword />} />
            {/* Parent Academic Report */}
            <Route path="/parent/academic-report/:childId" element={<ParentAcademicReport />} />

            {/* Teacher Grade Entry */}
            <Route path="/teacher/grades" element={<TeacherGradeEntry />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
