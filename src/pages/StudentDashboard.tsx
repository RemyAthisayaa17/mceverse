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
  Bell,
  ClipboardList
} from "lucide-react";
import StudentProfile from "@/components/student/StudentProfile";
import StudentAttendance from "@/components/student/StudentAttendance";
import StudentGrades from "@/components/student/StudentGrades";
import StudentResources from "@/components/student/StudentResources";
import StudentAssignments from "@/components/student/StudentAssignments";
import StudentNotifications from "@/components/student/StudentNotifications";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (studentProfile?.id) {
      fetchUnreadCount();
    }
  }, [studentProfile]);

  const fetchUnreadCount = async () => {
    const { count } = await supabase
      .from("student_notifications")
      .select("*", { count: "exact", head: true })
      .eq("student_id", studentProfile.id)
      .eq("is_read", false);
    
    setUnreadCount(count || 0);
  };

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
                className="rounded-full hover:bg-secondary/20 relative"
                onClick={() => {
                  const tabs = document.querySelector('[role="tablist"]');
                  const notifTab = tabs?.querySelector('[value="notifications"]') as HTMLElement;
                  notifTab?.click();
                }}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
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
              value="assignments"
              className="rounded-xl data-[state=active]:bg-gradient-card-mint data-[state=active]:text-foreground"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger 
              value="resources"
              className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-foreground"
            >
              <FileText className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="rounded-xl data-[state=active]:bg-gradient-card-pink data-[state=active]:text-foreground relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                  {unreadCount}
                </span>
              )}
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

          <TabsContent value="assignments" className="space-y-6">
            <StudentAssignments studentId={studentProfile?.id} />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <StudentResources />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <StudentNotifications studentId={studentProfile?.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
