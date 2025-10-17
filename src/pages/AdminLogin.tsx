import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock } from "lucide-react";

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-purple-600">
            Admin Login
          </CardTitle>
          <CardDescription className="text-purple-500">
            Administrative Access Portal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-600 font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  className="pl-10 border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-600 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  className="pl-10 border-gray-400 bg-gray-100 text-gray-900 placeholder-gray-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Login as Admin
            </Button>
          </form>
          
          <div className="text-center space-y-4">
            <Link
              to="#"
              className="text-purple-500 hover:text-purple-600 transition-colors duration-300 text-sm underline"
            >
              Forgot Password?
            </Link>
            
            <div className="pt-4 border-t border-purple-100">
              <Link
                to="/"
                className="text-purple-400 hover:text-purple-500 transition-colors duration-300 text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;