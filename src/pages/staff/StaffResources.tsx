import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Search, FileText, Download, Trash2, FolderOpen } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const resources = [
  {
    id: 1,
    name: "Algorithm Complexity Analysis.pdf",
    subject: "Advanced Algorithms",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2024-11-10",
    downloads: 23
  },
  {
    id: 2,
    name: "Database Normalization Slides.pptx", 
    subject: "Database Systems",
    type: "PowerPoint",
    size: "5.1 MB", 
    uploadDate: "2024-11-08",
    downloads: 18
  },
  {
    id: 3,
    name: "Software Design Patterns.docx",
    subject: "Software Engineering",
    type: "Word Document",
    size: "1.8 MB",
    uploadDate: "2024-11-05",
    downloads: 31
  },
  {
    id: 4,
    name: "SQL Query Examples.sql",
    subject: "Database Systems", 
    type: "SQL File",
    size: "0.5 MB",
    uploadDate: "2024-11-03",
    downloads: 42
  },
  {
    id: 5,
    name: "Sorting Algorithms Demo.py",
    subject: "Advanced Algorithms",
    type: "Python",
    size: "0.3 MB",
    uploadDate: "2024-11-01",
    downloads: 35
  }
];

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'powerpoint':
      return <FileText className="w-6 h-6 text-orange-500" />;
    case 'word document':
      return <FileText className="w-6 h-6 text-blue-500" />;
    case 'sql file':
      return <FileText className="w-6 h-6 text-green-500" />;
    case 'python':
      return <FileText className="w-6 h-6 text-yellow-500" />;
    default:
      return <FileText className="w-6 h-6 text-gray-500" />;
  }
};

const subjectCounts = resources.reduce((acc, resource) => {
  acc[resource.subject] = (acc[resource.subject] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const StaffResources = () => {
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
                <h1 className="text-2xl font-bold text-foreground">Resources</h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/staff/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Resources</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Subject Filter */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl shadow-card border-border/20 bg-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(subjectCounts).map(([subject, count]) => (
                  <div key={subject} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">{subject}</span>
                    <Badge variant="secondary" className="rounded-lg">
                      {count}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full rounded-xl border-border/30 mt-4">
                  All Resources
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10 rounded-xl border-border/30 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Upload Area */}
            <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-mint">
              <CardContent className="p-8">
                <div className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 text-primary mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Upload New Resource</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse
                    </p>
                  </div>
                  <Button className="rounded-xl bg-primary hover:bg-primary/90">
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resources List */}
            <div className="space-y-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="rounded-2xl shadow-card border-border/20 hover:shadow-hover transition-all duration-300 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center">
                          {getFileIcon(resource.type)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{resource.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{resource.subject}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                            <span>•</span>
                            <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-lg text-xs">
                              {resource.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {resource.downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-lg">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 rounded-lg">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resource Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{resources.length}</p>
                  <p className="text-sm text-muted-foreground">Total Resources</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {resources.reduce((sum, r) => sum + r.downloads, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-mint">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{Object.keys(subjectCounts).length}</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffResources;