import { Link } from "react-router-dom";
import { LandingCard } from "@/components/LandingCard";
import staffImage from "@/assets/staff-card-image.jpg";
import studentImage from "@/assets/student-card-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-pastel flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to Smart Campus
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your gateway to digital learning and campus management
            </p>
          </div>

          {/* Cards Container - Always Horizontal */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
            {/* Staff Card */}
            <LandingCard
              title="Staff"
              description="Access teaching tools, manage classes, and track student progress"
              image={staffImage}
              alt="Professional staff members illustration in soft pastel colors"
              href="/staff-register"
              gradient="bg-gradient-card-pink"
              icon="Users"
            />
            
            {/* Student Card */}
            <LandingCard
              title="Student"
              description="Join classes, submit assignments, and track your academic journey"
              image={studentImage}
              alt="Students with books and laptops illustration in soft pastel colors"
              href="/student-register"
              gradient="bg-gradient-card-lavender"
              icon="GraduationCap"
            />
          </div>
        </div>
      </main>
      
      {/* Admin Login Link */}
      <footer className="pb-8 flex justify-center">
        <Link
          to="/admin-login"
          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-card/50"
        >
          Admin Login
        </Link>
      </footer>
    </div>
  );
};

export default Index;
