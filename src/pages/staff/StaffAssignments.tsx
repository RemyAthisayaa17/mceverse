import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Plus, Calendar as CalendarIcon, Clock, Edit, Trash2, Upload, Eye, FileText } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const initialAssignments = [
  {
    id: 1,
    title: "Algorithm Analysis Project",
    subject: "Advanced Algorithms",
    dueDate: "2024-12-15",
    maxPoints: 100,
    status: "active",
    submissions: 23,
    totalStudents: 45,
    description: "Implement and analyze time complexity of sorting algorithms. Students must compare at least 3 different sorting algorithms and provide detailed analysis of their performance."
  },
  {
    id: 2,
    title: "Database Design Assignment",
    subject: "Database Systems", 
    dueDate: "2024-12-20",
    maxPoints: 80,
    status: "active",
    submissions: 15,
    totalStudents: 38,
    description: "Design a normalized database schema for e-commerce system including tables for users, products, orders, and payments."
  },
  {
    id: 3,
    title: "Software Requirements Document",
    subject: "Software Engineering",
    dueDate: "2024-12-10",
    maxPoints: 120,
    status: "overdue",
    submissions: 40,
    totalStudents: 52,
    description: "Create comprehensive SRS for mobile banking application including functional and non-functional requirements."
  }
];

const subjects = ["Advanced Algorithms", "Database Systems", "Software Engineering", "Web Development", "Mobile Programming"];

