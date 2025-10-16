import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, CheckCircle, XCircle, Clock } from "lucide-react";

const StaffAttendanceManager = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
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

  const markAttendance = async (studentId: string, status: string) => {
    if (!selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const today = new Date().toISOString().split("T")[0];

    // Check if attendance already exists
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .eq("subject_id", selectedSubject)
      .eq("date", today)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("attendance")
        .update({ status })
        .eq("id", existing.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update attendance",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Attendance updated successfully",
        });
      }
    } else {
      // Create new
      const { error } = await supabase
        .from("attendance")
        .insert({
          student_id: studentId,
          subject_id: selectedSubject,
          date: today,
          status,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to mark attendance",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Attendance marked successfully",
        });
      }
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
          <CardTitle>Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-card rounded-2xl">
        <CardHeader className="border-b border-border/30 bg-gradient-card-mint rounded-t-2xl">
          <CardTitle className="text-2xl text-foreground">
            Mark Attendance - {new Date().toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/20 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-card-lavender rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{student.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.register_number} • {student.department}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => markAttendance(student.id, "present")}
                  disabled={saving || !selectedSubject}
                  className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Present
                </Button>
                <Button
                  size="sm"
                  onClick={() => markAttendance(student.id, "late")}
                  disabled={saving || !selectedSubject}
                  variant="outline"
                  className="rounded-full border-accent/50 hover:bg-accent/10"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Late
                </Button>
                <Button
                  size="sm"
                  onClick={() => markAttendance(student.id, "absent")}
                  disabled={saving || !selectedSubject}
                  variant="outline"
                  className="rounded-full border-destructive/50 hover:bg-destructive/10 text-destructive"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Absent
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAttendanceManager;
