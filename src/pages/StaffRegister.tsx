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
      // Use admin-signup edge function to bypass email verification and create profiles
      const { data: fnData, error: fnError } = await supabase.functions.invoke('admin-signup', {
        body: {
          role: 'staff',
          email: data.email.trim(),
          password: data.password,
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          department,
          yearOfStudy,
        }
      });

      if (fnError) {
        console.error('[staff-signup] admin-signup failed:', fnError);
        toast({
          title: 'Registration Failed',
          description: 'Could not create your account. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Immediately sign in the newly created user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      if (signInError) {
        console.error('[staff-signup] signIn failed:', signInError.message);
        toast({
          title: 'Login Failed',
          description: 'Please try logging in again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Registration Successful',
        description: 'Welcome! Your account is ready.',
      });

      navigate('/staff/dashboard');

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