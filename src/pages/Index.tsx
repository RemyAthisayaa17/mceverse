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
          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Staff Card */}
            <LandingCard
              title="Staff"
              image={staffImage}
              alt="Professional staff members illustration in soft pastel colors"
              href="/staff-register"
              gradient="bg-gradient-card-pink"
            />
            
            {/* Student Card */}
            <LandingCard
              title="Student"
              image={studentImage}
              alt="Students with books and laptops illustration in soft pastel colors"
              href="/student-register"
              gradient="bg-gradient-card-lavender"
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