const StaffAssignments = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [date, setDate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dueDate: "",
    maxPoints: "",
    description: ""
  });
  const { toast } = useToast();

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssignment = () => {
    if (!formData.title || !formData.subject || !formData.dueDate || !formData.maxPoints) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newAssignment = {
      id: Math.max(...assignments.map(a => a.id)) + 1,
      ...formData,
      maxPoints: parseInt(formData.maxPoints),
      status: "active",
      submissions: 0,
      totalStudents: 45 // Mock value
    };

    setAssignments([...assignments, newAssignment]);
    setFormData({ title: "", subject: "", dueDate: "", maxPoints: "", description: "" });
    setDate(null);
    setIsAddModalOpen(false);
    toast({
      title: "Success",
      description: "Assignment created successfully!",
    });
  };

  const handleEditAssignment = () => {
    if (!formData.title || !formData.subject || !formData.dueDate || !formData.maxPoints) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setAssignments(assignments.map(assignment =>
      assignment.id === selectedAssignment.id
        ? { ...assignment, ...formData, maxPoints: parseInt(formData.maxPoints) }
        : assignment
    ));
    setIsEditModalOpen(false);
    toast({
      title: "Success",
      description: "Assignment updated successfully!",
    });
  };

  const handleDeleteAssignment = () => {
    setAssignments(assignments.filter(assignment => assignment.id !== selectedAssignment.id));
    setIsDeleteModalOpen(false);
    toast({
      title: "Success",
      description: "Assignment deleted successfully!",
    });
  };

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      maxPoints: assignment.maxPoints.toString(),
      description: assignment.description
    });
    setDate(new Date(assignment.dueDate));
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsViewModalOpen(true);
  };

  const openResourceModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsResourceModalOpen(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active": return "default";
      case "overdue": return "destructive";
      case "closed": return "secondary";
      default: return "default";
    }
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
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-soft transition-all duration-300 hover:shadow-card">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="rounded-xl border-border/30"
                        placeholder="e.g., Algorithm Analysis Project"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                        <SelectTrigger className="rounded-xl border-border/30">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Due Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal rounded-xl border-border/30",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              setFormData({ ...formData, dueDate: format(selectedDate, "yyyy-MM-dd") });
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxPoints">Max Points *</Label>
                      <Input
                        id="maxPoints"
                        type="number"
                        value={formData.maxPoints}
                        onChange={(e) => setFormData({ ...formData, maxPoints: e.target.value })}
                        className="rounded-xl border-border/30"
                        placeholder="100"
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
                      placeholder="Detailed assignment description..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleAddAssignment} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                      Create Assignment
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-2xl shadow-soft border-border/20 bg-gradient-to-br from-pink-50 to-pink-100 backdrop-blur-sm transition-all duration-300 hover:shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assignments</p>
                  <p className="text-3xl font-bold text-foreground">{assignments.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft border-border/20 bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm transition-all duration-300 hover:shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-foreground">
                    {assignments.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft border-border/20 bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm transition-all duration-300 hover:shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                  <p className="text-3xl font-bold text-foreground">
                    {assignments.reduce((sum, a) => sum + a.submissions, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border-border/30 focus:border-primary/50 bg-card/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment, index) => (
            <Card key={assignment.id} className="rounded-2xl shadow-soft border-border/20 hover:shadow-hover transition-all duration-300 bg-card/80 backdrop-blur-sm group">
              <div className={`h-2 rounded-t-2xl ${index % 3 === 0 ? 'bg-gradient-to-r from-pink-400 to-pink-500' : index % 3 === 1 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-purple-400 to-purple-500'}`} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{assignment.title}</CardTitle>
                      <Badge 
                        variant={getStatusBadgeVariant(assignment.status)}
                        className="rounded-lg px-3 py-1"
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Subject: <span className="font-medium">{assignment.subject}</span>
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="icon" onClick={() => openViewModal(assignment)} className="hover:bg-primary/10 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(assignment)} className="hover:bg-primary/10 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteModal(assignment)} className="hover:bg-destructive/10 rounded-lg">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-muted/20 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Max Points</p>
                    <p className="font-medium text-lg">{assignment.maxPoints}</p>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Submissions</p>
                    <p className="font-medium">
                      {assignment.submissions} / {assignment.totalStudents}
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <div className="mt-2">
                      <Progress 
                        value={(assignment.submissions / assignment.totalStudents) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => openViewModal(assignment)} className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground">
                    View Submissions
                  </Button>
                  <Button variant="outline" onClick={() => openResourceModal(assignment)} className="rounded-xl border-border/30">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No assignments found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start by creating your first assignment"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            )}
          </div>
        )}
      </main>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm max-w-2xl">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedAssignment.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-medium text-lg">{selectedAssignment.subject}</p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Max Points</p>
                    <p className="font-medium text-lg">{selectedAssignment.maxPoints}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-medium text-lg">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Submissions</p>
                    <p className="font-medium text-lg">{selectedAssignment.submissions} / {selectedAssignment.totalStudents}</p>
                  </div>
                </div>
                {selectedAssignment.description && (
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-foreground mt-1">{selectedAssignment.description}</p>
                  </div>
                )}
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Submission Progress</p>
                  <Progress 
                    value={(selectedAssignment.submissions / selectedAssignment.totalStudents) * 100} 
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((selectedAssignment.submissions / selectedAssignment.totalStudents) * 100)}% completed
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Assignment Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl border-border/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject *</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger className="rounded-xl border-border/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-border/30",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setFormData({ ...formData, dueDate: format(selectedDate, "yyyy-MM-dd") });
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxPoints">Max Points *</Label>
                <Input
                  id="edit-maxPoints"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData({ ...formData, maxPoints: e.target.value })}
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
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditAssignment} className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
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
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">Delete Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Are you sure you want to delete <strong>{selectedAssignment.title}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleDeleteAssignment} variant="destructive" className="flex-1 rounded-xl">
                    Delete Assignment
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

      {/* Resource Upload Modal */}
      <Dialog open={isResourceModalOpen} onOpenChange={setIsResourceModalOpen}>
        <DialogContent className="rounded-2xl border-border/20 bg-card/95 backdrop-blur-sm">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">Upload Resources</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Upload resources for <strong>{selectedAssignment.title}</strong>
                </p>
                <div className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports: PDF, DOC, DOCX, PPT, PPTX (Max 10MB)</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90">
                    Upload Files
                  </Button>
                  <Button variant="outline" onClick={() => setIsResourceModalOpen(false)} className="flex-1 rounded-xl border-border/30">
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

export default StaffAssignments;