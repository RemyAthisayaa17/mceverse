import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, Award, BookOpen } from "lucide-react";

const sb = supabase as any;

interface ClassStats {
  totalStudents: number;
  averageGrade: number;
  highestGrade: number;
  lowestGrade: number;
  passRate: number;
  subjectStats: {
    name: string;
    code: string;
    averageGrade: number;
    studentCount: number;
    passRate: number;
  }[];
}

interface ClassReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClassReportModal = ({ open, onOpenChange }: ClassReportModalProps) => {
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClassStats();
    }
  }, [open]);

  const fetchClassStats = async () => {
    setLoading(true);
    try {
      // Fetch grades with student and subject info
      const { data: grades, error } = await sb
        .from('grades')
        .select(`
          grade,
          student_id,
          students!inner(name, student_id),
          subjects!inner(name, code)
        `);

      if (error) throw error;

      if (!grades || grades.length === 0) {
        setStats({
          totalStudents: 0,
          averageGrade: 0,
          highestGrade: 0,
          lowestGrade: 0,
          passRate: 0,
          subjectStats: []
        });
        return;
      }

      // Calculate overall stats
      const allGrades = grades.map(g => g.grade);
      const uniqueStudents = new Set(grades.map(g => g.student_id)).size;
      const averageGrade = allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
      const highestGrade = Math.max(...allGrades);
      const lowestGrade = Math.min(...allGrades);
      const passRate = (allGrades.filter(grade => grade >= 60).length / allGrades.length) * 100;

      // Calculate subject stats
      const subjectMap = new Map();
      grades.forEach((grade) => {
        const subject = grade.subjects;
        if (!subjectMap.has(subject.code)) {
          subjectMap.set(subject.code, {
            name: subject.name,
            code: subject.code,
            grades: [],
            students: new Set()
          });
        }
        subjectMap.get(subject.code).grades.push(grade.grade);
        subjectMap.get(subject.code).students.add(grade.student_id);
      });

      const subjectStats = Array.from(subjectMap.values()).map(subject => ({
        name: subject.name,
        code: subject.code,
        averageGrade: subject.grades.reduce((sum: number, grade: number) => sum + grade, 0) / subject.grades.length,
        studentCount: subject.students.size,
        passRate: (subject.grades.filter((grade: number) => grade >= 60).length / subject.grades.length) * 100
      }));

      setStats({
        totalStudents: uniqueStudents,
        averageGrade,
        highestGrade,
        lowestGrade,
        passRate,
        subjectStats
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch class statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl bg-gradient-card-mint border-border/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Class Performance Report</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                    </div>
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-lavender">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Grade</p>
                      <p className="text-2xl font-bold text-foreground">{stats.averageGrade.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-mint">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-2xl font-bold text-foreground">{stats.passRate.toFixed(1)}%</p>
                    </div>
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-card border-border/20 bg-gradient-card-pink">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Subjects</p>
                      <p className="text-2xl font-bold text-foreground">{stats.subjectStats.length}</p>
                    </div>
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grade Range */}
            <Card className="rounded-2xl shadow-card border-border/20 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Highest Grade</p>
                    <p className="text-xl font-bold text-foreground">{stats.highestGrade}%</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Lowest Grade</p>
                    <p className="text-xl font-bold text-foreground">{stats.lowestGrade}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card className="rounded-2xl shadow-card border-border/20 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Subject Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.subjectStats.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="space-y-1">
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                      <Badge variant="secondary" className="rounded-lg">
                        {subject.studentCount} students
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-foreground">{subject.averageGrade.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Pass Rate: {subject.passRate.toFixed(1)}%</p>
                      <div className="w-24 bg-border/20 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(subject.averageGrade, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No grade data available</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-primary hover:bg-primary/90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};