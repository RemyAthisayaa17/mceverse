import { Link } from "react-router-dom";

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
            Admin Login
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Administrator access portal.
          </p>
          
          <div className="flex justify-center">
            <Link
              to="/"
              className="text-primary hover:text-primary/80 transition-colors duration-300 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;