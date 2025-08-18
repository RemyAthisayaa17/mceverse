import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, ClipboardList, BarChart3, Calendar, FolderOpen, LogOut } from "lucide-react";

const dashboardCards = [
  {
    title: "My Subjects",
    icon: BookOpen,
    href: "/staff/subjects",
    gradient: "bg-gradient-card-pink",
    description: "Manage your assigned subjects"
  },
  {
    title: "Students",
    icon: Users,
    href: "/staff/students", 
    gradient: "bg-gradient-card-mint",
    description: "View student profiles & attendance"
  },
  {
    title: "Assignments",
    icon: ClipboardList,
    href: "/staff/assignments",
    gradient: "bg-gradient-card-lavender", 
    description: "Create and manage assignments"
  },
  {
    title: "Gradebook",
    icon: BarChart3,
    href: "/staff/gradebook",
    gradient: "bg-gradient-card-pink",
    description: "View marks and performance"
  },
  {
    title: "Schedule",
    icon: Calendar,
    href: "/staff/schedule",
    gradient: "bg-gradient-card-mint",
    description: "Manage your timetable"
  },
  {
    title: "Resources",
    icon: FolderOpen,
    href: "/staff/resources",
    gradient: "bg-gradient-card-lavender",
    description: "Upload and organize materials"
  }
];

const StaffDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-pastel">
      {/* Top Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Professor!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="group cursor-pointer"
              >
                <Card className={`
                  rounded-2xl border border-border/20 shadow-card transition-all duration-300 ease-smooth
                  hover:scale-105 hover:shadow-hover group-hover:border-primary/20
                  ${card.gradient}
                `}>
                  <CardContent className="p-8 text-center space-y-4">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto bg-card/30 rounded-2xl flex items-center justify-center shadow-soft">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;