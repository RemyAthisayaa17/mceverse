import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentFormData {
  fullName: string;
  studentId: string;
  department: string;
  yearOfStudy: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const StudentRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<StudentFormData>();

  const onSubmit = (data: StudentFormData) => {
    console.log("Student registration data:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Student Registration
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
                className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Student ID */}
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-sm font-medium text-foreground">
                Student ID
              </Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30"
                {...register("studentId", { required: "Student ID is required" })}
              />
              {errors.studentId && (
                <p className="text-sm text-destructive">{errors.studentId.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-foreground">
                Department
              </Label>
              <Select>
                <SelectTrigger className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/30">
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year of Study */}
            <div className="space-y-2">
              <Label htmlFor="yearOfStudy" className="text-sm font-medium text-foreground">
                Year of Study
              </Label>
              <Select>
                <SelectTrigger className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30">
                  <SelectValue placeholder="Select your year of study" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/30">
                  <SelectItem value="1st-year">1st Year</SelectItem>
                  <SelectItem value="2nd-year">2nd Year</SelectItem>
                  <SelectItem value="3rd-year">3rd Year</SelectItem>
                  <SelectItem value="4th-year">4th Year</SelectItem>
                </SelectContent>
              </Select>
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
                className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30"
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
                className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
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
                className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30"
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
                className="rounded-xl border-border/30 focus:border-primary/50 focus:ring-primary/30"
                {...register("confirmPassword", { required: "Please confirm your password" })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-card-lavender text-white font-medium py-3 hover:scale-105 transition-all duration-300 shadow-soft"
            >
              Register
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/student-login"
                className="text-primary hover:text-primary/80 transition-colors duration-300 underline"
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

export default StudentRegister;