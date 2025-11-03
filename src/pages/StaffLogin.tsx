import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, EyeOff } from "lucide-react";

const StaffLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if staff profile exists
        const { data: profile, error: profileError } = await supabase
          .from("staff_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('[StaffLogin] Profile check error:', profileError);
        }

        if (!profile) {
          // Try to auto-create profile from user metadata
          const metadata = data.user.user_metadata;
          if (metadata?.full_name && metadata?.department) {
            const { error: createError } = await supabase
              .from("staff_profiles")
              .insert({
                user_id: data.user.id,
                email: data.user.email || email,
                full_name: metadata.full_name,
                department: metadata.department,
                academic_year: metadata.academic_year || null,
                phone_number: metadata.phone_number || null,
              });

            if (createError) {
              console.error('[StaffLogin] Auto-create profile failed:', createError);
              toast({
                title: "Access Denied",
                description: "Profile setup incomplete. Please contact support.",
                variant: "destructive",
              });
              await supabase.auth.signOut();
              setLoading(false);
              return;
            }
          } else {
            toast({
              title: "Access Denied",
              description: "This account is not registered as staff.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
        }

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/staff/dashboard");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Staff Login
            </h1>
            <p className="text-muted-foreground">
              Access staff resources and manage courses
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
                className="w-full rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-primary/30"
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
                  className="w-full rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-primary/30 pr-10"
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
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-md transition-all duration-300 hover:shadow-hover active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Links */}
            <div className="space-y-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                Forgot Password?
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/staff-register"
                  className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline font-medium"
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

export default StaffLogin;