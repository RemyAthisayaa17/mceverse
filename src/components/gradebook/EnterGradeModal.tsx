import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  student_id: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface EnterGradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGradeAdded: () => void;
}

export const EnterGradeModal = ({ open, onOpenChange, onGradeAdded }: EnterGradeModalProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchStudents();
      fetchSubjects();
    }
  }, [open]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, student_id')
        .order('name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, code')
        .order('name');
      
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subjects",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedSubject || !grade || !assignmentName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const gradeValue = parseFloat(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast({
        title: "Error",
        description: "Grade must be a number between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('grades')
        .insert([
          {
            student_id: selectedStudent,
            subject_id: selectedSubject,
            assignment_name: assignmentName,
            grade: gradeValue,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Grade entered successfully",
        className: "bg-gradient-card-mint border-border/20",
      });

      // Reset form
      setSelectedStudent("");
      setSelectedSubject("");
      setAssignmentName("");
      setGrade("");
      
      onGradeAdded();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enter grade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-card-lavender border-border/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Enter New Grade</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="student" className="text-sm font-medium text-foreground">Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="rounded-xl border-border/30 bg-background/50">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-popover border-border/20">
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id} className="rounded-lg">
                    {student.name} ({student.student_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="rounded-xl border-border/30 bg-background/50">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-popover border-border/20">
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id} className="rounded-lg">
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignment" className="text-sm font-medium text-foreground">Assignment Name</Label>
            <Input
              id="assignment"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="e.g., Midterm Exam, Project 1"
              className="rounded-xl border-border/30 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade" className="text-sm font-medium text-foreground">Grade (%)</Label>
            <Input
              id="grade"
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter grade (0-100)"
              className="rounded-xl border-border/30 bg-background/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border-border/30"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Grade"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};