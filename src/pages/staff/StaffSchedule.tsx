import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, MapPin, Calendar, Edit, Trash2, Download, Users } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Available subjects for dropdown
const availableSubjects = [
  "Advanced Algorithms",
  "Database Systems", 
  "Software Engineering",
  "Computer Networks",
  "Machine Learning",
  "Web Development",
  "Data Structures",
  "Operating Systems"
];

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Initial schedule data with unique IDs
const initialScheduleData = [
  {
    day: "Monday",
    classes: [
      {
        id: 1,
        subject: "Advanced Algorithms",
        time: "09:00 - 10:30",
        startTime: "09:00",
        endTime: "10:30",
        room: "CS Lab 1",
        students: 45,
        isToday: false
      },
      {
        id: 2,
        subject: "Database Systems",
        time: "14:00 - 15:30", 
        startTime: "14:00",
        endTime: "15:30",
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
        id: 3,
        subject: "Software Engineering",
        time: "10:00 - 11:30",
        startTime: "10:00",
        endTime: "11:30",
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
        id: 4,
        subject: "Advanced Algorithms",
        time: "09:00 - 10:30",
        startTime: "09:00",
        endTime: "10:30",
        room: "CS Lab 1", 
        students: 45,
        isToday: true
      },
      {
        id: 5,
        subject: "Database Systems",
        time: "11:00 - 12:30",
        startTime: "11:00",
        endTime: "12:30",
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
        id: 6,
        subject: "Software Engineering",
        time: "10:00 - 11:30",
        startTime: "10:00",
        endTime: "11:30",
        room: "Room 301",
        students: 52,
        isToday: false
      },
      {
        id: 7,
        subject: "Database Systems",
        time: "15:00 - 16:30",
        startTime: "15:00",
        endTime: "16:30",
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
        id: 8,
        subject: "Advanced Algorithms",
        time: "09:00 - 10:30",
        startTime: "09:00",
        endTime: "10:30",
        room: "CS Lab 1",
        students: 45,
        isToday: false
      }
    ]
  },
  {
    day: "Saturday",
    classes: []
  },
  {
    day: "Sunday", 
    classes: []
  }
];

