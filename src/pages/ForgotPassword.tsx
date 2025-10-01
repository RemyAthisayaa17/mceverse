import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Intentionally UI-only for now
      await new Promise((r) => setTimeout(r, 600));
      toast({
        title: "Check your inbox",
        description: "If an account exists, a reset link was sent.",
        className: "bg-gradient-card-mint border-border/20",
      });
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8 hover:shadow-hover transition-all duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password</h1>
            <p className="text-muted-foreground">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-border/30 bg-background/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-card-lavender text-primary-foreground font-medium py-3 shadow-button transition-all duration-300 hover:shadow-hover active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <div className="text-center">
              <Link to="/staff-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
