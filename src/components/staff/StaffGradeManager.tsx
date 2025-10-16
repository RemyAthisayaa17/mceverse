import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Save } from "lucide-react";

const StaffGradeManager = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [grades, setGrades] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
    fetchStudents();
  }, []);

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from("subjects")
      .select("*")
      .order("name");
    
    if (data) setSubjects(data);
  };

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .order("full_name");

    if (data) setStudents(data);
    setLoading(false);
  };

  const handleGradeChange = (studentId: string, value: string) => {
    setGrades((prev) => ({ ...prev, [studentId]: value }));
  };

  const saveGrade = async (studentId: string) => {
    if (!selectedSubject || !grades[studentId]) {
      toast({
        title: "Error",
        description: "Please select a subject and enter a grade",
        variant: "destructive",
      });
      return;
    }

    const gradeValue = parseFloat(grades[studentId]);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast({
        title: "Error",
        description: "Grade must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("grades")
      .insert({
        student_id: studentId,
        subject_id: selectedSubject,
        grade: gradeValue,
        assignment_name: assignmentName || "General Assessment",
        graded_by: user?.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save grade",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Grade saved successfully",
      });
      setGrades((prev) => {
        const newGrades = { ...prev };
        delete newGrades[studentId];
        return newGrades;
      });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-soft rounded-2xl">
        <CardHeader>
          <CardTitle>Grade Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="rounded-xl border-border/30">
                <SelectValue placeholder="Choose a subject" />
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
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Assignment Name (Optional)</label>
            <Input
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="e.g., Midterm Exam, Assignment 1"
              className="rounded-xl border-border/30"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-card rounded-2xl">
        <CardHeader className="border-b border-border/30 bg-gradient-card-pink rounded-t-2xl">
          <CardTitle className="text-2xl text-foreground">Enter Grades</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/20 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-card-pink rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{student.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.register_number} • {student.department}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={grades[student.id] || ""}
                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                  placeholder="0-100"
                  className="w-24 rounded-xl border-border/30"
                  disabled={!selectedSubject}
                />
                <Button
                  size="sm"
                  onClick={() => saveGrade(student.id)}
                  disabled={saving || !selectedSubject || !grades[student.id]}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffGradeManager;