const StaffSchedule = () => {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
    students: ""
  });
  const { toast } = useToast();

  // Get today's classes
  const todayClasses = scheduleData.find(day => day.classes.some(c => c.isToday))?.classes.filter(c => c.isToday) || [];

  // Reset form data
  const resetFormData = () => {
    setFormData({
      subject: "",
      day: "",
      startTime: "",
      endTime: "",
      room: "",
      students: ""
    });
  };

  // Handle add class
  const handleAddClass = () => {
    if (!formData.subject || !formData.day || !formData.startTime || !formData.endTime || !formData.room || !formData.students) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newClass = {
      id: Date.now(),
      subject: formData.subject,
      time: `${formData.startTime} - ${formData.endTime}`,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      students: parseInt(formData.students),
      isToday: formData.day === "Wednesday" // Assuming today is Wednesday
    };

    setScheduleData(prev => prev.map(day => 
      day.day === formData.day 
        ? { ...day, classes: [...day.classes, newClass] }
        : day
    ));

    toast({
      title: "Success",
      description: "Class added successfully!",
    });

    resetFormData();
    setIsAddModalOpen(false);
  };

  // Handle edit class
  const handleEditClass = (classItem, dayName) => {
    setEditingClass({ ...classItem, dayName });
    setFormData({
      subject: classItem.subject,
      day: dayName,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      room: classItem.room,
      students: classItem.students.toString()
    });
    setIsEditModalOpen(true);
  };

  // Handle update class
  const handleUpdateClass = () => {
    if (!formData.subject || !formData.day || !formData.startTime || !formData.endTime || !formData.room || !formData.students) {
      toast({
        title: "Error", 
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const updatedClass = {
      ...editingClass,
      subject: formData.subject,
      time: `${formData.startTime} - ${formData.endTime}`,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      students: parseInt(formData.students),
      isToday: formData.day === "Wednesday"
    };

    setScheduleData(prev => prev.map(day => ({
      ...day,
      classes: day.classes.map(c => c.id === editingClass.id ? updatedClass : c)
    })));

    toast({
      title: "Success",
      description: "Class updated successfully!",
    });

    resetFormData();
    setIsEditModalOpen(false);
    setEditingClass(null);
  };

  // Handle delete class
  const handleDeleteClass = (classId) => {
    setScheduleData(prev => prev.map(day => ({
      ...day,
      classes: day.classes.filter(c => c.id !== classId)
    })));

    toast({
      title: "Success",
      description: "Class deleted successfully!",
    });
  };

  // Handle export timetable
  const handleExportTimetable = () => {
    // Create a simple text-based timetable for demonstration
    const timetableData = scheduleData.map(day => ({
      day: day.day,
      classes: day.classes.map(c => `${c.time} - ${c.subject} (${c.room})`)
    }));

    const exportContent = JSON.stringify(timetableData, null, 2);
    const blob = new Blob([exportContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Timetable exported successfully!",
    });
  };

  // Class form component
  const ClassForm = ({ onSubmit, submitText }) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</Label>
        <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
          <SelectTrigger className="rounded-xl border-border/30">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {availableSubjects.map(subject => (
              <SelectItem key={subject} value={subject} className="rounded-lg">{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="day" className="text-sm font-medium text-foreground">Day of Week</Label>
        <Select value={formData.day} onValueChange={(value) => setFormData(prev => ({ ...prev, day: value }))}>
          <SelectTrigger className="rounded-xl border-border/30">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {daysOfWeek.map(day => (
              <SelectItem key={day} value={day} className="rounded-lg">{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium text-foreground">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            className="rounded-xl border-border/30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium text-foreground">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            className="rounded-xl border-border/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="room" className="text-sm font-medium text-foreground">Location</Label>
        <Input
          id="room"
          placeholder="e.g., CS Lab 1, Room 205"
          value={formData.room}
          onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
          className="rounded-xl border-border/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="students" className="text-sm font-medium text-foreground">Number of Students</Label>
        <Input
          id="students"
          type="number"
          placeholder="e.g., 45"
          value={formData.students}
          onChange={(e) => setFormData(prev => ({ ...prev, students: e.target.value }))}
          className="rounded-xl border-border/30"
        />
      </div>

      <Button 
        onClick={onSubmit}
        className="w-full rounded-xl bg-primary hover:bg-primary/90"
      >
        {submitText}
      </Button>
    </div>
  );

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
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-foreground">Add New Class</DialogTitle>
                </DialogHeader>
                <ClassForm onSubmit={handleAddClass} submitText="Add Class" />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Today's Classes Highlight */}
        <Card className="rounded-2xl shadow-card border-border/20 mb-8 bg-gradient-card-pink hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Classes - Wednesday
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card/60 rounded-xl backdrop-blur-sm border border-border/20 hover:shadow-soft transition-all duration-300">
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
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-lg bg-secondary/80 text-secondary-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      {classItem.students}
                    </Badge>
                  </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {scheduleData.map((day, dayIndex) => (
              <Card key={dayIndex} className="rounded-2xl shadow-card border-border/20 bg-card hover:shadow-hover transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">{day.day}</span>
                    {day.classes.some(c => c.isToday) && (
                      <Badge variant="default" className="rounded-lg bg-primary text-primary-foreground">Today</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {day.classes.length > 0 ? (
                    day.classes.map((classItem, classIndex) => (
                      <div 
                        key={classIndex} 
                        className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-soft ${
                          classItem.isToday 
                            ? 'bg-primary/10 border-primary/30 shadow-soft' 
                            : 'bg-muted/20 border-border/30 hover:bg-muted/30'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-foreground pr-2">{classItem.subject}</h4>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditClass(classItem, day.day)}
                                className="h-7 w-7 p-0 rounded-lg hover:bg-primary/20"
                              >
                                <Edit className="w-3 h-3 text-primary" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClass(classItem.id)}
                                className="h-7 w-7 p-0 rounded-lg hover:bg-destructive/20"
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
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
                          
                          <div className="flex items-center justify-between pt-1">
                            <Badge variant="outline" className="text-xs rounded-lg border-border/40">
                              <Users className="w-3 h-3 mr-1" />
                              {classItem.students} students
                            </Badge>
                            {classItem.isToday && (
                              <Badge variant="secondary" className="text-xs rounded-lg bg-accent/50">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm mb-3">No classes scheduled</p>
                      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg border-border/40 hover:bg-primary/10">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Class
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Schedule Management */}
        <Card className="rounded-2xl shadow-card border-border/20 mt-8 bg-gradient-card-lavender hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-foreground">Schedule Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-soft hover:shadow-hover transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Class
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="rounded-xl border-border/30 hover:bg-accent/50 shadow-soft hover:shadow-hover transition-all duration-300"
                onClick={() => {
                  toast({
                    title: "Modify Schedule",
                    description: "Hover over class cards to edit or delete them!",
                  });
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Modify Schedule
              </Button>
              
              <Button 
                variant="outline" 
                className="rounded-xl border-border/30 hover:bg-secondary/50 shadow-soft hover:shadow-hover transition-all duration-300"
                onClick={handleExportTimetable}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Timetable
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Edit Class Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">Edit Class</DialogTitle>
          </DialogHeader>
          <ClassForm onSubmit={handleUpdateClass} submitText="Update Class" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffSchedule;