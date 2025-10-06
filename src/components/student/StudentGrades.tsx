import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Award } from "lucide-react";

interface StudentGradesProps {
  studentId?: string;
}

const StudentGrades = ({ studentId }: StudentGradesProps) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
  });

  useEffect(() => {
    if (studentId) {
      fetchGrades();
    }
  }, [studentId]);

  const fetchGrades = async () => {
    const { data, error } = await supabase
      .from("grades")
      .select(`
        *,
        subject:subjects(name, code)
      `)
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGrades(data);
      
      if (data.length > 0) {
        const gradeValues = data.map(g => Number(g.grade));
        const avg = gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length;
        
        setStats({
          average: Math.round(avg * 10) / 10,
          highest: Math.max(...gradeValues),
          lowest: Math.min(...gradeValues),
        });
      }
    }
    
    setLoading(false);
  };

  const getGradeBadge = (grade: number) => {
    if (grade >= 90) {
      return <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 rounded-full">A+</Badge>;
    } else if (grade >= 80) {
      return <Badge className="bg-accent/20 text-accent-foreground border-accent/30 rounded-full">A</Badge>;
    } else if (grade >= 70) {
      return <Badge className="bg-primary/20 text-primary-foreground border-primary/30 rounded-full">B</Badge>;
    } else if (grade >= 60) {
      return <Badge className="bg-muted/50 text-muted-foreground border-border rounded-full">C</Badge>;
    } else {
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30 rounded-full">F</Badge>;
    }
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card-lavender border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Grade</p>
                <p className="text-3xl font-bold text-foreground">{stats.average}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card-mint border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Grade</p>
                <p className="text-3xl font-bold text-foreground">{stats.highest}</p>
              </div>
              <Award className="w-10 h-10 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card-pink border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lowest Grade</p>
                <p className="text-3xl font-bold text-foreground">{stats.lowest}</p>
              </div>
              <BookOpen className="w-10 h-10 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-card rounded-2xl">
        <CardHeader className="border-b border-border/30 bg-gradient-card-pink rounded-t-2xl">
          <CardTitle className="text-2xl text-foreground">Grade Records</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {grades.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No grades recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Assignment</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Grade</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Letter</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr 
                      key={grade.id}
                      className={`border-b border-border/20 transition-colors hover:bg-muted/20 ${
                        index % 2 === 0 ? "bg-background/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-foreground font-medium">
                        {grade.subject?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {grade.assignment_name || "General"}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground font-bold">
                        {grade.grade}
                      </td>
                      <td className="py-3 px-4">
                        {getGradeBadge(Number(grade.grade))}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(grade.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGrades;
