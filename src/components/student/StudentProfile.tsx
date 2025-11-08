import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Save, X } from "lucide-react";

interface StudentProfileProps {
  profile: any;
  onUpdate: (profile: any) => void;
}

const StudentProfile = ({ profile, onUpdate }: StudentProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone_number: profile?.phone_number || "",
    academic_year: profile?.academic_year || "",
    department: profile?.department || "",
    register_number: profile?.register_number || "",
  });
  const { toast } = useToast();

  const handleSave = async () => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Profile ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id)
        .select()
        .single();

      if (error) {
        const errorMessage = error.message.includes('violates row-level security')
          ? 'You do not have permission to update this profile'
          : 'Failed to update profile. Please try again.';
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        onUpdate(data);
        setIsEditing(false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
      academic_year: profile?.academic_year || "",
      department: profile?.department || "",
      register_number: profile?.register_number || "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-card hover:shadow-hover transition-all duration-300 rounded-2xl">
      <CardHeader className="border-b border-border/30 bg-gradient-card-lavender rounded-t-2xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-white">Personal Information</CardTitle>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="secondary"
              className="rounded-full shadow-sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                variant="default"
                className="rounded-full shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
                className="rounded-full"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!isEditing}
              className="rounded-xl border-border/30 disabled:bg-muted/30 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register_number" className="text-sm font-medium text-foreground">
              Register Number
            </Label>
            <Input
              id="register_number"
              value={formData.register_number}
              disabled
              className="rounded-xl border-border/30 bg-muted/30 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="rounded-xl border-border/30 disabled:bg-muted/30 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm font-medium text-foreground">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              disabled={!isEditing}
              className="rounded-xl border-border/30 disabled:bg-muted/30 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year" className="text-sm font-medium text-foreground">
              Academic Year
            </Label>
            <Input
              id="academic_year"
              value={formData.academic_year}
              disabled
              className="rounded-xl border-border/30 bg-muted/30 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium text-foreground">
              Department
            </Label>
            <Input
              id="department"
              value={formData.department}
              disabled
              className="rounded-xl border-border/30 bg-muted/30 cursor-not-allowed"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfile;
