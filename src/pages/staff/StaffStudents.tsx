import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, User, CheckCircle, XCircle, Edit } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const students = [
  {
    id: 1,
    name: "Alice Johnson",
    rollNo: "CS001",
    email: "alice@university.edu",
    phone: "+1234567890",
    subjects: ["Advanced Algorithms", "Database Systems"],
    attendance: 85,
    status: "active"
  },
  {
    id: 2,
    name: "Bob Smith", 
    rollNo: "CS002",
    email: "bob@university.edu",
    phone: "+1234567891",
    subjects: ["Advanced Algorithms", "Software Engineering"],
    attendance: 92,
    status: "active"
  },
  {
    id: 3,
    name: "Carol Davis",
    rollNo: "CS003", 
    email: "carol@university.edu",
    phone: "+1234567892",
    subjects: ["Database Systems", "Software Engineering"],
    attendance: 78,
    status: "active"
  }
];

const StaffStudents = () => {
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
                <h1 className="text-2xl font-bold text-foreground">Students</h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/staff/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Students</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] rounded-xl">
            <TabsTrigger value="profiles" className="rounded-lg">Student Profiles</TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-lg">Attendance</TabsTrigger>
            <TabsTrigger value="marks" className="rounded-lg">Marks</TabsTrigger>
          </TabsList>

          {/* Student Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or roll number..."
                  className="pl-10 rounded-xl border-border/30 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <Card key={student.id} className="rounded-2xl shadow-card border-border/20 hover:shadow-hover transition-all duration-300 bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-card-pink rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{student.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-lg">
                        {student.attendance}% attendance
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span> {student.email}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Phone:</span> {student.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Enrolled Subjects:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs rounded-lg">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full rounded-xl bg-gradient-card-mint hover:bg-gradient-card-mint/80 text-foreground">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card className="rounded-2xl shadow-card border-border/20 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Mark Attendance - Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-card-lavender rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg border-destructive/20 hover:bg-destructive/10">
                        <XCircle className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marks Tab */}
          <TabsContent value="marks" className="space-y-6">
            <Card className="rounded-2xl shadow-card border-border/20 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  Enter Marks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-card-pink rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input 
                        placeholder="Enter marks"
                        className="w-24 rounded-lg border-border/30"
                        type="number"
                        max="100"
                      />
                      <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StaffStudents;