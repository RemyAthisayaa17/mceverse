import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, FileText, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const StaffAssignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    department: "",
    academic_year: "",
    file_url: "",
    file_type: "pdf",
    due_date: "",
  });

  const departments = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const academicYears = ["First Year", "Second Year", "Third Year", "Final Year"];

  useEffect(() => {
    fetchSubjects();
    fetchAssignments();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");

    if (!error && data) {
      setSubjects(data);
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          *,
          subjects (
            name,
            code
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.subject_id || !formData.department || !formData.academic_year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate deadline is in the future if provided
    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      if (dueDate < new Date()) {
        toast({
          title: "Error",
          description: "Due date must be in the future",
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: assignment, error } = await supabase
        .from("assignments")
        .insert({
          ...formData,
          posted_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Assignment insert error:", error);
        throw new Error(error.message || "Failed to post assignment");
      }

      // Create notifications for all students in the department and year
      const { data: students, error: studentsError } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("department", formData.department)
        .eq("academic_year", formData.academic_year);

      if (studentsError) {
        console.error("Failed to fetch students for notifications:", studentsError);
      }

      if (students && students.length > 0) {
        const notifications = students.map((student) => ({
          student_id: student.id,
          type: "assignment",
          title: "New Assignment Posted",
          message: `${formData.title} has been posted for ${formData.department} ${formData.academic_year}`,
          related_id: assignment.id,
        }));

        const { error: notifError } = await supabase
          .from("student_notifications")
          .insert(notifications);

        if (notifError) {
          console.error("Failed to create notifications:", notifError);
        }
      }

      toast({
        title: "Success",
        description: `Assignment posted successfully to ${students?.length || 0} students`,
      });

      setFormData({
        title: "",
        description: "",
        subject_id: "",
        department: "",
        academic_year: "",
        file_url: "",
        file_type: "pdf",
        due_date: "",
      });
      setUploadOpen(false);
      fetchAssignments();
    } catch (error: any) {
      console.error("Failed to post assignment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post assignment",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("assignments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel">
      {/* Header */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/staff/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
            </div>
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-foreground">Post New Assignment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="rounded-xl bg-background/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="rounded-xl bg-background/50 border-border/50"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select
                        value={formData.subject_id}
                        onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                        required
                      >
                        <SelectTrigger className="rounded-xl bg-background/50 border-border/50">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                        required
                      >
                        <SelectTrigger className="rounded-xl bg-background/50 border-border/50">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Academic Year</Label>
                      <Select
                        value={formData.academic_year}
                        onValueChange={(value) => setFormData({ ...formData, academic_year: value })}
                        required
                      >
                        <SelectTrigger className="rounded-xl bg-background/50 border-border/50">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="datetime-local"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="rounded-xl bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>File URL</Label>
                    <Input
                      type="url"
                      value={formData.file_url}
                      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                      placeholder="https://..."
                      required
                      className="rounded-xl bg-background/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>File Type</Label>
                    <Select
                      value={formData.file_type}
                      onValueChange={(value) => setFormData({ ...formData, file_type: value })}
                    >
                      <SelectTrigger className="rounded-xl bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="doc">Document</SelectItem>
                        <SelectItem value="ppt">Presentation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={uploading}
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Posting...
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Post Assignment
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : assignments.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
              <CardContent className="pt-6 pb-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No assignments posted yet</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-card transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg text-foreground">{assignment.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-3 py-1 rounded-full bg-gradient-card-lavender text-foreground">
                          {assignment.subjects?.name}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gradient-card-mint text-foreground">
                          {assignment.department}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gradient-card-pink text-foreground">
                          {assignment.academic_year}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                      className="text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{assignment.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Posted: {format(new Date(assignment.created_at), "MMM dd, yyyy")}</span>
                    {assignment.due_date && (
                      <span>Due: {format(new Date(assignment.due_date), "MMM dd, yyyy")}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StaffAssignments;