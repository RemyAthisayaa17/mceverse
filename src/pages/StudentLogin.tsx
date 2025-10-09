import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/student/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. If you haven't registered yet, please sign up first.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account before logging in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data?.user) {
        // Check if student profile exists
        const { data: profile, error: profileError } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile check error:", profileError);
        }

      if (!profile) {
        // Auto-create student profile if missing
        console.log('[StudentLogin] Profile not found, attempting auto-creation for user:', data.user.id);
        
        const { data: newProfile, error: createError } = await supabase
          .from("student_profiles")
          .insert({
            user_id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || "Student",
            register_number: data.user.user_metadata?.register_number || "PENDING",
            academic_year: data.user.user_metadata?.academic_year || "Not Set",
            department: data.user.user_metadata?.department || "Not Set",
            phone_number: data.user.user_metadata?.phone_number || null,
          })
          .select()
          .single();

        if (createError) {
          console.error('[StudentLogin] Auto-create profile failed:', createError);
          toast({
            title: "Profile Setup Required",
            description: "Please complete your registration or contact support.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        } else {
          console.log('[StudentLogin] Profile auto-created successfully:', newProfile);
          toast({
            title: "Welcome!",
            description: "Please complete your profile information in the dashboard.",
          });
          navigate("/student/dashboard");
        }
      } else {
        console.log('[StudentLogin] Profile found, login successful:', profile);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${profile.full_name}!`,
        });
        navigate("/student/dashboard");
      }
      }
    } catch (err: any) {
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8 hover:shadow-hover transition-all duration-300">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-secondary" />
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Student Login
            </h1>
            <p className="text-muted-foreground">
              Access your student portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-input bg-background/50 focus:border-secondary focus:ring-secondary/20"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border-input bg-background/50 focus:border-secondary focus:ring-secondary/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-secondary hover:opacity-90 text-secondary-foreground font-medium py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-button disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Links */}
            <div className="space-y-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-secondary hover:text-secondary/80 transition-colors underline-offset-4 hover:underline"
              >
                Forgot Password?
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/student-register"
                  className="text-secondary hover:text-secondary/80 transition-colors underline-offset-4 hover:underline font-medium"
                >
                  Register
                </Link>
              </div>

              <Link
                to="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;