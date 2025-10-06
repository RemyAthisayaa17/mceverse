import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

interface StudentAttendanceProps {
  studentId?: string;
}

const StudentAttendance = ({ studentId }: StudentAttendanceProps) => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
    }
  }, [studentId]);

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        subject:subjects(name, code)
      `)
      .eq("student_id", studentId)
      .order("date", { ascending: false });

    if (!error && data) {
      setAttendance(data);
      
      const present = data.filter(a => a.status === "present").length;
      const absent = data.filter(a => a.status === "absent").length;
      const late = data.filter(a => a.status === "late").length;
      const total = data.length;
      
      setStats({
        present,
        absent,
        late,
        total,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    }
    
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 rounded-full">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 rounded-full">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-accent/20 text-accent-foreground border-accent/30 rounded-full">
            <Clock className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      default:
        return null;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card-mint border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-3xl font-bold text-foreground">{stats.present}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card-pink border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-3xl font-bold text-foreground">{stats.absent}</p>
              </div>
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card-lavender border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-3xl font-bold text-foreground">{stats.late}</p>
              </div>
              <Clock className="w-10 h-10 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-soft rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance %</p>
                <p className="text-3xl font-bold text-primary">{stats.percentage}%</p>
              </div>
              <Calendar className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-card rounded-2xl">
        <CardHeader className="border-b border-border/30 bg-gradient-card-mint rounded-t-2xl">
          <CardTitle className="text-2xl text-foreground">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {attendance.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr 
                      key={record.id}
                      className={`border-b border-border/20 transition-colors hover:bg-muted/20 ${
                        index % 2 === 0 ? "bg-background/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {record.subject?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(record.status)}
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

export default StudentAttendance;
