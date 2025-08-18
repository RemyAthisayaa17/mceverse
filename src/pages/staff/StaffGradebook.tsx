import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, TrendingUp, Users, Award } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const gradeData = [
  {
    subject: "Advanced Algorithms",
    students: 45,
    averageGrade: 82.5,
    highestGrade: 98,
    lowestGrade: 65,
    passRate: 92
  },
  {
    subject: "Database Systems", 
    students: 38,
    averageGrade: 78.3,
    highestGrade: 95,
    lowestGrade: 58,
    passRate: 89
  },
  {
    subject: "Software Engineering",
    students: 52,
    averageGrade: 85.1,
    highestGrade: 100,
    lowestGrade: 70,
    passRate: 96
  }
];

const recentGrades = [
  {
    student: "Alice Johnson",
    subject: "Advanced Algorithms",
    assignment: "Midterm Exam",
    grade: 92,
    date: "2024-11-15"
  },
  {
    student: "Bob Smith",
    subject: "Database Systems", 
    assignment: "Project Phase 1",
    grade: 88,
    date: "2024-11-14"
  },
  {
    student: "Carol Davis",
    subject: "Software Engineering",
    assignment: "Requirements Analysis",
    grade: 95,
    date: "2024-11-13"
  }
];

const StaffGradebook = () => {
  return (
    <div className="min-h-screen bg-gradient-pastel">
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
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">
                    {gradeData.reduce((sum, subject) => sum + subject.students, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-mint">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Grade</p>
                  <p className="text-3xl font-bold text-foreground">
                    {(gradeData.reduce((sum, subject) => sum + subject.averageGrade, 0) / gradeData.length).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {(gradeData.reduce((sum, subject) => sum + subject.passRate, 0) / gradeData.length).toFixed(1)}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="text-3xl font-bold text-foreground">{gradeData.length}</p>
                </div>
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{gradeData.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Performance */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Subject Performance</h2>
            {gradeData.map((subject, index) => (
              <Card key={index} className="rounded-2xl shadow-card border-border/20 bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.subject}</CardTitle>
                    <Badge variant="secondary" className="rounded-lg">
                      {subject.students} students
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="text-xl font-bold text-foreground">{subject.averageGrade}%</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-xl font-bold text-foreground">{subject.passRate}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Highest: {subject.highestGrade}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lowest: {subject.lowestGrade}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-border/20 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${subject.averageGrade}%` }}
                    />
                  </div>
                  <Button className="w-full rounded-xl bg-gradient-card-mint hover:bg-gradient-card-mint/80 text-foreground">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Grades */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Grades</h2>
            <Card className="rounded-2xl shadow-card border-border/20 bg-card">
              <CardHeader>
                <CardTitle>Latest Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="space-y-1">
                      <p className="font-medium">{grade.student}</p>
                      <p className="text-sm text-muted-foreground">{grade.subject}</p>
                      <p className="text-xs text-muted-foreground">{grade.assignment}</p>
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

            {/* Quick Actions */}
            <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">
                  Enter New Grades
                </Button>
                <Button variant="outline" className="w-full rounded-xl border-border/30">
                  Generate Class Report
                </Button>
                <Button variant="outline" className="w-full rounded-xl border-border/30">
                  Export Grade Sheet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffGradebook;