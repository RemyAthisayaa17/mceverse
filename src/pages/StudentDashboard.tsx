import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Calendar, 
  BookOpen, 
  FileText, 
  LogOut,
  Bell
} from "lucide-react";
import StudentProfile from "@/components/student/StudentProfile";
import StudentAttendance from "@/components/student/StudentAttendance";
import StudentGrades from "@/components/student/StudentGrades";
import StudentResources from "@/components/student/StudentResources";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/student-login");
      return;
    }

    // Fetch student profile
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setStudentProfile(data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/student-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-pastel">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-card-lavender flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Student Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {studentProfile?.full_name || "Student"}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary/20"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card/80 backdrop-blur-sm p-1 rounded-2xl shadow-soft border border-border/30">
            <TabsTrigger 
              value="profile" 
              className="rounded-xl data-[state=active]:bg-gradient-card-lavender data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="rounded-xl data-[state=active]:bg-gradient-card-mint data-[state=active]:text-foreground"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger 
              value="grades"
              className="rounded-xl data-[state=active]:bg-gradient-card-pink data-[state=active]:text-foreground"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Gradebook
            </TabsTrigger>
            <TabsTrigger 
              value="resources"
              className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-foreground"
            >
              <FileText className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <StudentProfile profile={studentProfile} onUpdate={setStudentProfile} />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <StudentAttendance studentId={studentProfile?.id} />
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <StudentGrades studentId={studentProfile?.id} />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <StudentResources />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
