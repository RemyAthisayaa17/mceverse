import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardList, BarChart3, Calendar, FolderOpen, LogOut, Upload } from "lucide-react";
import { EditProfileModal } from "@/components/gradebook/EditProfileModal";

const dashboardCards = [
  {
    title: "My Subjects",
    icon: BookOpen,
    href: "/staff/subjects",
    gradient: "bg-gradient-card-pink",
    description: "5 Active Courses",
    action: "View All",
    stats: "Computer Science, Mathematics, Physics..."
  },
  {
    title: "Students",
    icon: Users,
    href: "/staff/students", 
    gradient: "bg-gradient-card-mint",
    description: "142 Students",
    action: "Manage Students",
    stats: "Active across all courses"
  },
  {
    title: "Assignments",
    icon: ClipboardList,
    href: "/staff/assignments",
    gradient: "bg-gradient-card-lavender", 
    description: "8 Pending Reviews",
    action: "View / Create",
    stats: "3 new submissions today"
  },
  {
    title: "Gradebook",
    icon: BarChart3,
    href: "/staff/gradebook",
    gradient: "bg-gradient-card-pink",
    description: "Average: 85.2%",
    action: "Open Gradebook",
    stats: "Performance trending up"
  },
  {
    title: "Schedule",
    icon: Calendar,
    href: "/staff/schedule",
    gradient: "bg-gradient-card-mint",
    description: "4 Classes Today",
    action: "View Timetable",
    stats: "Next: Advanced Physics at 2:00 PM"
  },
  {
    title: "Resources",
    icon: Upload,
    href: "/staff/resources",
    gradient: "bg-gradient-card-lavender",
    description: "24 Files Uploaded",
    action: "Open Resources",
    stats: "Quick upload available"
  }
];

const StaffDashboard = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffProfile();
  }, []);

  const fetchStaffProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: staffProfile, error } = await supabase
          .from('staff_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching staff profile:', error);
          return;
        }

        if (staffProfile) {
          setProfile({
            name: staffProfile.full_name || "",
            email: staffProfile.email || "",
            role: staffProfile.department || "",
            phone: staffProfile.phone_number || "",
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-pastel flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
              <Button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                variant="outline"
                className="flex items-center gap-2 rounded-full border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="mb-12">
          <Card className="bg-gradient-card-lavender rounded-3xl border-0 shadow-elegant max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 ring-4 ring-white/50 shadow-soft">
                  <AvatarImage src="/src/assets/staff-card-image.jpg" alt="Staff Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2 w-full">
                  <div className="flex items-center justify-center md:justify-between gap-3">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">{profile.name}</h2>
                      <p className="text-lg text-primary font-semibold">{profile.role}</p>
                      <p className="text-muted-foreground">{profile.email || "Department of Computer Science"}</p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setEditOpen(true)}
                      className="rounded-xl shadow-sm"
                      aria-label="Edit profile"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <span className="bg-white/30 text-foreground px-3 py-1 rounded-full text-sm">PhD Computer Science</span>
                    <span className="bg-white/30 text-foreground px-3 py-1 rounded-full text-sm">5 Years Experience</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <CardContent className="p-6 space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-card/30 rounded-xl flex items-center justify-center shadow-soft">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    
                    {/* Stats/Description */}
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-foreground">
                        {card.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {card.stats}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="w-full shadow-sm"
                    >
                      {card.action}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        currentProfile={profile}
        onProfileUpdated={setProfile}
      />

      {/* Footer */}
      <footer className="bg-card/40 backdrop-blur-sm border-t border-border/20 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Staff Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StaffDashboard;