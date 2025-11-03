import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StaffFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  yearOfStudy: string;
  password: string;
  confirmPassword: string;
}

const StaffRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormData>();

  const onSubmit = async (data: StaffFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (data.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!department || !yearOfStudy) {
      toast({
        title: "Error",
        description: "Please select department and year of study",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/staff/dashboard`,
          data: {
            full_name: data.fullName,
            department: department,
            academic_year: yearOfStudy,
            phone_number: data.phone,
          }
        },
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Registration Failed",
          description: "Unable to create account. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Wait for session to be fully established
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get fresh session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Registration Successful! 🎉",
          description: "Check your email to verify your account before logging in.",
        });
        setTimeout(() => navigate("/staff-login"), 1500);
        return;
      }

      // Try to create profiles with authenticated session
      const { error: staffProfileError } = await supabase
        .from("staff_profiles")
        .insert({
          user_id: authData.user.id,
          full_name: data.fullName.trim(),
          email: data.email.trim(),
          phone_number: data.phone.trim(),
          department: department,
          academic_year: yearOfStudy,
        });

      const { error: profilesError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: data.email.trim(),
          full_name: data.fullName.trim(),
          phone_number: data.phone.trim(),
        });

      // If direct insert failed, try edge function as fallback
      if (profilesError) {
        console.log('[staff-signup] Direct profile insert failed, trying edge function');
        const { error: edgeFnError } = await supabase.functions.invoke('safe-signup', {
          body: {
            userId: authData.user.id,
            email: data.email.trim(),
            fullName: data.fullName.trim(),
            phoneNumber: data.phone.trim(),
          }
        });

        if (edgeFnError) {
          console.error('[staff-signup] Edge function failed:', edgeFnError);
        }
      }

      if (staffProfileError) {
        console.error('[staff-signup] staff_profiles insert failed:', staffProfileError.message);
      }

      toast({
        title: "Registration Successful! 🎉",
        description: session 
          ? "You can now login with your credentials."
          : "Check your email to verify your account before logging in.",
      });
      
      setTimeout(() => {
        navigate("/staff-login");
      }, 1500);

    } catch (err: any) {
      toast({
        title: "Network Error",
        description: "Unable to complete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Staff Registration
        </h1>
        
        {/* Registration Card */}
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-primary/30"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-primary/30"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-primary/30"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-foreground">
                Department
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/30">
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year of Study */}
            <div className="space-y-2">
              <Label htmlFor="yearOfStudy" className="text-sm font-medium text-foreground">
                Teaching Year
              </Label>
              <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                <SelectTrigger className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30">
                  <SelectValue placeholder="Select teaching year" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/30">
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                  <SelectItem value="All Years">All Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-primary/30"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="rounded-xl border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-primary/30"
                {...register("confirmPassword", { required: "Please confirm your password" })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Register Button - Dark and Prominent */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-hover disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/staff-login"
                className="text-primary hover:text-primary/80 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegister;