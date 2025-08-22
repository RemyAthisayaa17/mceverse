import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, Briefcase } from "lucide-react";

interface StaffProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: StaffProfile;
  onProfileUpdated: (profile: StaffProfile) => void;
}

export const EditProfileModal = ({ open, onOpenChange, currentProfile, onProfileUpdated }: EditProfileModalProps) => {
  const [profile, setProfile] = useState<StaffProfile>(currentProfile);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof StaffProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name.trim() || !profile.email.trim() || !profile.role.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(profile.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (profile.phone && !validatePhone(profile.phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - in real app this would call Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onProfileUpdated(profile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        className: "bg-gradient-card-mint border-border/20",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-card-lavender border-border/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="rounded-xl border-border/30 bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className="rounded-xl border-border/30 bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Role *
            </Label>
            <Input
              id="role"
              value={profile.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              placeholder="e.g., Mathematics Teacher, Principal"
              className="rounded-xl border-border/30 bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className="rounded-xl border-border/30 bg-background/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border-border/30"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};