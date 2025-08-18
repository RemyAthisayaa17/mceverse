import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, MapPin, Calendar } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const scheduleData = [
  {
    day: "Monday",
    classes: [
      {
        subject: "Advanced Algorithms",
        time: "09:00 - 10:30",
        room: "CS Lab 1",
        students: 45,
        isToday: false
      },
      {
        subject: "Database Systems",
        time: "14:00 - 15:30", 
        room: "Room 205",
        students: 38,
        isToday: false
      }
    ]
  },
  {
    day: "Tuesday",
    classes: [
      {
        subject: "Software Engineering",
        time: "10:00 - 11:30",
        room: "Room 301",
        students: 52,
        isToday: false
      }
    ]
  },
  {
    day: "Wednesday",
    classes: [
      {
        subject: "Advanced Algorithms",
        time: "09:00 - 10:30",
        room: "CS Lab 1", 
        students: 45,
        isToday: true
      },
      {
        subject: "Database Systems",
        time: "11:00 - 12:30",
        room: "Room 205",
        students: 38,
        isToday: true
      }
    ]
  },
  {
    day: "Thursday",
    classes: [
      {
        subject: "Software Engineering",
        time: "10:00 - 11:30",
        room: "Room 301",
        students: 52,
        isToday: false
      },
      {
        subject: "Database Systems",
        time: "15:00 - 16:30",
        room: "Room 205",
        students: 38,
        isToday: false
      }
    ]
  },
  {
    day: "Friday",
    classes: [
      {
        subject: "Advanced Algorithms",
        time: "09:00 - 10:30",
        room: "CS Lab 1",
        students: 45,
        isToday: false
      }
    ]
  }
];

const todayClasses = scheduleData.find(day => day.classes.some(c => c.isToday))?.classes.filter(c => c.isToday) || [];

const StaffSchedule = () => {
  return (
    <div className="min-h-screen bg-gradient-pastel">
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
                <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/staff/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Schedule</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Today's Classes Highlight */}
        <Card className="rounded-2xl shadow-card border-border/20 mb-8 bg-gradient-card-pink">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5" />
              Today's Classes - Wednesday
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{classItem.subject}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {classItem.time}
                        <MapPin className="w-4 h-4 ml-2" />
                        {classItem.room}
                      </p>
                    </div>
                  </div>
                  <Badge className="rounded-lg">
                    {classItem.students} students
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No classes scheduled for today</p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Weekly Timetable</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {scheduleData.map((day, dayIndex) => (
              <Card key={dayIndex} className="rounded-2xl shadow-card border-border/20 bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{day.day}</span>
                    {day.classes.some(c => c.isToday) && (
                      <Badge variant="default" className="rounded-lg">Today</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {day.classes.length > 0 ? (
                    day.classes.map((classItem, classIndex) => (
                      <div 
                        key={classIndex} 
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          classItem.isToday 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'bg-muted/30 border-border/20'
                        }`}
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">{classItem.subject}</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {classItem.time}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {classItem.room}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-muted-foreground">
                              {classItem.students} students
                            </span>
                            {classItem.isToday && (
                              <Badge variant="secondary" className="text-xs rounded-lg">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8 text-sm">No classes</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Schedule Management */}
        <Card className="rounded-2xl shadow-card border-border/20 mt-8 bg-gradient-card-lavender">
          <CardHeader>
            <CardTitle>Schedule Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="rounded-xl bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add New Class
              </Button>
              <Button variant="outline" className="rounded-xl border-border/30">
                <Calendar className="w-4 h-4 mr-2" />
                Modify Schedule
              </Button>
              <Button variant="outline" className="rounded-xl border-border/30">
                Export Timetable
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StaffSchedule;