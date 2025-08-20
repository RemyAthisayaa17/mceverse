import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Search, Eye } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";

const initialSubjects = [
  {
    id: 1,
    name: "Advanced Algorithms",
    code: "CS401",
    semester: "Fall 2024",
    students: 45,
    credits: 3,
    description: "Advanced study of algorithmic design and analysis techniques including dynamic programming, greedy algorithms, and complexity theory."
  },
  {
    id: 2, 
    name: "Database Systems",
    code: "CS302",
    semester: "Fall 2024",
    students: 38,
    credits: 4,
    description: "Comprehensive coverage of database design, SQL, normalization, indexing, and transaction management."
  },
  {
    id: 3,
    name: "Software Engineering",
    code: "CS350",
    semester: "Fall 2024", 
    students: 52,
    credits: 3,
    description: "Software development life cycle, project management, requirements analysis, and software testing methodologies."
  }
];

const StaffSubjects = () => {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    semester: "",
    credits: "",
    description: "",
    students: 0
  });
  const { toast } = useToast();

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    if (!formData.name || !formData.code || !formData.semester || !formData.credits) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newSubject = {
      id: Math.max(...subjects.map(s => s.id)) + 1,
      ...formData,
      credits: parseInt(formData.credits),
      students: 0
    };

    setSubjects([...subjects, newSubject]);
    setFormData({ name: "", code: "", semester: "", credits: "", description: "", students: 0 });
    setIsAddModalOpen(false);
    toast({
      title: "Success",
      description: "Subject added successfully!",
    });
  };

  const handleEditSubject = () => {
    if (!formData.name || !formData.code || !formData.semester || !formData.credits) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubjects(subjects.map(subject =>
      subject.id === selectedSubject.id
        ? { ...subject, ...formData, credits: parseInt(formData.credits) }
        : subject
    ));
    setIsEditModalOpen(false);
    toast({
      title: "Success",
      description: "Subject updated successfully!",
    });
  };

  const handleDeleteSubject = () => {
    setSubjects(subjects.filter(subject => subject.id !== selectedSubject.id));
    setIsDeleteModalOpen(false);
    toast({
      title: "Success",
      description: "Subject deleted successfully!",
    });
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      semester: subject.semester,
      credits: subject.credits.toString(),
      description: subject.description,
      students: subject.students
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (subject) => {
    setSelectedSubject(subject);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
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
                <h1 className="text-2xl font-bold text-foreground">My Subjects</h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/staff/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Subjects</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-soft transition-all duration-300 hover:shadow-card">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Subject Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl border-border/30"
                        placeholder="e.g., Advanced Algorithms"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Course Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="rounded-xl border-border/30"
                        placeholder="e.g., CS401"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester *</Label>
                      <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                        <SelectTrigger className="rounded-xl border-border/30">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                          <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                          <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credits">Credits *</Label>
                      <Input
                        id="credits"
                        type="number"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        className="rounded-xl border-border/30"
                        placeholder="3"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="rounded-xl border-border/30"
                      placeholder="Brief description of the subject..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleAddSubject} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                      Add Subject
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 rounded-xl border-border/30">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-border/30 focus:border-primary/50 bg-card/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <Card key={subject.id} className="rounded-2xl shadow-soft border-border/20 hover:shadow-hover transition-all duration-300 bg-card/80 backdrop-blur-sm overflow-hidden group">
              <div className={`h-2 ${index % 3 === 0 ? 'bg-gradient-card-pink' : index % 3 === 1 ? 'bg-gradient-card-mint' : 'bg-gradient-card-lavender'}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${index % 3 === 0 ? 'bg-gradient-card-pink' : index % 3 === 1 ? 'bg-gradient-card-mint' : 'bg-gradient-card-lavender'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{subject.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="icon" onClick={() => openViewModal(subject)} className="hover:bg-primary/10 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(subject)} className="hover:bg-primary/10 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteModal(subject)} className="hover:bg-destructive/10 rounded-lg">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/20 rounded-lg p-3">
                    <p className="text-muted-foreground">Semester</p>
                    <p className="font-medium">{subject.semester}</p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <p className="text-muted-foreground">Credits</p>
                    <p className="font-medium">{subject.credits}</p>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{subject.students} students enrolled</p>
                  <div className="w-full bg-border/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subject.students / 60) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start by adding your first subject"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            )}
          </div>
        )}
      </main>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm">
          {selectedSubject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedSubject.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Course Code</p>
                    <p className="font-medium text-lg">{selectedSubject.code}</p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="font-medium text-lg">{selectedSubject.credits}</p>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Semester</p>
                  <p className="font-medium text-lg">{selectedSubject.semester}</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Students Enrolled</p>
                  <p className="font-medium text-lg">{selectedSubject.students}</p>
                </div>
                {selectedSubject.description && (
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-foreground mt-1">{selectedSubject.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Subject Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-border/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Course Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="rounded-xl border-border/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-semester">Semester *</Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger className="rounded-xl border-border/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-credits">Credits *</Label>
                <Input
                  id="edit-credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  className="rounded-xl border-border/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl border-border/30"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditSubject} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-xl border-border/30">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm">
          {selectedSubject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">Delete Subject</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Are you sure you want to delete <strong>{selectedSubject.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleDeleteSubject} variant="destructive" className="flex-1 rounded-xl">
                    Delete Subject
                  </Button>
                  <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 rounded-xl border-border/30">
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffSubjects;