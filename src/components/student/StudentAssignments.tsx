import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  department: string;
  academic_year: string;
  file_url: string;
  file_type: string;
  due_date: string;
  created_at: string;
  subjects: {
    name: string;
    code: string;
  };
}

interface StudentAssignmentsProps {
  studentId?: string;
}

const StudentAssignments = ({ studentId }: StudentAssignmentsProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (studentId) {
      fetchAssignments();
    }
  }, [studentId]);

  const fetchAssignments = async () => {
    try {
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("department, academic_year")
        .eq("id", studentId)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from("assignments")
        .select(`
          *,
          subjects (
            name,
            code
          )
        `)
        .eq("department", profile.department)
        .eq("academic_year", profile.academic_year)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, title: string) => {
    window.open(fileUrl, "_blank");
    toast({
      title: "Download Started",
      description: `Downloading ${title}`,
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
            <CardContent className="pt-6 pb-6 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No assignments available yet</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {assignment.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-card-lavender border-0 text-foreground">
                        {assignment.subjects?.name}
                      </Badge>
                      {assignment.due_date && (
                        <Badge
                          variant={isOverdue(assignment.due_date) ? "destructive" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          Due: {format(new Date(assignment.due_date), "MMM dd, yyyy")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(assignment.file_url, assignment.title)}
                    className="rounded-full bg-gradient-card-pink border-0 hover:shadow-hover"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted: {format(new Date(assignment.created_at), "MMM dd, yyyy")}
                  </div>
                  {assignment.file_type && (
                    <Badge variant="outline" className="capitalize">
                      {assignment.file_type}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;