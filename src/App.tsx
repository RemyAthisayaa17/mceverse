import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StaffRegister from "./pages/StaffRegister";
import StudentRegister from "./pages/StudentRegister";
import StaffLogin from "./pages/StaffLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffSubjects from "./pages/staff/StaffSubjects";
import StaffStudents from "./pages/staff/StaffStudents";
import StaffAssignments from "./pages/staff/StaffAssignments";
import StaffGradebook from "./pages/staff/StaffGradebook";
import StaffSchedule from "./pages/staff/StaffSchedule";
import StaffResources from "./pages/staff/StaffResources";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/staff-register" element={<StaffRegister />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/subjects" element={<StaffSubjects />} />
          <Route path="/staff/students" element={<StaffStudents />} />
          <Route path="/staff/assignments" element={<StaffAssignments />} />
          <Route path="/staff/gradebook" element={<StaffGradebook />} />
          <Route path="/staff/schedule" element={<StaffSchedule />} />
          <Route path="/staff/resources" element={<StaffResources />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
