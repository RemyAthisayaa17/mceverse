import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Download, TrendingUp, Users, Award, Edit, FileSpreadsheet, BarChart3 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { EnterGradeModal } from "@/components/gradebook/EnterGradeModal";
import { ClassReportModal } from "@/components/gradebook/ClassReportModal";
import { EditProfileModal } from "@/components/gradebook/EditProfileModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportGradeSheet, exportClassReport } from "@/utils/exportUtils";

interface RecentGrade {
  id: string;
  student_name: string;
  subject_name: string;
  subject_code: string;
  assignment_name: string;
  grade: number;
  date: string;
}

interface StaffProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
}

const StaffGradebook = () => {
  const [recentGrades, setRecentGrades] = useState<RecentGrade[]>([]);
  const [gradeStats, setGradeStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    passRate: 0,
    subjectCount: 0
  });
  const [enterGradeModalOpen, setEnterGradeModalOpen] = useState(false);
  const [classReportModalOpen, setClassReportModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffProfile>({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.edu",
    role: "Mathematics Department Head",
    phone: "+1 (555) 123-4567"
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGradeData();
  }, []);

  const fetchGradeData = async () => {
    try {
      // This would normally fetch from Supabase, but using mock data for now
      // since the database tables might not be set up yet
      const mockRecentGrades: RecentGrade[] = [
        {
          id: "1",
          student_name: "Alice Johnson",
          subject_name: "Advanced Algorithms",
          subject_code: "CS401",
          assignment_name: "Midterm Exam",
          grade: 92,
          date: "2024-11-15"
        },
        {
          id: "2",
          student_name: "Bob Smith",
          subject_name: "Database Systems",
          subject_code: "CS301",
          assignment_name: "Project Phase 1",
          grade: 88,
          date: "2024-11-14"
        },
        {
          id: "3",
          student_name: "Carol Davis",
          subject_name: "Software Engineering",
          subject_code: "CS350",
          assignment_name: "Requirements Analysis",
          grade: 95,
          date: "2024-11-13"
        }
      ];

      setRecentGrades(mockRecentGrades);
      setGradeStats({
        totalStudents: 135,
        averageGrade: 81.9,
        passRate: 92.3,
        subjectCount: 3
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch grade data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportGradeSheet = () => {
    const exportData = recentGrades.map(grade => ({
      student_name: grade.student_name,
      subject_name: grade.subject_name,
      subject_code: grade.subject_code,
      assignment_name: grade.assignment_name,
      grade: grade.grade,
      date: grade.date
    }));
    
    exportGradeSheet(exportData, 'excel');
    toast({
      title: "Success",
      description: "Grade sheet exported successfully",
      className: "bg-gradient-card-mint border-border/20",
    });
  };

  const handleExportReport = () => {
    const mockStats = {
      totalStudents: gradeStats.totalStudents,
      averageGrade: gradeStats.averageGrade,
      highestGrade: 98,
      lowestGrade: 58,
      passRate: gradeStats.passRate,
      subjectStats: [
        {
          name: "Advanced Algorithms",
          code: "CS401", 
          averageGrade: 82.5,
          studentCount: 45,
          passRate: 92
        },
        {
          name: "Database Systems",
          code: "CS301",
          averageGrade: 78.3,
          studentCount: 38,
          passRate: 89
        },
        {
          name: "Software Engineering",
          code: "CS350",
          averageGrade: 85.1,
          studentCount: 52,
          passRate: 96
        }
      ]
    };
    
    exportClassReport(mockStats);
    toast({
      title: "Success", 
      description: "Class report exported successfully",
      className: "bg-gradient-card-mint border-border/20",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-pastel font-poppins">
      {/* Top Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/staff/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gradebook</h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/staff/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Gradebook</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300"
              onClick={handleExportReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Staff Profile Section */}
        <div className="mb-8">
          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 ring-4 ring-primary/20">
                    <AvatarImage src="/api/placeholder/64/64" alt={staffProfile.name} />
                    <AvatarFallback className="bg-gradient-card-pink text-foreground font-semibold text-lg">
                      {staffProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{staffProfile.name}</h2>
                    <p className="text-muted-foreground">{staffProfile.role}</p>
                    <p className="text-sm text-muted-foreground">{staffProfile.email}</p>
                    {staffProfile.phone && (
                      <p className="text-sm text-muted-foreground">{staffProfile.phone}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl border-border/30 hover:bg-background/50"
                  onClick={() => setEditProfileModalOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">{gradeStats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-mint transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Grade</p>
                  <p className="text-3xl font-bold text-foreground">{gradeStats.averageGrade.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-3xl font-bold text-foreground">{gradeStats.passRate.toFixed(1)}%</p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="text-3xl font-bold text-foreground">{gradeStats.subjectCount}</p>
                </div>
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{gradeStats.subjectCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Grades */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Grade Entries</h2>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/30"
                onClick={handleExportGradeSheet}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Sheet
              </Button>
            </div>
            
            <Card className="rounded-2xl shadow-card border-border/20 bg-card">
              <CardContent className="p-6 space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300">
                    <div className="space-y-1">
                      <p className="font-medium">{grade.student_name}</p>
                      <p className="text-sm text-muted-foreground">{grade.subject_name}</p>
                      <p className="text-xs text-muted-foreground">{grade.assignment_name}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={grade.grade >= 90 ? 'default' : grade.grade >= 80 ? 'secondary' : 'outline'}
                        className="rounded-lg mb-1"
                      >
                        {grade.grade}%
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(grade.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            
            <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
              <CardHeader>
                <CardTitle className="text-lg">Grade Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-soft hover:shadow-hover transition-all duration-300"
                  onClick={() => setEnterGradeModalOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Enter New Grades
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-border/30 hover:bg-background/50 transition-all duration-300"
                  onClick={() => setClassReportModalOpen(true)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Class Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-border/30 hover:bg-background/50 transition-all duration-300"
                  onClick={handleExportGradeSheet}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Grade Sheet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EnterGradeModal
        open={enterGradeModalOpen}
        onOpenChange={setEnterGradeModalOpen}
        onGradeAdded={fetchGradeData}
      />
      
      <ClassReportModal
        open={classReportModalOpen}
        onOpenChange={setClassReportModalOpen}
      />
      
      <EditProfileModal
        open={editProfileModalOpen}
        onOpenChange={setEditProfileModalOpen}
        currentProfile={staffProfile}
        onProfileUpdated={setStaffProfile}
      />
    </div>
  );
};

export default StaffGradebook;