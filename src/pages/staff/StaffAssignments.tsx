import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar, Clock, Edit, Trash2, Upload } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const assignments = [
  {
    id: 1,
    title: "Algorithm Analysis Project",
    subject: "Advanced Algorithms",
    dueDate: "2024-12-15",
    status: "active",
    submissions: 23,
    totalStudents: 45,
    description: "Implement and analyze time complexity of sorting algorithms"
  },
  {
    id: 2,
    title: "Database Design Assignment",
    subject: "Database Systems", 
    dueDate: "2024-12-20",
    status: "active",
    submissions: 15,
    totalStudents: 38,
    description: "Design a normalized database schema for e-commerce system"
  },
  {
    id: 3,
    title: "Software Requirements Document",
    subject: "Software Engineering",
    dueDate: "2024-12-10",
    status: "overdue",
    submissions: 40,
    totalStudents: 52,
    description: "Create comprehensive SRS for mobile banking application"
  }
];

const StaffAssignments = () => {
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
                <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/staff/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Assignments</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assignments</p>
                  <p className="text-3xl font-bold text-foreground">{assignments.length}</p>
                </div>
                <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-mint">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-foreground">
                    {assignments.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                  <p className="text-3xl font-bold text-foreground">
                    {assignments.reduce((sum, a) => sum + a.submissions, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="rounded-2xl shadow-card border-border/20 hover:shadow-hover transition-all duration-300 bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{assignment.title}</CardTitle>
                      <Badge 
                        variant={assignment.status === 'active' ? 'default' : 'destructive'}
                        className="rounded-lg"
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Subject: {assignment.subject}
                    </p>
                    <p className="text-sm text-foreground">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-destructive/10 rounded-lg">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Submissions</p>
                    <p className="font-medium">
                      {assignment.submissions} / {assignment.totalStudents}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <div className="w-full bg-border/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button className="rounded-xl bg-gradient-card-mint hover:bg-gradient-card-mint/80 text-foreground">
                    View Submissions
                  </Button>
                  <Button variant="outline" className="rounded-xl border-border/30">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffAssignments;